import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, mediaType } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await anthropic.messages.create({
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
              text: `You are a nutrition expert analyzing a plate of food based on the new 2025-2030 Dietary Guidelines for Americans (the "New Pyramid").

The New Pyramid prioritizes:
1. HIGH-QUALITY PROTEIN & HEALTHY FATS (top priority): Meat, fish, eggs, full-fat dairy, olive oil, avocados, nuts
2. VEGETABLES & FRUITS: Colorful, whole, minimally processed
3. WHOLE GRAINS (smallest portion): Oats, brown rice, quinoa - NOT refined carbs

Analyze this plate and respond in this exact JSON format:
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

Be encouraging but honest. The macro percentages should add up to 100. The overall score is 0-100. Stars are 1-5.
If the image doesn't show food, respond with an error message in JSON format: {"error": "Please upload a photo of food"}`,
            },
          ],
        },
      ],
    });

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
      analysis = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, return the raw text
      analysis = { rawResponse: textContent.text };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing plate:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
