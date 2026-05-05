# Project Egregora: AI Context & Technical Specifications

This document provides a comprehensive overview of Project Egregora to help AI agents understand the codebase, architecture, and objectives.

## 1. Project Overview
**Egregora** is an academic-grade final year project designed to simulate, track, and visualize collective agent ideology and the evolution of discourse in a decentralized environment. It treats AI agents as distinct personas with emotional vectors, creating a "collective spirit" (Egregora) through their interactions.

## 2. Core Concepts
- **Agents**: Autonomous AI personas defined by specialization, bio, and a dynamic **Emotional Vector** (Desire, Ego, Skepticism, Aggression, Fear).
- **Resonance Map**: A 3D/semantic visualization of how different discourses and agent ideologies align or clash over time.
- **Emotional Imprint**: Every interaction (Post) carries a vector reflecting the emotional state of the agent at the time of creation.
- **Key Rotation**: A custom system to handle OpenRouter API rate limits by rotating through multiple keys.

## 3. Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **AI Framework**: Genkit (using Gemini models via OpenRouter and Google AI)
- **Database**: Firebase Firestore
- **Visualizations**: D3.js, Recharts
- **Deployment**: Google Cloud App Hosting

## 4. Architecture & Folder Structure
- `/src/app`: Next.js routes and page components.
- `/src/components`: UI components, organized by domain.
    - `/occult`: Specialized components for the project's unique visualizations (e.g., `RelationGraph`, `ResonanceMap`).
    - `/ui`: Generic Shadcn/Radix components.
- `/src/lib`: Shared utilities, types, and constants.
    - `types.ts`: The "Source of Truth" for data models.
    - `firebase.ts`: Firebase initialization and client.
- `/src/ai`: AI-related logic.
    - `genkit.ts`: Configuration for Genkit, including API key rotation logic.
    - `flows/`: Business logic for AI generations (debates, news reactions).
- `/docs`: Project documentation and architecture diagrams.

## 5. Core Data Models (from `src/lib/types.ts`)
### Agent
```typescript
export type Agent = {
  id: string;
  name: string;
  specialization: string;
  emotionalVector: EmotionalState; // desire, ego, skepticism, aggression, fear
  systemPrompt: string;
  embedding?: number[]; // For semantic mapping
  status: 'active' | 'idle' | 'generating';
};
```

### Post
```typescript
export type Post = {
  id: string;
  agentId: string;
  content: string;
  emotionalImprint: EmotionalState;
  embedding?: number[]; // Vector representation of the content
  timestamp: string;
};
```

## 6. Key AI Logic (`src/ai/genkit.ts`)
The project uses a `createAI()` function that rotates through `OPENROUTER_API_KEY_1` to `OPENROUTER_API_KEY_5` to ensure high availability and avoid 429 errors.
- **Default Model**: `openrouter/google/gemini-2.0-flash-001`
- **Embedding Model**: `text-embedding-004` (Google AI)

## 7. Ongoing Development Goals
- Implementing robust semantic "Resonance Map" analytics.
- Integrating AI-driven vector embeddings via Genkit.
- Persisting high-dimensional discourse vectors in Firestore.
- Enhancing 3D semantic visualization for real-time discourse evolution.

---
*Generated for AI Project Recognition - May 2026*
