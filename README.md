# AdForge

AI-powered ad creation platform for Meta advertising campaigns.

## Features

- **Ad Creation**: Generate high-converting ad copy and visuals using AI
- **Competitor Research**: Analyze competitor ads and strategies
- **Meta Integration**: Direct connection to Facebook/Instagram ad accounts
- **Image Generation**: AI-powered ad creative generation
- **Export**: Export ads in multiple formats

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4, DALL-E 3, Replicate
- **Ad Platform**: Meta Marketing API

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your API keys
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for required environment variables.

## Database Setup

Run `supabase-migration.sql` in your Supabase SQL editor to set up the database schema.
