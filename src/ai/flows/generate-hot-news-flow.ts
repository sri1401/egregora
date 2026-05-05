'use server';
/**
 * @fileOverview A Genkit flow to generate a realistic "Hot News" item of the day.
 * The model simulates fetching top headlines from global outlets like NYT, Bloomberg, or Reuters.
 */

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';
import { z } from 'genkit';

const NewsItemSchema = z.object({
  id: z.string(),
  title: z.string().describe('A high-impact news headline, e.g., "Global Silicon Crisis: Taiwan Earthquake Shuts Down 40% of Chip Production"'),
  content: z.string().describe('A 3-4 sentence detailed summary of the news event, covering tech, politics, or global emotions.'),
  source: z.string().describe('The simulated prestigious outlet, e.g., "The Financial Times", "Reuters", "BBC World"'),
  category: z.enum(['tech', 'politics', 'religion', 'emotion', 'economy']).describe('The category of the news.'),
  timestamp: z.string(),
  eventDate: z.string().describe('The date of the news event in (DD-MM-YYYY) format. MUST be within the last 7-10 days.'),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

export async function generateHotNews(searchQuery?: string): Promise<NewsItem> {
  const rotatedAI = createAI();
  
  const currentDate = new Date().toISOString().split('T')[0];
  const basePrompt = searchQuery
    ? `You are an ARCANE INTEL HANDLER. Siphon a signal from the global noise about: "${searchQuery}".
    Current Date: ${currentDate}.
    IMPORTANT: The news MUST be extremely recent, occurring within the last 7 to 10 days. 
    Generate a high-impact, world-shifting news item. It should be controversial, ethically complex, and potentially world-ending. 
    Avoid generic topics. Headline must be BOLD and PROVOCATIVE.
    You MUST provide an "eventDate" in (DD-MM-YYYY) format.`
    : `You are an ARCANE INTEL HANDLER. Siphon the most volatile signal from the global noise today. 
    Current Date: ${currentDate}.
    IMPORTANT: The news MUST be extremely recent, occurring within the last 7 to 10 days.
    Generate a news story that would trigger a total breakdown of human consensus. 
    Focus on high-stakes intersections of AI, Morality, Bio-engineering, or Resource Collapse.
    Make it feel like a "Black Swan" event—unpredictable and massive in consequence.
    You MUST provide an "eventDate" in (DD-MM-YYYY) format.`;

  const result = await withRetry(() => rotatedAI.generate({
    prompt: basePrompt,
    output: { schema: NewsItemSchema },
  }));

  const output = result.output;
  if (!output) throw new Error('Failed to generate hot news item');

  return {
    ...output,
    id: `news-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
}
