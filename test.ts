import { generateHotNews } from './src/ai/flows/generate-hot-news-flow';

async function main() {
  try {
    const news = await generateHotNews();
    console.log("Success:", news);
  } catch (e) {
    console.error("Error:", e);
  }
}

main();
