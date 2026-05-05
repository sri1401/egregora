'use server';

import { createAI, textEmbedding004 } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Generate an embedding for a piece of text.
 * Used for semantic mapping in the Resonance Map.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const rotatedAI = createAI();
    const result = await rotatedAI.embed({
      embedder: textEmbedding004,
      content: text,
    });
    
    return result;
  } catch (error) {
    console.error("[Embedding] Failed to generate embedding:", error);
    // Return a zero vector of correct dimensions (768) as fallback
    return new Array(768).fill(0);
  }
}
