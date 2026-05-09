'use server';

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';

export async function runCybersecurityAnalysis(scenario: string) {
  // Execute sequentially to simulate the chain and avoid rate limits
  
  // 1. Threat Detection Agent
  const threatDetection = await withRetry(() => createAI().generate({
    system: "You are the Threat Detection Agent in a cybersecurity cognitive analysis system. Your job is to analyze the provided scenario or logs and find potential attacks. Identify the attack vectors and indicators of compromise (IoCs). Be highly technical and concise.",
    prompt: `Analyze this scenario: ${scenario}`,
  }));

  // 2. Behavior Agent
  const behavior = await withRetry(() => createAI().generate({
    system: "You are the Behavior Agent. Based on the threat detection analysis, identify any unusual user or system behavior anomalies. Explain the anomalous patterns.",
    prompt: `Threat Detection Report: ${threatDetection.text}\n\nOriginal Scenario: ${scenario}`,
  }));

  // 3. Risk Agent
  const risk = await withRetry(() => createAI().generate({
    system: "You are the Risk Agent. Calculate and assess the risk level (Critical, High, Medium, Low) based on the threat and behavior reports. Provide a brief justification.",
    prompt: `Threat Report: ${threatDetection.text}\n\nBehavior Report: ${behavior.text}`,
  }));

  // 4. Decision Agent
  const decision = await withRetry(() => createAI().generate({
    system: "You are the Decision Agent. Based on the risk assessment and previous reports, suggest immediate security actions, mitigation strategies, and remediation steps.",
    prompt: `Risk Assessment: ${risk.text}\n\nThreat Report: ${threatDetection.text}`,
  }));

  // 5. Report Agent
  const report = await withRetry(() => createAI().generate({
    system: "You are the Report Agent. Synthesize the findings from the Threat, Behavior, Risk, and Decision agents into a final, executive summary report.",
    prompt: `Threat: ${threatDetection.text}\nBehavior: ${behavior.text}\nRisk: ${risk.text}\nDecision: ${decision.text}`,
  }));

  return {
    threatDetection: threatDetection.text,
    behavior: behavior.text,
    risk: risk.text,
    decision: decision.text,
    report: report.text,
  };
}
