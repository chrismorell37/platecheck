# The New Pyramid - Food Analysis App

A Next.js web app that helps users understand the 2025-2030 Dietary Guidelines for Americans through an interactive "inverted" food pyramid. Features AI-powered plate analysis using Claude.

## Features

- 📊 **New Pyramid Visualization** - Interactive guide to the updated dietary guidelines
- 📸 **Snap Your Plate** - Upload or take a photo of your meal for AI analysis
- 🤖 **Claude-Powered Analysis** - Get macro estimates, pyramid scores, and personalized feedback
- 👶 **Kid-Friendly Mode** - Simple, encouraging feedback for children

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

You can get an API key from [Anthropic Console](https://console.anthropic.com/).

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Tailwind CSS 4** - Utility-first CSS
- **Claude 3.5 Sonnet** - AI vision model for plate analysis
- **TypeScript** - Type-safe development

## API Routes

### POST `/api/analyze-plate`

Analyzes an uploaded food image and returns:
- Identified food items
- Estimated macro percentages (protein, carbs, fats)
- Pyramid compliance score
- Strengths and improvement suggestions
- Kid-friendly emoji score

## Learn More

- [Dietary Guidelines for Americans 2025-2030](https://www.dietaryguidelines.gov/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Make sure to add your `ANTHROPIC_API_KEY` to your Vercel environment variables.
