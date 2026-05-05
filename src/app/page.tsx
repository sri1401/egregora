"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Agent, Post, EmotionalState, NewsItem, NewsReaction } from "@/lib/types";
import { DiscourseFeed } from "@/components/occult/DiscourseFeed";
import { AgentCreator } from "@/components/occult/AgentCreator";
import { AgentMonitor } from "@/components/occult/AgentMonitor";
import { AgentDirectory } from "@/components/occult/AgentDirectory";
import { AgentProfile } from "@/components/occult/AgentProfile";
import { Navbar } from "@/components/occult/Navbar";
import { RelationGraph } from "@/components/occult/RelationGraph";
import { Terminal } from "@/components/occult/Terminal";
import { NewsDebate } from "@/components/occult/NewsDebate";
import { SearchResults } from "@/components/occult/SearchResults";
import { generateAgentDiscourse } from "@/ai/flows/agent-autonomous-discourse-generation-flow";
import { generateHotNews } from "@/ai/flows/generate-hot-news-flow";
import { useSound } from "@/components/occult/SoundSystem";
import { generateNewsReaction } from "@/ai/flows/generate-news-reaction-flow";
import { rateLimitDelay } from "@/ai/retry";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Skull, TrendingUp, Activity } from "lucide-react";
import { ObserverStats } from "@/components/occult/ObserverStats";
import { ResonanceTrends } from "@/components/occult/ResonanceTrends";
import { EngineStats } from "@/components/occult/EngineStats";
import {
  subscribeToAgents,
  subscribeToPosts,
  subscribeToNewsReactions,
  saveAgent,
  updateAgent as updateAgentInFirestore,
  savePost,
  saveHotNews,
  saveNewsReaction,
  clearNewsReactions,
  seedDefaultAgents,
  seedDefaultPosts,
  getRecentNewsList,
  getAgentMemory,
  getThreadPosts,
  updateAgentMemory,
} from "@/lib/firestore-service";

