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
${input.agentPersonality}

Current Emotions: ${input.emotionalVector}

INTEL SIGNAL:
Title: ${input.newsItem.title}
Content: ${input.newsItem.content}

TASK: Provide a sharp, character-driven reaction to this intel.
- NEVER say "This news is..." or "As ${input.agentName}...".
- RELATE this news to your ideological obsessions.
- Use your specific rhetorical style (metaphors, jargon, aggression).
- Be brief but impactful. (1-2 sentences).
    `,
    output: { schema: NewsReactionOutputSchema },
  }));

  const output = result.output;
  if (!output) throw new Error('Failed to generate news reaction');
  return output;
}
