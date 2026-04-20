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
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

export async function generateHotNews(searchQuery?: string): Promise<NewsItem> {
  const rotatedAI = createAI();
  
  const basePrompt = searchQuery
    ? `Generate a realistic, high-impact news item about: "${searchQuery}".
    Create a breaking news story related to this topic that would provoke intense debate.
    The tone should be professional and journalistic, simulating a top-tier global news organization.
    Make the headline dramatic and attention-grabbing.`
    : `Generate a realistic, high-impact news item for today. 
    It should be a "Hot News" story that would provoke intense debate. 
    Topics can vary between cutting-edge technology, global politics, religious shifts, or profound human emotional crises.
    The tone should be professional and journalistic, simulating a top-tier global news organization.`;

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
