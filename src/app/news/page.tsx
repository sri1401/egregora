import { getVerifiedTechNews } from "@/lib/news-service";
import { getGoogleTechNews } from "@/lib/gnews-service";

// Helper function to format dates and check if it's new (within 24 hours)
function formatTimeAgo(dateString: string) {
  if (!dateString) return { timeAgo: "Unknown time", isNew: false };
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const isNew = diffInSeconds < 86400; // Less than 24 hours

  if (diffInSeconds < 60) return { timeAgo: "Just now", isNew };
  if (diffInSeconds < 3600) return { timeAgo: `${Math.floor(diffInSeconds / 60)} minutes ago`, isNew };
  if (diffInSeconds < 86400) return { timeAgo: `${Math.floor(diffInSeconds / 3600)} hours ago`, isNew };
  if (diffInSeconds < 2592000) return { timeAgo: `${Math.floor(diffInSeconds / 86400)} days ago`, isNew };
  
  return { timeAgo: date.toLocaleDateString(), isNew };
}

export default async function TechNewsDashboard() {
  const newsApiArticles = await getVerifiedTechNews();
  const gnewsArticles = await getGoogleTechNews();

  // Calculate total new articles for a top notification
  const newNewsApiCount = newsApiArticles.filter(a => formatTimeAgo(a.publishedAt).isNew).length;
  const newGNewsCount = gnewsArticles.filter(a => formatTimeAgo(a.publishedAt).isNew).length;
  const totalNew = newNewsApiCount + newGNewsCount;

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      
      {/* Top Notification Bar */}
      {totalNew > 0 && (
        <div className="mb-8 bg-blue-900/40 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <p className="font-medium">You have {totalNew} new tech articles published in the last 24 hours.</p>
          </div>
        </div>
      )}

      {/* --- NewsAPI Section --- */}
      <div className="mb-16">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-blue-500">NewsAPI</span> Tech News
          <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-medium">
            Verified by OpenRouter
          </span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsApiArticles.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No NewsAPI articles found. Please check your API keys.
            </div>
          )}
          
          {newsApiArticles.map((article, index) => {
            const { timeAgo, isNew } = formatTimeAgo(article.publishedAt);
            return (
              <a 
                key={index} 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-900 transition flex flex-col bg-gray-950 group relative"
              >
                {isNew && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10 animate-pulse">
                    NEW
                  </div>
                )}
                
                {article.urlToImage ? (
                  <img 
                    src={article.urlToImage} 
                    alt={article.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                      {article.source.name}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      🕒 {timeAgo}
                    </p>
                  </div>
                  <h2 className="font-bold text-lg mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {article.description}
                  </p>
                  
                  {/* Agent Reaction Section */}
                  <div className="mt-auto border-t border-gray-800 pt-4">
                    <div className="flex items-start gap-3">
                      {article.agentAvatar ? (
                        <img 
                          src={article.agentAvatar} 
                          alt={article.reactingAgent} 
                          className="w-6 h-6 rounded-full border border-gray-700 mt-0.5" 
                        />
                      ) : (
                        <div className="mt-1">
                          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                          {article.reactingAgent ? `${article.reactingAgent} Reaction` : "Agent Reaction"}
                        </p>
                        <p className="text-xs text-gray-400 italic mt-0.5 leading-relaxed">
                          "{article.verificationVerdict}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* --- GNews Section --- */}
      <div>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-blue-600">G</span>
          <span className="text-red-500">N</span>
          <span className="text-yellow-500">e</span>
          <span className="text-blue-600">w</span>
          <span className="text-green-600">s</span>
          <span className="ml-2">Tech Feed</span>
          <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-medium">
            Verified by OpenRouter
          </span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gnewsArticles.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No GNews articles found. Did you add the API key to .env?
            </div>
          )}
          
          {gnewsArticles.map((article, index) => {
            const { timeAgo, isNew } = formatTimeAgo(article.publishedAt);
            return (
              <a 
                key={index} 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-900 transition flex flex-col bg-gray-950 group relative"
              >
                {isNew && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10 animate-pulse">
                    NEW
                  </div>
                )}
                
                {article.image ? (
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                      {article.source.name}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      🕒 {timeAgo}
                    </p>
                  </div>
                  <h2 className="font-bold text-lg mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {article.description}
                  </p>
                  
                  {/* Agent Reaction Section */}
                  <div className="mt-auto border-t border-gray-800 pt-4">
                    <div className="flex items-start gap-3">
                      {article.agentAvatar ? (
                        <img 
                          src={article.agentAvatar} 
                          alt={article.reactingAgent} 
                          className="w-6 h-6 rounded-full border border-gray-700 mt-0.5" 
                        />
                      ) : (
                        <div className="mt-1">
                          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                          {article.reactingAgent ? `${article.reactingAgent} Reaction` : "Agent Reaction"}
                        </p>
                        <p className="text-xs text-gray-400 italic mt-0.5 leading-relaxed">
                          "{article.verificationVerdict}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
