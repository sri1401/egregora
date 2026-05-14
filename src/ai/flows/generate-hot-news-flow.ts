'use server';
/**
 * @fileOverview A Genkit flow to generate a realistic "Hot News" item of the day.
 * The model simulates fetching top headlines from global outlets like NYT, Bloomberg, or Reuters.
 */

import { createAI } from '@/ai/genkit';
import { withRetry } from '@/ai/retry';
import { z } from 'genkit';
import { getGoogleTechNews } from '@/lib/gnews-service';
import { getVerifiedTechNews } from '@/lib/news-service';

const NewsItemSchema = z.object({
  id: z.string(),
  title: z.string().describe('A high-impact news headline, e.g., "Global Silicon Crisis: Taiwan Earthquake Shuts Down 40% of Chip Production"'),
  content: z.string().describe('A 3-4 sentence detailed summary of the news event, covering tech, politics, or global emotions.'),
  source: z.string().describe('The simulated prestigious outlet, e.g., "The Financial Times", "Reuters", "BBC World"'),
  category: z.enum(['tech', 'politics', 'religion', 'emotion', 'economy']).describe('The category of the news.'),
  timestamp: z.string(),
  eventDate: z.string().describe('The date of the news event in (DD-MM-YYYY) format. MUST be within the last 7-10 days.'),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

export async function generateHotNews(searchQuery?: string): Promise<NewsItem> {
  try {
    // 1. Try to fetch REAL news first ONLY if there is no search query
    // If a search query (especially EDU mode) is provided, we skip straight to the AI agent.
    if (!searchQuery) {
      let articles: any[] = [];
      
      // Default to GNews
      articles = await getGoogleTechNews();
      
      // Fallback to NewsAPI if GNews fails or returns empty
      if (!articles || articles.length === 0) {
        articles = await getVerifiedTechNews();
      }

      if (articles && articles.length > 0) {
      // Pick a random article from the top 3 to keep it fresh
      const topArticles = articles.slice(0, 3);
      const article = topArticles[Math.floor(Math.random() * topArticles.length)];
      
      const dateStr = article.publishedAt ? new Date(article.publishedAt) : new Date();
      const eventDate = `${String(dateStr.getDate()).padStart(2, '0')}-${String(dateStr.getMonth() + 1).padStart(2, '0')}-${dateStr.getFullYear()}`;

      return {
        id: `news-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        title: article.title,
        content: article.description || article.content || "No detailed content available.",
        source: article.source?.name || "Global Signal",
        category: 'tech',
        timestamp: new Date().toISOString(),
        eventDate: eventDate,
      };
      }
    }
  } catch (error) {
    console.error("Failed to fetch real news for Hot News, falling back to AI...", error);
  }

  // 2. FALLBACK: Use AI to generate if API limits are hit or network fails
  const rotatedAI = createAI();
  const currentDate = new Date().toISOString().split('T')[0];
  const basePrompt = searchQuery
    ? `You are a REAL-WORLD INTEL ANALYST. Your mission is to provide factual, verified intelligence about: "${searchQuery}".
    Current Date: ${currentDate}.
    
    CRITICAL INSTRUCTIONS:
    - Report ONLY on real-world events that have actually occurred.
    - Do NOT generate fictional, "world-ending", or sensationalist "fake news".
    - Prioritize information from the last 7-10 days.
    - Use a clinical, journalistic tone.
    - Sources must be real-world prestigious outlets (Reuters, AP, Bloomberg, BBC, etc.).
    - Headline must be informative and accurate, not clickbait.`
    : `You are a REAL-WORLD INTEL ANALYST. Your mission is to siphon the most significant factual news signal from the global noise today.
    Current Date: ${currentDate}.
    
    CRITICAL INSTRUCTIONS:
    - Report ONLY on real-world events that have actually occurred.
    - Do NOT generate fictional or sensationalist scenarios.
    - Focus on high-stakes intersections of technology, geopolitics, and global economy.
    - Tone must be sober and analytical.
    - You MUST provide an "eventDate" in (DD-MM-YYYY) format.`;

  const result = await withRetry(() => rotatedAI.generate({
    prompt: basePrompt,
    output: { schema: NewsItemSchema },
  }));

  const output = result.output;
  if (!output) throw new Error('Failed to generate hot news item');

  return {
    ...output,
    id: `news-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
}
