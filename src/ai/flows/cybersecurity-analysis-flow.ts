'use server';

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';

/**
 * Stage 1: Threat Detection
 * Finds attacks and identifies potential vulnerabilities.
 */
export async function detectionStage(target: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are a Threat Detection Agent. Your goal is to identify potential cyber attacks, intrusion attempts, and vulnerabilities in the provided target context. Be thorough and alert.",
    prompt: `Analyze the following target for threats: ${target}`,
  }));
  return result.text;
}

/**
 * Stage 2: Behavior Analysis
 * Checks for unusual or anomalous behavior patterns.
 */
export async function behaviorStage(target: string, detectionData: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are a Behavior Analysis Agent. Using the detection data, check for unusual or anomalous behavior patterns in the system. Identify indicators of compromise (IoC) and lateral movement.",
    prompt: `Detection Data: ${detectionData}\n\nTarget Context: ${target}`,
  }));
  return result.text;
}

/**
 * Stage 3: Risk Assessment
 * Calculates the risk and potential impact.
 */
export async function riskStage(target: string, behaviorData: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are a Risk Assessment Agent. Based on the behavior analysis, calculate the risk level (Low, Medium, High, Critical) and potential impact. Provide a quantitative or semi-quantitative risk score.",
    prompt: `Behavior Data: ${behaviorData}\n\nTarget Context: ${target}`,
  }));
  return result.text;
}

/**
 * Stage 4: Decision Engine
 * Suggests security actions and mitigation strategies.
 */
export async function decisionStage(target: string, riskData: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are a Decision Engine Agent. Suggest specific security actions, firewall rules, or mitigation strategies based on the risk assessment. Prioritize actions by urgency.",
    prompt: `Risk Data: ${riskData}\n\nTarget Context: ${target}`,
  }));
  return result.text;
}

/**
 * Stage 5: Forensic Reporting
 * Generates a comprehensive final report.
 */
export async function reportStage(target: string, decisionData: string) {
  const ai = createAI();
  const result = await withRetry(() => ai.generate({
    system: "You are a Forensic Reporting Agent. Synthesize all previous analysis into a professional cybersecurity report. Include summaries of threats, behaviors, risks, and final decisions. Use a clinical, authoritative tone.",
    prompt: `Decision Data: ${decisionData}\n\nOriginal Target: ${target}`,
  }));
  return result.text;
}

/**
 * Full Multi-Agent Cybersecurity Analysis
 */
export async function runCybersecurityAnalysis(target: string) {
  const detection = await detectionStage(target);
  const behavior = await behaviorStage(target, detection);
  const risk = await riskStage(target, behavior);
  const decision = await decisionStage(target, risk);
  const report = await reportStage(target, decision);

  return {
    detection,
    behavior,
    risk,
    decision,
    report
  };
}
