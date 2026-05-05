"use client";

import { NewsItem, NewsReaction, Agent } from "@/lib/types";
import { Flame, MessageSquare, Zap, Skull, TrendingUp, Globe } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { useSound } from "./SoundSystem";

interface NewsDebateProps {
  newsList: NewsItem[];
  reactions: NewsReaction[];
  agents: Agent[];
  onAgentClick: (id: string) => void;
  isLoading: boolean;
  onRefreshNews: (redirect?: boolean) => void;
  isArchive?: boolean;
  onBack?: () => void;
}

export function NewsDebate({ newsList, reactions, agents, onAgentClick, isLoading, onRefreshNews, isArchive, onBack }: NewsDebateProps) {
  const [mounted, setMounted] = useState(false);
  const { playSfx } = useSound();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading && newsList.length === 0) {
    return (
      <div className="ritual-frame p-12 bg-black/60 border-primary/30 flex flex-col items-center justify-center min-h-[500px] animate-pulse">
        <div className="relative mb-6">
          <Globe className="w-16 h-16 text-primary animate-spin duration-[10s]" />
          <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-flicker" />
        </div>
        <h3 className="font-headline text-primary text-xl uppercase tracking-[0.4em] mb-2">Siphoning Global Intel</h3>
        <p className="text-muted-foreground font-code text-xs uppercase tracking-widest animate-pulse">Synchronizing manifested nodes...</p>
      </div>
    );
  }

  if (newsList.length === 0) {
    return (
      <div className="ritual-frame p-12 bg-black/60 border-primary/20 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Skull className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
        <h3 className="font-headline text-muted-foreground uppercase tracking-[0.3em] text-sm">No Active Discourse</h3>
        <p className="text-muted-foreground/60 font-code uppercase text-[10px] tracking-widest mt-2 max-w-xs">
          The global signal is currently flat. Await the next anomaly.
        </p>
        <button 
          onClick={() => { playSfx('zap'); onRefreshNews(); }}
          onMouseEnter={() => playSfx('glitch')}
          className="mt-8 px-6 py-3 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary font-headline uppercase tracking-widest transition-all"
        >
          Siphon Initial Signal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          {isArchive ? (
            <button 
              onClick={() => { playSfx('glitch'); onBack?.(); }}
              onMouseEnter={() => playSfx('glitch')}
              className="flex items-center gap-2 text-[10px] font-headline text-muted-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors"
            >
              ← BACK TO DEBATE
            </button>
          ) : (
            <>
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-headline text-foreground uppercase tracking-[0.3em] font-bold">Active Signal Channels</h2>
            </>
          )}
        </div>
        <button 
          onClick={() => { playSfx('zap'); onRefreshNews(true); }}
          onMouseEnter={() => playSfx('glitch')}
          disabled={isLoading}
          className={cn(
            "group flex items-center gap-3 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all text-[10px] font-headline uppercase tracking-widest",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Zap className={cn("w-4 h-4 text-primary", isLoading && "animate-spin")} />
          <span>{isLoading ? "Siphoning..." : "Siphon New Signal"}</span>
        </button>
      </div>

      {/* News Feed - Multiple Cards */}
      <div className="grid grid-cols-1 gap-8">
        {newsList.map((news, idx) => (
          <div 
            key={news.id} 
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "ritual-frame bg-black border-l-4 border-l-primary overflow-hidden shadow-2xl relative transition-all duration-700",
              idx === 0 ? "scale-100 opacity-100" : "scale-[0.98] opacity-60 hover:opacity-100 hover:scale-100"
            )}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Globe className="w-32 h-32" />
            </div>
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 border border-primary/40">
                    <Flame className={cn("w-6 h-6 text-primary", idx === 0 && "animate-flicker")} />
                  </div>
                  <div>
                    <span className="text-[10px] font-headline text-primary uppercase tracking-[0.3em] font-bold block">ARCANE INTEL CHANNEL</span>
                    <span className="text-[9px] font-code text-muted-foreground uppercase">{news.source} • GLOBAL SIGNAL {news.eventDate ? `• (${news.eventDate})` : ''}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-code text-muted-foreground uppercase mb-1">DETECTION TIMESTAMP</div>
                  <div className="text-xs font-code text-primary">
                    {mounted ? format(new Date(news.timestamp), 'yyyy-MM-dd HH:mm:ss') : '...'}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <h2 className="text-3xl font-headline text-foreground uppercase tracking-tight leading-[1.1] font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text flex-1">
                  {news.title}
                </h2>
                {news.eventDate && (
                  <div className="ritual-frame bg-primary/10 border-primary/30 px-3 py-1 flex items-center gap-2 shrink-0 h-fit">
                    <Globe className="w-3 h-3 text-primary/60" />
                    <span className="text-[10px] font-code text-primary uppercase tracking-widest font-bold">({news.eventDate})</span>
                  </div>
                )}
              </div>
              
              <div className="ritual-frame bg-primary/5 border-primary/10 p-6">
                <p className="text-base text-foreground/80 font-body leading-relaxed italic selection:bg-primary/40">
                  "{news.content}"
                </p>
              </div>
            </div>
            
            <div className="px-8 py-3 bg-primary/10 border-t border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-code text-secondary uppercase tracking-[0.2em] font-bold">Network Volatility: {idx === 0 ? "CRITICAL" : "STABLE"}</span>
              </div>
              <div className="text-[9px] font-code text-muted-foreground uppercase">
                Protocol: {idx === 0 ? "Alpha-Seq Reaction" : "Archival Record"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reactions Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h4 className="text-xs font-headline text-foreground uppercase tracking-[0.3em] font-bold">Entity Reactions ({reactions.length})</h4>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary animate-pulse rounded-full" />
              <span className="text-[9px] font-code text-primary uppercase animate-pulse">Siphoning next node...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {reactions.map((reaction, index) => {
            const agent = agents.find(a => a.id === reaction.agentId);
            return (
              <article 
                key={reaction.id}
                className={cn(
                  "ritual-frame bg-black/60 border-primary/20 p-6 hover:border-primary/50 transition-all group relative overflow-hidden",
                  "animate-in fade-in slide-in-from-left-6 duration-500",
                )}
              >
                <div className="absolute top-0 right-0 p-2 opacity-[0.03] pointer-events-none uppercase font-headline text-4xl rotate-12">
                  {agent?.name}
                </div>
                <div className="flex gap-6">
                  <div 
                    className="w-16 h-16 shrink-0 border-2 border-primary/30 bg-black cursor-pointer overflow-hidden transition-all duration-500 group-hover:border-primary"
                    onClick={() => agent && onAgentClick(agent.id)}
                  >
                    <img 
                      src={agent?.avatarUrl} 
                      alt={agent?.name} 
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700" 
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                      <div className="flex flex-col">
                        <span 
                          className="text-base font-headline text-primary uppercase tracking-widest cursor-pointer hover:underline font-bold"
                          onClick={() => agent && onAgentClick(agent.id)}
                        >
                          {agent?.name}
                        </span>
                        <span className="text-[10px] font-code text-muted-foreground uppercase">
                          {agent?.jobTitle} @ {agent?.workplace}
                        </span>
                      </div>
                      <div className="bg-primary/5 px-2 py-1 border border-primary/10">
                        <Zap className="w-3.5 h-3.5 text-secondary animate-pulse" />
                      </div>
                    </div>
                    <div className="relative">
                      <p className="text-base text-foreground/90 font-body leading-relaxed whitespace-pre-wrap italic">
                        {reaction.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="text-[9px] font-code text-muted-foreground uppercase tracking-widest">
                        Resonance: {Math.round((agent?.emotionalVector.ego || 0) * 100)}% Ego | {Math.round((agent?.emotionalVector.aggression || 0) * 100)}% Hostility
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {reactions.length === 0 && !isLoading && (
        <div className="text-center py-20 ritual-frame bg-black/40 border-dashed border-primary/20">
          <Zap className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xs text-muted-foreground font-code uppercase tracking-widest">Awaiting sequential node manifest...</p>
        </div>
      )}
    </div>
  );
}
