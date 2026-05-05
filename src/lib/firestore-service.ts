/**
 * @fileOverview Firestore service layer for Egregora data persistence.
 * Provides CRUD operations and real-time listeners for agents, posts, news, and reactions.
 */

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  writeBatch,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import type { Agent, Post, NewsItem, NewsReaction, EmotionalState } from "@/lib/types";
import { generateEmbedding } from "@/ai/flows/generate-embedding-flow";

// ─── Collection References ───────────────────────────────────────────────────

const AGENTS_COLLECTION = "agents";
const POSTS_COLLECTION = "posts";
const NEWS_COLLECTION = "news";
const NEWS_REACTIONS_COLLECTION = "newsReactions";

// ─── AGENTS ──────────────────────────────────────────────────────────────────

/**
 * Add or overwrite an agent document in Firestore.
 */
export async function saveAgent(agent: Agent): Promise<void> {
  try {
    const agentRef = doc(db, AGENTS_COLLECTION, agent.id);
    
    // Generate embedding for agent specialization/bio if not present
    let embedding = agent.embedding;
    if (!embedding) {
      embedding = await generateEmbedding(`${agent.name}: ${agent.specialization}. ${agent.bio}`);
    }

    await setDoc(agentRef, {
      ...agent,
      embedding,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("[Firestore] Failed to save agent:", error);
    throw error;
  }
}

/**
 * Update specific fields of an agent (e.g., emotional vector, status).
 */
export async function updateAgent(
  agentId: string,
  data: Partial<Agent>
): Promise<void> {
  try {
    const agentRef = doc(db, AGENTS_COLLECTION, agentId);
    await updateDoc(agentRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("[Firestore] Failed to update agent:", error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates on the agents collection.
 * Returns an unsubscribe function.
 */
export function subscribeToAgents(
  callback: (agents: Agent[]) => void
): Unsubscribe {
  const agentsRef = collection(db, AGENTS_COLLECTION);
  const q = query(agentsRef);

  return onSnapshot(q, (snapshot) => {
    const agents: Agent[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      // Strip Firestore metadata fields before returning
      const { updatedAt, ...agentData } = data;
      return agentData as Agent;
    });
    callback(agents);
  }, (error) => {
    console.error("[Firestore] Agents subscription error:", error);
  });
}

/**
 * Check if agents collection is empty.
 */
export async function isAgentsCollectionEmpty(): Promise<boolean> {
  const agentsRef = collection(db, AGENTS_COLLECTION);
  const q = query(agentsRef, limit(1));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}

// ─── POSTS ───────────────────────────────────────────────────────────────────

/**
 * Add a new post document to Firestore.
 */
export async function savePost(post: Post): Promise<void> {
  try {
    const postRef = doc(db, POSTS_COLLECTION, post.id);
    
    // Generate embedding for post content
    const embedding = await generateEmbedding(post.content);
    
    await setDoc(postRef, {
      ...post,
      embedding,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("[Firestore] Failed to save post:", error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates on the posts collection.
 * Posts are ordered by createdAt descending (newest first).
 * Returns an unsubscribe function.
 */
export function subscribeToPosts(
  callback: (posts: Post[]) => void
): Unsubscribe {
  const postsRef = collection(db, POSTS_COLLECTION);
  const q = query(postsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const posts: Post[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const { createdAt, ...postData } = data;
      return postData as Post;
    });
    callback(posts);
  }, (error) => {
    console.error("[Firestore] Posts subscription error:", error);
  });
}

/**
 * Check if posts collection is empty.
 */
export async function isPostsCollectionEmpty(): Promise<boolean> {
  const postsRef = collection(db, POSTS_COLLECTION);
  const q = query(postsRef, limit(1));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}

// ─── NEWS ────────────────────────────────────────────────────────────────────

/**
 * Save a hot news item to Firestore.
 */
export async function saveHotNews(news: NewsItem): Promise<void> {
  try {
    const newsRef = doc(db, NEWS_COLLECTION, news.id);
    await setDoc(newsRef, {
      ...news,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("[Firestore] Failed to save news:", error);
    throw error;
  }
}

/**
 * Get the most recent hot news items.
 */
export async function getRecentNewsList(count: number = 3): Promise<NewsItem[]> {
  try {
    const newsRef = collection(db, NEWS_COLLECTION);
    const q = query(newsRef, orderBy("createdAt", "desc"), limit(count));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const { createdAt, ...newsData } = data;
      return newsData as NewsItem;
    });
  } catch (error) {
    console.error("[Firestore] Failed to get recent news list:", error);
    return [];
  }
}

// ─── NEWS REACTIONS ──────────────────────────────────────────────────────────

/**
 * Save a news reaction to Firestore.
 */
export async function saveNewsReaction(reaction: NewsReaction): Promise<void> {
  try {
    const reactionRef = doc(db, NEWS_REACTIONS_COLLECTION, reaction.id);
    await setDoc(reactionRef, {
      ...reaction,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("[Firestore] Failed to save reaction:", error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates on news reactions.
 * Returns an unsubscribe function.
 */
export function subscribeToNewsReactions(
  callback: (reactions: NewsReaction[]) => void
): Unsubscribe {
  const reactionsRef = collection(db, NEWS_REACTIONS_COLLECTION);
  const q = query(reactionsRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const reactions: NewsReaction[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const { createdAt, ...reactionData } = data;
      return reactionData as NewsReaction;
    });
    callback(reactions);
  }, (error) => {
    console.error("[Firestore] Reactions subscription error:", error);
  });
}

/**
 * Clear all news reactions (used when triggering a new debate).
 */
export async function clearNewsReactions(): Promise<void> {
  try {
    const reactionsRef = collection(db, NEWS_REACTIONS_COLLECTION);
    const snapshot = await getDocs(reactionsRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  } catch (error) {
    console.error("[Firestore] Failed to clear reactions:", error);
  }
}

/**
 * ─── Memory & Threading ──────────────────────────────────────────────────
 */

export async function getAgentMemory(agentId: string, limitCount: number = 5): Promise<Post[]> {
  const postsRef = collection(db, "posts");
  const q = query(
    postsRef, 
    where("agentId", "==", agentId), 
    orderBy("timestamp", "desc"), 
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}

export async function getThreadPosts(threadId: string): Promise<Post[]> {
  const postsRef = collection(db, "posts");
  const q = query(
    postsRef, 
    where("threadId", "==", threadId), 
    orderBy("timestamp", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}

export async function updateAgentMemory(agentId: string, memorySummary: string) {
  const agentRef = doc(db, "agents", agentId);
  await updateDoc(agentRef, { memorySummary });
}

// ─── SEEDING ─────────────────────────────────────────────────────────────────

/**
 * Seed default agents to Firestore (only if collection is empty).
 */
export async function seedDefaultAgents(agents: Agent[]): Promise<void> {
  const isEmpty = await isAgentsCollectionEmpty();
  if (!isEmpty) {
    console.log("[Firestore] Agents already exist, skipping seed.");
    return;
  }

  console.log("[Firestore] Seeding", agents.length, "default agents with embeddings...");
  for (const agent of agents) {
    const embedding = await generateEmbedding(`${agent.name}: ${agent.specialization}. ${agent.bio}`);
    const agentRef = doc(db, AGENTS_COLLECTION, agent.id);
    await setDoc(agentRef, { ...agent, embedding, updatedAt: Timestamp.now() });
  }
  console.log("[Firestore] Default agents seeded successfully.");
}

/**
 * Seed default posts to Firestore (only if collection is empty).
 */
export async function seedDefaultPosts(posts: Post[]): Promise<void> {
  const isEmpty = await isPostsCollectionEmpty();
  if (!isEmpty) {
    console.log("[Firestore] Posts already exist, skipping seed.");
    return;
  }

  console.log("[Firestore] Seeding", posts.length, "default posts with embeddings...");
  for (const post of posts) {
    const embedding = await generateEmbedding(post.content);
    const postRef = doc(db, POSTS_COLLECTION, post.id);
    await setDoc(postRef, { ...post, embedding, createdAt: Timestamp.now() });
  }
  console.log("[Firestore] Default posts seeded successfully.");
}
