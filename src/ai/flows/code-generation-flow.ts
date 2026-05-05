'use server';

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';

export async function generateCode(prompt: string) {
  const ai = createAI();

  const result = await withRetry(() => ai.generate({
    system: "You are an elite software architect and senior developer. Generate high-quality, clean, and efficient code based on the user's prompt. Provide only the code and essential comments. Use a professional, arcane tone in comments if applicable.",
    prompt: prompt,
  }));

  return result.text;
}