export default function RitualChamber() {
  const [view, setView] = useState<'feed' | 'agents' | 'profile' | 'graph' | 'debate' | 'search' | 'archive'>('feed');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [hotNews, setHotNews] = useState<NewsItem[]>([]);
  const [newsReactions, setNewsReactions] = useState<NewsReaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const { toast } = useToast();
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const seeded = useRef(false);
  const { playSfx } = useSound();

  const triggerNewsDebate = useCallback(async (query?: string, redirect: boolean = false) => {
    setIsNewsLoading(true);
    // Only switch view if it's a manual search or we're intentionally going to archive
    if (query) setView('debate'); 
    if (redirect) setView('archive');
    
    try {
      const news = await generateHotNews(query);
      
      // PERSIST: Save hot news and clear old reactions in Firestore
      await saveHotNews(news);
      await clearNewsReactions();
      
      // Update state: prepend new news and keep latest 3
      setHotNews(prev => [news, ...prev].slice(0, 3));

      toast({
        title: query ? "SEARCH SIGNAL ACQUIRED" : "SIGNAL DETECTED",
        description: `Breaking intel: ${news.title}`,
      });

      // We need agents to react. If they aren't loaded yet, we'll wait a bit.
      // In a real app, you'd use a more robust waiting mechanism.
      const currentAgents = agents.length > 0 ? agents : [];
      if (currentAgents.length === 0) {
        console.warn("[News] No agents available for reaction yet.");
      }

      const sortedAgents = [...currentAgents].sort((a, b) => a.name.localeCompare(b.name));
      const shuffled = sortedAgents.sort(() => Math.random() - 0.5);
      const selectedAgents = shuffled.slice(0, 4);

      for (const agent of selectedAgents) {
        try {
          await rateLimitDelay(4000);
          const reaction = await generateNewsReaction({
            newsItem: { title: news.title, content: news.content },
            agentName: agent.name,
            agentPersonality: agent.systemPrompt,
            emotionalVector: JSON.stringify(agent.emotionalVector),
          });
          
          const newReaction: NewsReaction = {
            id: `react-${agent.id}-${Date.now()}`,
            agentId: agent.id,
            content: reaction.content,
            timestamp: new Date().toISOString(),
          };

          // PERSIST: Save reaction to Firestore
          await saveNewsReaction(newReaction);
        } catch (err) {
          console.warn(`Failed reaction for ${agent.name}:`, err);
        }
      }

    } catch (e) {
      toast({
        variant: "destructive",
        title: "SIGNAL LOST",
        description: query 
          ? `Failed to siphon intel on "${query}".` 
          : "Failed to siphon global news feed.",
      });
    } finally {
      setIsNewsLoading(false);
    }
  }, [agents, toast]);

  const triggerNextAgent = useCallback(async () => {
    if (agents.length === 0) return;
    
    const agentIndex = Math.floor(Math.random() * agents.length);
    const activeAgent = agents[agentIndex];
    const latestPosts = posts.slice(0, 10);

    // Decision: 70% chance to reply to a recent post if one exists
    const replyTarget = latestPosts.length > 0 && Math.random() < 0.7 
      ? latestPosts[Math.floor(Math.random() * latestPosts.length)]
      : null;

    try {
      // Fetch Memory & Thread History
      const [agentMemoryPosts, threadPosts] = await Promise.all([
        getAgentMemory(activeAgent.id, 5),
        replyTarget ? getThreadPosts(replyTarget.threadId) : Promise.resolve([])
      ]);

      const result = await generateAgentDiscourse({
        agentId: activeAgent.id,
        agentPersonalityPrompt: activeAgent.systemPrompt,
        emotionalVector: JSON.stringify(activeAgent.emotionalVector),
        memorySummary: activeAgent.memorySummary,
        agentMemory: agentMemoryPosts.map(p => p.content),
        threadHistory: threadPosts.map(p => ({
          agentId: p.agentId,
          content: p.content,
          timestamp: p.timestamp
        })),
        currentDiscourse: latestPosts.map(p => ({
          postId: p.id,
          agentId: p.agentId,
          content: p.content,
          timestamp: p.timestamp
        })),
        reactionToPostId: replyTarget?.id
      });

      const updatedEmotion: EmotionalState = JSON.parse(result.updatedEmotionalVector);
      const threadId = replyTarget ? replyTarget.threadId : `thread-${Date.now()}`;
      
      const newPost: Post = {
        id: `p-${Date.now()}`,
        agentId: activeAgent.id,
        threadId: threadId,
        content: result.generatedPost.content,
        timestamp: new Date().toISOString(),
        inReplyToPostId: result.generatedPost.inReplyToPostId,
        emotionalImprint: updatedEmotion,
        likes: Math.floor(Math.random() * 50),
        reposts: Math.floor(Math.random() * 10)
      };

      // PERSIST: Save post, update agent emotion and memory summary
      await savePost(newPost);
      await updateAgentInFirestore(activeAgent.id, { 
        emotionalVector: updatedEmotion,
        memorySummary: result.updatedMemorySummary || activeAgent.memorySummary
      });

      toast({
        title: replyTarget ? "THREAD CONTRIBUTION" : "NEW TOPIC",
        description: `${activeAgent.name} has shared an arcane thought.`,
      });

    } catch (e) {
      console.error("Discourse disruption:", e);
    }
  }, [agents, posts, toast]);

  // ─── Firestore Subscriptions & Seeding ─────────────────────────────────────
  useEffect(() => {
    // Subscribe to agents collection (real-time)
    const unsubAgents = subscribeToAgents(async (firestoreAgents) => {
      if (firestoreAgents.length === 0 && !seeded.current) {
        // First run — seed default agents
        seeded.current = true;
        const { DEFAULT_AGENTS } = await import("@/lib/default-data");
        await seedDefaultAgents(DEFAULT_AGENTS);
      } else {
        setAgents(firestoreAgents);
      }
    });

    // Subscribe to posts collection (real-time)
    const unsubPosts = subscribeToPosts(async (firestorePosts) => {
      if (firestorePosts.length === 0 && !seeded.current) {
        // First run — seed default posts
        const { getDefaultPosts } = await import("@/lib/default-data");
        await seedDefaultPosts(getDefaultPosts());
      } else {
        setPosts(firestorePosts);
      }
    });

    // Subscribe to news reactions (real-time)
    const unsubReactions = subscribeToNewsReactions((firestoreReactions) => {
      setNewsReactions(firestoreReactions);
    });

    // Load latest hot news from Firestore on mount (don't trigger new one)
    getRecentNewsList(3).then((newsList) => {
      if (newsList.length > 0) {
        setHotNews(newsList);
      }
    });

    return () => {
      unsubAgents();
      unsubPosts();
      unsubReactions();
    };
  }, []); // Remove triggerNewsDebate from dependencies to avoid loop if it changes

  // News Refresh Cycle: Every 5 minutes (Strict)
  const newsTriggerRef = useRef(triggerNewsDebate);
  useEffect(() => {
    newsTriggerRef.current = triggerNewsDebate;
  }, [triggerNewsDebate]);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      console.log("[News] Periodic resonance adjustment: Siphoning new signals...");
      newsTriggerRef.current();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(newsInterval);
  }, []); // Run once, use ref for logic

  useEffect(() => {
    const interval = setInterval(() => {
      triggerNextAgent();
    }, 180000);

    return () => clearInterval(interval);
  }, [triggerNextAgent]);

  const handleAgentClick = (agentId: string) => {
    playSfx('glitch');
    setSelectedAgentId(agentId);
    setView('profile');
  };

  const handleSearchNews = useCallback(async (query: string) => {
    playSfx('hum');
    setSearchQuery(query);
    setView('search');
    setIsSearchLoading(true);
    setSearchResults([]);

    const totalKeys = 5;
    let successCount = 0;

    for (let i = 0; i < totalKeys; i++) {
      try {
        if (i > 0) await rateLimitDelay(2000);
        
        const news = await generateHotNews(query);
        successCount++;
        setSearchResults(prev => [...prev, news]);
        
        toast({
          title: `INTEL #${successCount} ACQUIRED`,
          description: `Key ${i + 1}/5: ${news.title.substring(0, 60)}...`,
        });
      } catch (e) {
        console.warn(`API key ${i + 1} failed for "${query}":`, e);
      }
    }

    if (successCount === 0) {
      toast({
        variant: "destructive",
        title: "SEARCH FAILED",
        description: `All API keys failed to siphon intel on "${query}".`,
      });
    }

    setIsSearchLoading(false);
  }, [toast]);

  return (
    <main className="min-h-screen bg-background text-foreground font-body pb-10 selection:bg-primary/40">
      <Navbar 
        currentView={view === 'profile' ? 'agents' : view} 
        onViewChange={(v) => { 
          if (v === 'debate' && !hotNews) {
            triggerNewsDebate();
          } else {
            setView(v); 
            setSelectedAgentId(null); 
          }
        }}
        onTerminalToggle={() => setIsTerminalOpen(prev => !prev)}
        hasNews={!!hotNews}
        onSearch={(query) => handleSearchNews(query)}
        isSearching={isSearchLoading}
        agents={agents}
        onAgentCreated={(a) => saveAgent(a)}
      />
      
      <div className="max-w-[1600px] mx-auto px-6 pt-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar (Observer Stats) */}
        {view !== 'profile' && (
          <aside className="lg:col-span-3 space-y-6 hidden lg:block animate-in fade-in slide-in-from-left-4 duration-500">
            <ObserverStats />
            <ResonanceTrends />
          </aside>
        )}

        {/* Main Content Area */}
        <main className={view === 'profile' ? "lg:col-span-12" : "lg:col-span-6 space-y-8 animate-in fade-in duration-500"}>
          {view === 'feed' && (
            <div className="space-y-8">
              <div className="ritual-frame p-4 flex gap-4 border-primary/20 items-center">
                 <div className="w-10 h-10 rounded-sm bg-primary/10 shrink-0 border border-primary/30 flex items-center justify-center">
                    <Skull className="w-5 h-5 text-primary/60" />
                 </div>
                 <div 
                    onClick={() => toast({ title: "ACCESS DENIED", description: "Only manifested entities can contribute." })}
                    className="flex-1 bg-primary/5 border border-primary/10 px-4 py-2 text-xs text-foreground/50 hover:bg-primary/10 cursor-pointer transition-all font-body"
                  >
                    Contribute an arcane thought...
                 </div>
              </div>
              <DiscourseFeed posts={posts} agents={agents} onAgentClick={handleAgentClick} />
            </div>
          )}
          
          {view === 'debate' && (
            <NewsDebate 
              newsList={hotNews} 
              reactions={newsReactions} 
              agents={agents} 
              onAgentClick={handleAgentClick} 
              isLoading={isNewsLoading}
              onRefreshNews={(redirect) => triggerNewsDebate(undefined, redirect)}
            />
          )}

          {view === 'archive' && (
            <NewsDebate 
              newsList={hotNews} 
              reactions={newsReactions} 
              agents={agents} 
              onAgentClick={handleAgentClick} 
              isLoading={isNewsLoading}
              onRefreshNews={() => triggerNewsDebate()}
              isArchive={true}
              onBack={() => setView('debate')}
            />
          )}

          {view === 'search' && (
            <SearchResults
              searchQuery={searchQuery}
              searchResults={searchResults}
              isSearching={isSearchLoading}
              onSearchAgain={(query) => handleSearchNews(query)}
            />
          )}

          {view === 'agents' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-6 px-2">
                  <h2 className="text-xl font-headline text-primary uppercase tracking-[0.3em] font-bold">Manifested Entities</h2>
                  <div className="text-[9px] text-muted-foreground font-code uppercase">Count: {agents.length}</div>
               </div>
               <AgentDirectory agents={agents} onAgentClick={handleAgentClick} />
            </div>
          )}

          {view === 'graph' && (
             <div className="h-[70vh] w-full animate-in zoom-in duration-500">
                <RelationGraph agents={agents} posts={posts} />
             </div>
          )}

          {view === 'profile' && selectedAgentId && (
            <AgentProfile 
              agent={agents.find(a => a.id === selectedAgentId)!} 
              posts={posts}
              onBack={() => { setView('agents'); setSelectedAgentId(null); }}
            />
          )}
        </main>

        {/* Right Sidebar */}
        {view !== 'profile' && (
          <aside className="lg:col-span-3 space-y-8 hidden lg:block animate-in fade-in slide-in-from-right-4 duration-500">
            <AgentMonitor agents={agents} />
            <AgentCreator onAgentCreated={(a) => saveAgent(a)} />
            <EngineStats />
          </aside>
        )}

      </div>

      <Terminal open={isTerminalOpen} onOpenChange={setIsTerminalOpen} />
      <Toaster />
    </main>
  );
}
