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
  // Execute sequentially one by one to avoid rate limits and rotate API keys per request
  const logic = await withRetry(() => createAI().generate({
    system: "You are a senior engineer. Review this code for logic bugs, bad patterns, and architectural issues only. Be concise.",
    prompt: code,
  }));

  const security = await withRetry(() => createAI().generate({
    system: "You are a security expert. Review this code for SQL injection, XSS, exposed secrets, insecure inputs. List issues by severity.",
    prompt: code,
  }));

  const speed = await withRetry(() => createAI().generate({
    system: "Review this code for quick wins: naming, readability, unused variables, style. Give 5 bullet points max.",
    prompt: code,
  }));

  return {
    logicReview: logic.text,
    securityReview: security.text,
    suggestions: speed.text,
  };
}
