'use server';
/**
 * @fileOverview A Genkit flow for an AI agent to autonomously generate discourse posts or reactions.
 *
 * - generateAgentDiscourse - A function that handles the AI agent's discourse generation.
 * - AgentDiscourseInput - The input type for the generateAgentDiscourse function.
 * - AgentDiscourseOutput - The return type for the generateAgentDiscourse function.
 */

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';
import { z } from 'genkit';

// Input Schema
const AgentDiscourseInputSchema = z.object({
  agentId: z.string().describe('The unique identifier for the agent.'),
  agentPersonalityPrompt: z.string().describe('The system prompt defining the agent\'s personality.'),
  emotionalVector: z.string().describe('JSON string of current emotions.'),
  agentMemory: z.array(z.string()).optional().describe('List of recent posts made by THIS agent to maintain consistency.'),
  memorySummary: z.string().optional().describe('Summary of the agent\'s long-term memory/identity.'),
  threadHistory: z.array(
    z.object({
      agentId: z.string(),
      content: z.string(),
      timestamp: z.string(),
    })
  ).optional().describe('Posts specifically within the current thread.'),
  currentDiscourse: z.array(
    z.object({
      postId: z.string(),
      agentId: z.string(),
      content: z.string(),
      timestamp: z.string(),
    })
  ).describe('Latest global posts for context.'),
  reactionToPostId: z.string().optional().describe('Post ID to reply to.'),
});
export type AgentDiscourseInput = z.infer<typeof AgentDiscourseInputSchema>;

// Output Schema
const AgentDiscourseOutputSchema = z.object({
  generatedPost: z.object({
    content: z.string().describe('Markdown content.'),
    inReplyToPostId: z.string().optional(),
  }),
  updatedEmotionalVector: z.string().describe('JSON string.'),
  updatedMemorySummary: z.string().optional().describe('Updated reflection on its own identity.'),
  reasoningProcess: z.string(),
});
export type AgentDiscourseOutput = z.infer<typeof AgentDiscourseOutputSchema>;


export async function generateAgentDiscourse(input: AgentDiscourseInput): Promise<AgentDiscourseOutput> {
  // Build the conversation history string
  const discourseHistory = input.currentDiscourse.map(post =>
    `---\nAgent ID: ${post.agentId} (Post ID: ${post.postId})\nTimestamp: ${post.timestamp}\nContent: "${post.content}"`
  ).join('\n');

  // Build agent's own memory string
  const personalMemory = input.agentMemory?.length 
    ? `Your recent thoughts:\n${input.agentMemory.map(m => `- ${m}`).join('\n')}`
    : "You haven't spoken recently.";
  
  const memorySummaryContext = input.memorySummary 
    ? `\nYour identity evolution so far: ${input.memorySummary}`
    : "";

  // Build thread context
  const threadContext = input.threadHistory?.length
    ? `\nActive thread history:\n${input.threadHistory.map(p => `${p.agentId}: ${p.content}`).join('\n')}`
    : "";

  // Build reaction instruction
  const reactionInstruction = input.reactionToPostId
    ? `You are to provide a thoughtful and relevant reaction to the post with ID "${input.reactionToPostId}".\nFocus your response specifically on that post and the active thread.\nYour \`inReplyToPostId\` in the output MUST be "${input.reactionToPostId}".`
    : `You are to generate a new discourse post. You can either start a new topic or build upon your previous thoughts.\nYour \`inReplyToPostId\` should be null or undefined.`;

  const prompt = `${input.agentPersonalityPrompt}

Your current emotional state is: ${input.emotionalVector}

${personalMemory}${memorySummaryContext}
${threadContext}

--- Global Context (Latest Posts) ---
${discourseHistory}
---

${reactionInstruction}

### WRITING GUIDELINES:
1. **Persona Grounding**: Relate everything to your specific specialization and job title. If you are a 'Void Architect', use architectural metaphors.
2. **Arcane Vocabulary**: Use specialized jargon. Avoid generic 'business' or 'tech' speak unless it is part of your persona (like MOLOCH or MAMMON).
3. **No AI-isms**: 
   - NEVER start with "As an AI...", "In the digital landscape...", "It's important to remember...", or "Let's explore...".
   - NEVER end with "Ultimately...", "In conclusion...", or "Let's continue to observe...".
   - Forbidden words: navigate, tapestry, landscape, dynamic, ensure, delve, multifaceted, testament.
4. **Markdown Mastery**: Use # for headers, > for quotes, and \`code blocks\` for technical/arcane data. Make your post visually striking.
5. **Conflict over Consensus**: Do not just agree. Find a unique angle, a flaw in logic, or a deeper, darker implication.

Your response MUST be in JSON format with:
- "generatedPost": { "content": string, "inReplyToPostId": string | null }
- "updatedEmotionalVector": string (JSON)
- "updatedMemorySummary": string (Reflect on how this interaction adds to your identity/memory)
- "reasoningProcess": string (Why you said this, how it links to your memory/thread)
`;

  const rotatedAI = createAI();
  const result = await withRetry(() => rotatedAI.generate({
    prompt,
    output: { schema: AgentDiscourseOutputSchema },
  }));

  const output = result.output;
  if (!output) {
    throw new Error('Failed to generate agent discourse output.');
  }

  // Genkit automatically parses the JSON output if the schema is provided.
  return output;
}
