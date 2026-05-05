import { genkit } from 'genkit';
import { openAICompatible } from '@genkit-ai/compat-oai';
import { googleAI, textEmbedding004 } from '@genkit-ai/googleai';

/**
 * OpenRouter API key rotation system.
 */

const OPENROUTER_KEYS = [
  process.env.OPENROUTER_API_KEY_1,
  process.env.OPENROUTER_API_KEY_2,
  process.env.OPENROUTER_API_KEY_3,
  process.env.OPENROUTER_API_KEY_4,
  process.env.OPENROUTER_API_KEY_5,
].filter((key): key is string => !!key && key.length > 0);

if (OPENROUTER_KEYS.length === 0) {
  throw new Error('No OpenRouter API keys found in environment variables. Set OPENROUTER_API_KEY_1 through OPENROUTER_API_KEY_5 in .env');
}

let currentKeyIndex = 0;

/**
 * Gets the next API key in the rotation and advances the index.
 */
export function getNextApiKey(): string {
  const key = OPENROUTER_KEYS[currentKeyIndex % OPENROUTER_KEYS.length];
  currentKeyIndex++;
  console.log(`[KeyRotation] Using API key #${((currentKeyIndex - 1) % OPENROUTER_KEYS.length) + 1} of ${OPENROUTER_KEYS.length}`);
  return key;
}

/**
 * Creates a new Genkit AI instance with the next rotated API key and Google AI support.
 */
export function createAI() {
  const apiKey = getNextApiKey();
  return genkit({
    plugins: [
      openAICompatible({
        name: 'openrouter',
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
      }),
      googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }),
    ],
    model: 'openrouter/google/gemini-2.0-flash-001',
  });
}

// Default instance
export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'openrouter',
      apiKey: OPENROUTER_KEYS[0],
      baseURL: 'https://openrouter.ai/api/v1',
    }),
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }),
  ],
  model: 'openrouter/google/gemini-2.0-flash-001',
});

// Export embedding model reference
export { textEmbedding004 };
