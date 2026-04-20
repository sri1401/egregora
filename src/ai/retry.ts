/**
 * @fileOverview Retry utility with exponential backoff for handling rate-limited API calls.
 */

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 5000; // 5 seconds base delay
const DEFAULT_MAX_DELAY_MS = 60000; // 60 seconds max delay

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extracts the retry-after delay from a Genkit rate limit error message, if present.
 */
function extractRetryAfterSeconds(error: unknown): number | null {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = String((error as { message: string }).message);
    const match = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
    if (match) {
      return Math.ceil(parseFloat(match[1]));
    }
  }
  return null;
}

/**
 * Checks if an error is a rate-limit (429 / RESOURCE_EXHAUSTED) error.
 */
function isRateLimitError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;
    if (err.status === 'RESOURCE_EXHAUSTED' || err.code === 429) return true;
    if (typeof err.message === 'string' && (
      err.message.includes('429') ||
      err.message.includes('RESOURCE_EXHAUSTED') ||
      err.message.includes('Too Many Requests') ||
      err.message.includes('quota')
    )) return true;
  }
  return false;
}

/**
 * Wraps an async function with retry logic and exponential backoff.
 * Only retries on rate-limit errors (429 / RESOURCE_EXHAUSTED).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelayMs = DEFAULT_BASE_DELAY_MS,
    maxDelayMs = DEFAULT_MAX_DELAY_MS,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRateLimitError(error) || attempt === maxRetries) {
        throw error;
      }

      // Use server-suggested delay if available, otherwise exponential backoff
      const serverDelay = extractRetryAfterSeconds(error);
      const backoffDelay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
      const delayMs = serverDelay ? serverDelay * 1000 + 1000 : backoffDelay;

      console.warn(
        `[Retry] Rate limited (attempt ${attempt + 1}/${maxRetries}). ` +
        `Retrying in ${Math.round(delayMs / 1000)}s...`
      );

      await sleep(delayMs);
    }
  }

  throw lastError;
}

/**
 * A simple delay utility for spacing out sequential API calls.
 */
export async function rateLimitDelay(ms: number = 3000): Promise<void> {
  return sleep(ms);
}
