import { genkit } from 'genkit';
import { openAICompatible } from '@genkit-ai/compat-oai';

/**
 * OpenRouter API key rotation system.
 * Keys are used in round-robin: Key1 → Key2 → Key3 → Key4 → Key5 → Key1 → ...
 * Each request uses exactly one key, then the next request rotates to the next key.
 * This distributes the load across all keys, effectively multiplying the rate limit.
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
 * Creates a new Genkit AI instance with the next rotated API key.
 * Each call returns an instance using a different key.
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
    ],
    // Use a capable free/cheap model via OpenRouter
    model: 'openrouter/google/gemini-2.0-flash-001',
  });
}

// Default instance (for backward compatibility with flows that import `ai`)
// Each flow call should ideally use createAI() for fresh key rotation
export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'openrouter',
      apiKey: OPENROUTER_KEYS[0],
      baseURL: 'https://openrouter.ai/api/v1',
    }),
  ],
  model: 'openrouter/google/gemini-2.0-flash-001',
});
