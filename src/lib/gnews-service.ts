import { createAI } from '@/ai/genkit';

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  verificationVerdict?: string;
}

export async function getGoogleTechNews(): Promise<GNewsArticle[]> {
  const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY?.trim(); // Trim in case of spaces
  
  if (!apiKey) {
    console.error("GNews API Key is missing from .env");
    return [];
  }

  // Fetch exactly the top 10 articles for the "technology" topic in English
  const url = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=10&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.articles) {
      // Run the articles through OpenRouter AI for fact-checking
      const { DEFAULT_AGENTS } = await import('@/lib/default-data');

      const verifiedArticles = await Promise.all(data.articles.map(async (article: GNewsArticle) => {
        try {
          const ai = createAI();
          const randomAgent = DEFAULT_AGENTS[Math.floor(Math.random() * DEFAULT_AGENTS.length)];
          
          const prompt = `You are ${randomAgent.name}, ${randomAgent.jobTitle}.
${randomAgent.systemPrompt}

You are reacting to a piece of global news. Provide a very short, sharp 1-2 sentence reaction to this news in character.
Headline: ${article.title}
Summary: ${article.description}`;

          const result = await ai.generate(prompt);
          
          return {
            ...article,
            verificationVerdict: result.text,
            reactingAgent: randomAgent.name,
            agentAvatar: randomAgent.avatarUrl,
          };
        } catch (aiError) {
          console.error("Error verifying GNews article:", aiError);
          return {
            ...article,
            verificationVerdict: "AI Analysis unavailable.",
          };
        }
      }));

      return verifiedArticles;
    } else {
      console.error("Error fetching GNews:", data.errors || data.message);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch GNews", error);
    return [];
  }
}
