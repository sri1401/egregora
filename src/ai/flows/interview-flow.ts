'use server';

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';

export async function runInterviewAnalysis(resume: string, transcript: string) {
  // Execute sequentially to simulate the chain and avoid rate limits
  
  // 1. Resume Agent
  const resumeAnalysis = await withRetry(() => createAI().generate({
    system: "You are the Resume Agent in a Smart Interview System. Your job is to read the candidate's resume and extract the core technical skills, experience level, and key achievements. Keep it concise.",
    prompt: `Candidate Resume:\n${resume}`,
  }));

  // 2. Technical Agent
  const technicalAnalysis = await withRetry(() => createAI().generate({
    system: "You are the Technical Agent. Based on the resume analysis, evaluate the candidate's technical answers provided in the interview transcript. Did they answer correctly? Do their answers reflect the experience claimed in the resume?",
    prompt: `Resume Analysis: ${resumeAnalysis.text}\n\nInterview Transcript: ${transcript}`,
  }));

  // 3. Communication Agent
  const communicationAnalysis = await withRetry(() => createAI().generate({
    system: "You are the Communication Agent. Analyze the interview transcript to evaluate the candidate's speaking skills, clarity, vocabulary, and ability to articulate complex ideas.",
    prompt: `Interview Transcript:\n${transcript}`,
  }));

  // 4. Emotion Agent
  const emotionAnalysis = await withRetry(() => createAI().generate({
    system: "You are the Emotion Agent. Detect the candidate's confidence level, enthusiasm, and potential anxiety based on their word choices, hesitations (e.g., 'um', 'uh'), and tone in the transcript.",
    prompt: `Interview Transcript:\n${transcript}`,
  }));

  // 5. Scoring Agent
  const scoring = await withRetry(() => createAI().generate({
    system: "You are the Scoring Agent. Based on the reports from the Technical, Communication, and Emotion agents, calculate a final interview score out of 100. Provide a final 'Hire' or 'No Hire' recommendation with a brief justification.",
    prompt: `Technical: ${technicalAnalysis.text}\nCommunication: ${communicationAnalysis.text}\nEmotion: ${emotionAnalysis.text}`,
  }));

  return {
    resume: resumeAnalysis.text,
    technical: technicalAnalysis.text,
    communication: communicationAnalysis.text,
    emotion: emotionAnalysis.text,
    score: scoring.text,
  };
}
