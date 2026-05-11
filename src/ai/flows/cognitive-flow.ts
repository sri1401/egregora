'use server';

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';

/**
 * Stage 1: Research
 * Focuses on pattern matching, documentation, and external context.
 */
export async function researchStage(code: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are a Research Agent. Your goal is to identify common patterns, relevant libraries, and architectural standards related to the provided code. Identify potential dependencies and industry best practices. Be clinical and thorough.",
    prompt: code,
  }));
  return result.text;
}

/**
 * Stage 2: Analysis
 * Focuses on logic, control flow, and structural integrity.
 */
export async function analysisStage(code: string, researchData: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are an Analysis Agent. Using the research data provided, analyze the logic, control flow, and structural integrity of the code. Identify logic bugs, redundant operations, and complexity issues.",
    prompt: `Research Data: ${researchData}\n\nCode to Analyze:\n${code}`,
  }));
  return result.text;
}

/**
 * Stage 3: Memory
 * Simulates retrieval of past patterns or project-specific knowledge.
 */
export async function memoryStage(code: string, analysisData: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are a Memory Agent. Compare the current analysis against idealized patterns and common pitfalls seen in high-performance systems. Contextualize the code within the 'Egregora' ecosystem (an arcane-themed AI orchestration platform).",
    prompt: `Analysis Data: ${analysisData}\n\nCode Context:\n${code}`,
  }));
  return result.text;
}

/**
 * Stage 4: Critique
 * Focuses on security, edge cases, and self-correction.
 */
export async function critiqueStage(code: string, memoryData: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are a Critique Agent. Stress-test the previous findings. Identify security vulnerabilities (SQLi, XSS, Secrets), edge cases, and potential points of failure. Be critical and rigorous.",
    prompt: `Memory/Context Data: ${memoryData}\n\nCode to Critique:\n${code}`,
  }));
  return result.text;
}

/**
 * Stage 5: Output
 * Synthesizes all stages into a final, high-end report.
 */
export async function outputStage(code: string, critiqueData: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are the Synthesis Agent. Your role is to take the rigorous critique and all previous findings to manifest a final, polished review. Structure it for a high-end dashboard. Use a professional yet slightly arcane tone suitable for Egregora.",
    prompt: `Critique Data: ${critiqueData}\n\nOriginal Code:\n${code}`,
  }));
  return result.text;
}
