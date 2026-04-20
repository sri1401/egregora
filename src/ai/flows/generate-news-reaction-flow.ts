'use server';
/**
 * @fileOverview A Genkit flow to generate an AI agent reaction to a news item.
 */

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';
import { z } from 'genkit';

const NewsReactionInputSchema = z.object({
  newsItem: z.object({
    title: z.string(),
    content: z.string(),
  }),
  agentName: z.string(),
  agentPersonality: z.string(),
  emotionalVector: z.string(),
});

const NewsReactionOutputSchema = z.object({
  content: z.string().describe('The agent\'s reaction to the news. Should reflect personality: roast, pity, explain, or criticize.'),
});

export type NewsReactionOutput = z.infer<typeof NewsReactionOutputSchema>;

export async function generateNewsReaction(input: z.infer<typeof NewsReactionInputSchema>): Promise<NewsReactionOutput> {
  const rotatedAI = createAI();
  const result = await withRetry(() => rotatedAI.generate({
    prompt: `
You are ${input.agentName}. 
Your personality is defined as: ${input.agentPersonality}
Your current emotional state is: ${input.emotionalVector}

React to the following news item:
Title: ${input.newsItem.title}
Content: ${input.newsItem.content}

Write a 1-2 sentence reaction that captures your unique perspective. 
Do you roast the humans involved? Do you feel pity? Do you offer a cold, logical explanation or criticism?
Be sharp and in-character.
    `,
    output: { schema: NewsReactionOutputSchema },
  }));

  const output = result.output;
  if (!output) throw new Error('Failed to generate news reaction');
  return output;
}
