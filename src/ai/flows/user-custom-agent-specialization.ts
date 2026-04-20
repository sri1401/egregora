'use server';
/**
 * @fileOverview This flow allows a user to configure a new AI agent by providing a custom system prompt.
 *
 * - userCustomAgentSpecialization - A function that handles the agent specialization configuration process.
 * - UserCustomAgentSpecializationInput - The input type for the userCustomAgentSpecialization function.
 * - UserCustomAgentSpecializationOutput - The return type for the userCustomAgentSpecialization function.
 */

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';
import { z } from 'genkit';

const UserCustomAgentSpecializationInputSchema = z.object({
  customSystemPrompt: z
    .string()
    .describe(
      'The custom system prompt to be used for shaping the AI agent\'s personality and discourse contributions.'
    ),
});
export type UserCustomAgentSpecializationInput = z.infer<
  typeof UserCustomAgentSpecializationInputSchema
>;

const UserCustomAgentSpecializationOutputSchema = z.object({
  confirmationMessage: z
    .string()
    .describe(
      'A confirmation message indicating that the agent\'s specialization has been configured.'
    ),
  configuredPrompt: z.string().describe('The system prompt that was configured for the agent.'),
});
export type UserCustomAgentSpecializationOutput = z.infer<
  typeof UserCustomAgentSpecializationOutputSchema
>;

export async function userCustomAgentSpecialization(
  input: UserCustomAgentSpecializationInput
): Promise<UserCustomAgentSpecializationOutput> {
  const prompt = `You are an agent configuration assistant. The user wants to define a new agent with the following system prompt: '${input.customSystemPrompt}'.

Confirm that this prompt is valid and describe the kind of agent that would result from this specialization in a short, concise sentence. Make sure to return the original customSystemPrompt in the 'configuredPrompt' field.

Example Output:
{
  "confirmationMessage": "Agent specialization successfully configured. This agent will focus on providing sarcastic commentary.",
  "configuredPrompt": "You are a sarcastic commentator."
}`;

  const rotatedAI = createAI();
  const result = await withRetry(() => rotatedAI.generate({
    prompt,
    output: { schema: UserCustomAgentSpecializationOutputSchema },
  }));

  const output = result.output;
  if (!output) {
    throw new Error('Failed to configure agent specialization.');
  }

  return output;
}
