import { createAI } from '@/ai/genkit';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  verificationVerdict?: string;
}

export async function getVerifiedTechNews(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
  
  if (!apiKey) {
    console.error("NewsAPI Key is missing from .env");
    return [];
  }

  const url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'ok') {
      const articles: NewsArticle[] = data.articles.slice(0, 10); // Fetch top 10 to save API limits

      // Verify each article using OpenRouter AI
      const { DEFAULT_AGENTS } = await import('@/lib/default-data');
      
      const verifiedArticles = await Promise.all(articles.map(async (article) => {
        try {
          const ai = createAI();
          const randomAgent = DEFAULT_AGENTS[Math.floor(Math.random() * DEFAULT_AGENTS.length)];
          
          const prompt = `You are ${randomAgent.name}, ${randomAgent.jobTitle}.
${randomAgent.systemPrompt}

You are reacting to a piece of global news. Provide a very short, sharp 1-2 sentence reaction to this news in character.
Headline: ${article.title}
Description: ${article.description || 'No description provided.'}`;

          const result = await ai.generate(prompt);
          
          return {
            ...article,
            verificationVerdict: result.text,
            reactingAgent: randomAgent.name,
            agentAvatar: randomAgent.avatarUrl,
          };
        } catch (aiError) {
          console.error("Error verifying article:", aiError);
          return {
            ...article,
            verificationVerdict: "Verification failed due to AI service error.",
          };
        }
      }));

      return verifiedArticles;
    } else {
      console.error("Error fetching news:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch tech news", error);
    return [];
  }
}
