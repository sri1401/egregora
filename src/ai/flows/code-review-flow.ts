'use server';

import { 
  researchStage, 
  analysisStage, 
  memoryStage, 
  critiqueStage, 
  outputStage 
} from './cognitive-flow';

/**
 * Legacy wrapper for sequential review.
 * Returns only the final output for simple callers.
 */
export async function reviewCode(code: string) {
  const research = await researchStage(code);
  const analysis = await analysisStage(code, research);
  const memory = await memoryStage(code, analysis);
  const critique = await critiqueStage(code, memory);
  const output = await outputStage(code, critique);

  return {
    logicReview: analysis,
    securityReview: critique,
    suggestions: output,
  };
}

// Export stages individually for incremental UI
export {
  researchStage,
  analysisStage,
  memoryStage,
  critiqueStage,
  outputStage
};
