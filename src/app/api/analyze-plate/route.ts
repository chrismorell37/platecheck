import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ANALYSIS_PROMPT = `You are a nutrition expert analyzing food based on the new 2025-2030 Dietary Guidelines for Americans (the "New Pyramid").

The New Pyramid prioritizes:
1. HIGH-QUALITY PROTEIN & HEALTHY FATS (top priority): Meat, fish, eggs, full-fat dairy, olive oil, avocados, nuts
2. VEGETABLES & FRUITS: Colorful, whole, minimally processed
3. WHOLE GRAINS (smallest portion): Oats, brown rice, quinoa - NOT refined carbs

IMPORTANT: Be flexible when identifying food! Even if the image is slightly blurry, at an angle, partially visible, or taken in low light, do your best to identify what foods are present. Look for ANY food items - meals, snacks, drinks, ingredients, etc. If you can make a reasonable guess about what food is shown, provide your analysis.

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "foodItems": ["item1", "item2", "item3"],
  "macroEstimate": {
    "protein": 25,
    "carbs": 45,
    "fats": 30
  },
  "pyramidScore": {
    "overall": 75,
    "proteinQuality": "good",
    "vegetableScore": "needs improvement",
    "grainQuality": "good"
  },
  "feedback": {
    "strengths": ["Good protein source", "Healthy fats present"],
    "improvements": ["Add more colorful vegetables", "Consider whole grain option"]
  },
  "kidFriendlyScore": {
    "emoji": "🌟",
    "message": "Great Protein! Add some greens for superpowers!",
    "stars": 4
  }
}

Be encouraging but honest. The macro percentages should add up to 100. The overall score is 0-100. Stars are 1-5. Only respond with the JSON object, no other text.`;

export async function POST(request: NextRequest) {
  try {
    const { image, mediaType, foodItems } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    let response;

    // If foodItems provided, re-analyze based on the food list (no image needed)
    if (foodItems && Array.isArray(foodItems) && foodItems.length > 0) {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${ANALYSIS_PROMPT}

Analyze this list of foods on a plate: ${foodItems.join(', ')}

Keep the foodItems array exactly as provided. Estimate macros, score, and feedback based on these foods.`,
          },
        ],
      });
    } 
    // Otherwise, analyze the image
    else if (image) {
      // Log image size for debugging
      const imageSizeKB = Math.round((image.length * 3) / 4 / 1024);
      console.log(`Processing image: ${imageSizeKB}KB, type: ${mediaType}`);
      
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: `${ANALYSIS_PROMPT}

Analyze this plate image. If the image doesn't show food, respond with: {"error": "Please upload a photo of food"}`,
              },
            ],
          },
        ],
      });
    } else {
      return NextResponse.json(
        { error: 'No image or food items provided' },
        { status: 400 }
      );
    }

    // Extract the text content from Claude's response
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      let jsonStr = textContent.text;
      const jsonMatch = jsonStr.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      // Also try to find JSON without code blocks
      if (!jsonMatch) {
        const plainJsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (plainJsonMatch) {
          jsonStr = plainJsonMatch[0];
        }
      }
      analysis = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, check if it's an error message from Claude
      const text = textContent.text.toLowerCase();
      if (text.includes("can't") || text.includes("cannot") || text.includes("unable") || text.includes("don't see")) {
        return NextResponse.json({ 
          error: "Couldn't identify food in this image. Please try a clearer photo of your meal." 
        });
      }
      // Return the raw text for debugging
      analysis = { rawResponse: textContent.text };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing plate:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to analyze image: ${errorMessage}` },
      { status: 500 }
    );
  }
}
