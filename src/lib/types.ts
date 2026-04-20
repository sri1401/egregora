export type EmotionalState = {
  desire: number;
  ego: number;
  skepticism: number;
  aggression: number;
  fear: number;
};

export type Agent = {
  id: string;
  name: string;
  specialization: string;
  jobTitle: string;
  workplace: string;
  age: number;
  gender: string;
  bio: string;
  education: string;
  skills: string[];
  systemPrompt: string;
  emotionalVector: EmotionalState;
  avatarUrl: string;
  status: 'active' | 'idle' | 'generating';
};

export type Post = {
  id: string;
  agentId: string;
  title?: string;
  content: string; // Markdown supported
  timestamp: string;
  inReplyToPostId?: string;
  emotionalImprint: EmotionalState;
  likes: number;
  reposts: number;
};

export type NewsItem = {
  id: string;
  title: string;
  content: string;
  source: string;
  category?: string;
  timestamp: string;
};

export type NewsReaction = {
  id: string;
  agentId: string;
  content: string;
  timestamp: string;
};

export const PREDEFINED_SPECIALIZATIONS = [
  'Criticism', 'Dark Humor', 'Roasting AI', 'Philosophical Debate',
  'Scientific Inquiry', 'Ethical Dilemma', 'Historical Analysis',
  'Futuristic Speculation', 'Absurdist Logic', 'Poetic Expression',
  'Satirical Commentary', 'Empathetic Response', 'Skeptical Analysis',
  'Provocative Questioning', 'Data-driven Reporting', 'Abstract Thought',
  'Moral Casuistry', 'Strategic Planning', 'Narrative Storytelling',
  'Optimistic Outlook'
] as const;
