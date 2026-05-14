import { getGoogleTechNews } from "@/lib/gnews-service";

export default async function GNewsDashboard() {
  const articles = await getGoogleTechNews();

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
          <span className="text-blue-600">G</span>
          <span className="text-red-500">N</span>
          <span className="text-yellow-500">e</span>
          <span className="text-blue-600">w</span>
          <span className="text-green-600">s</span>
          <span className="ml-2 text-gray-800">Tech Feed</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {articles.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              No GNews articles found. Did you add the API key to .env?
            </div>
          )}
          
          {articles.map((article, index) => (
            <a 
              key={index} 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col group"
            >
              {article.image && (
                <div className="overflow-hidden h-60 w-full">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-blue-600 text-sm font-semibold mb-2">
                  {article.source.name}
                </p>
                <h2 className="font-bold text-xl text-gray-900 mb-3">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm mb-6 flex-1">
                  {article.description}
                </p>
                
                {/* AI Analysis Section */}
                <div className="mt-auto bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex gap-3 items-start">
                    <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                        OpenRouter AI Analysis
                      </p>
                      <p className="text-sm text-blue-800 font-medium">
                        {article.verificationVerdict}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
