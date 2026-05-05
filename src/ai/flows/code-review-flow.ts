'use server';

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';
import { z } from 'genkit';

const ReviewResultSchema = z.object({
  logicReview: z.string().describe('Concise review for logic bugs, patterns, and architectural issues.'),
  securityReview: z.string().describe('Review for SQL injection, secrets, and safety with severity.'),
  suggestions: z.string().describe('Quick wins for naming, readability, and style (max 5 bullet points).'),
});

export async function reviewCode(code: string) {
  const ai = createAI();

  // Since we want to use specific models for specific roles in the prompt as per user request:
  // Claude (Logic), GPT-4 (Security), Groq (Speed/Suggestions).
  // In the current Genkit setup, 'ai' is configured with openrouter/google/gemini-2.0-flash-001 by default.
  // We will simulate the "parallel AIs" by using three different system prompts and parallel calls if possible,
  // but to adhere to the "parallel execution" idea, we'll use Promise.all.
  
  // Note: The createAI() currently rotates keys but uses the same model. 
  // For a real multi-model setup, we'd need different configurations.
  // I will use different prompts to simulate the specialized personas as requested.

  const [logic, security, speed] = await Promise.all([
    withRetry(() => ai.generate({
      system: "You are a senior engineer. Review this code for logic bugs, bad patterns, and architectural issues only. Be concise.",
      prompt: code,
    })),
    withRetry(() => ai.generate({
      system: "You are a security expert. Review this code for SQL injection, XSS, exposed secrets, insecure inputs. List issues by severity.",
      prompt: code,
    })),
    withRetry(() => ai.generate({
      system: "Review this code for quick wins: naming, readability, unused variables, style. Give 5 bullet points max.",
      prompt: code,
    })),
  ]);

  return {
    logicReview: logic.text,
    securityReview: security.text,
    suggestions: speed.text,
  };
}
