"use client";

import { NewsItem, NewsReaction, Agent } from "@/lib/types";
import { Flame, MessageSquare, Zap, TrendingUp, Globe, Activity } from "lucide-react";
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
      <div className="ritual-frame p-12 bg-card border-border flex flex-col items-center justify-center min-h-[500px] animate-pulse">
        <div className="relative mb-6">
          <Globe className="w-16 h-16 text-primary animate-spin duration-[10s]" />
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
        </div>
        <h3 className="text-foreground text-xl font-bold tracking-tight mb-2">Fetching Global News</h3>
        <p className="text-muted-foreground text-sm font-medium animate-pulse">Synchronizing news nodes...</p>
      </div>
    );
  }

  if (newsList.length === 0) {
    return (
      <div className="ritual-frame p-12 bg-card border-border text-center flex flex-col items-center justify-center min-h-[400px]">
        <Globe className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
        <h3 className="text-muted-foreground font-semibold text-sm">No Active News</h3>
        <p className="text-muted-foreground/60 text-xs mt-2 max-w-xs">
          The global news feed is currently empty. Try refreshing the signal.
        </p>
        <button 
          onClick={() => { playSfx('zap'); onRefreshNews(); }}
          onMouseEnter={() => playSfx('glitch')}
          className="mt-8 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-all"
        >
          Refresh Global Feed
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          {isArchive ? (
            <button 
              onClick={() => { playSfx('glitch'); onBack?.(); }}
              onMouseEnter={() => playSfx('glitch')}
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to News
            </button>
          ) : (
            <>
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Global News Channels</h2>
            </>
          )}
        </div>
        <button 
          onClick={() => { playSfx('zap'); onRefreshNews(true); }}
          onMouseEnter={() => playSfx('glitch')}
          disabled={isLoading}
          className={cn(
            "group flex items-center gap-2.5 px-4 py-2 bg-muted/50 hover:bg-muted text-foreground border border-border rounded-md transition-all text-xs font-semibold shadow-sm",
            isLoading && "opacity-50 cursor-not-allowed bg-primary/20"
          )}
        >
          <Zap className={cn("w-4 h-4 text-primary", isLoading && "animate-spin")} />
          <span>{isLoading ? "Fetching..." : "Refresh Feed"}</span>
        </button>
      </div>

      {/* News Feed - Multiple Cards */}
      <div className="grid grid-cols-1 gap-8">
        {newsList.map((news, idx) => (
          <div 
            key={news.id} 
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "ritual-frame bg-card border-l-4 border-l-primary overflow-hidden shadow-sm relative transition-all duration-300",
              idx === 0 ? "scale-100 opacity-100" : "opacity-70 hover:opacity-100"
            )}
          >
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md border border-primary/20">
                    <Flame className={cn("w-6 h-6 text-primary", idx === 0 && "animate-pulse")} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary block">TOP NEWS CHANNEL</span>
                    <span className="text-[11px] font-medium text-muted-foreground">{news.source} • Global Signal {news.eventDate ? `• (${news.eventDate})` : ''}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">Detection Time</div>
                  <div className="text-xs font-medium text-primary">
                    {mounted ? format(new Date(news.timestamp), 'yyyy-MM-dd HH:mm:ss') : '...'}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground tracking-tight leading-tight flex-1">
                  {news.title}
                </h2>
                {news.eventDate && (
                  <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full flex items-center gap-2 shrink-0 h-fit">
                    <Globe className="w-3.5 h-3.5 text-primary/70" />
                    <span className="text-[11px] font-bold text-primary">({news.eventDate})</span>
                  </div>
                )}
              </div>
              
              <div className="bg-muted/40 border border-border p-6 rounded-md">
                <p className="text-[15px] text-foreground/90 font-medium leading-relaxed italic">
                  "{news.content}"
                </p>
              </div>
            </div>
            
            <div className="px-8 py-3 bg-muted/30 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Volatility: {idx === 0 ? "High" : "Stable"}</span>
              </div>
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Source: {idx === 0 ? "Direct Signal" : "Archived Signal"}
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
            <h4 className="text-sm font-bold text-foreground">Agent Reactions ({reactions.length})</h4>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary animate-pulse rounded-full" />
              <span className="text-[10px] font-medium text-primary animate-pulse">Processing next node...</span>
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
                  "ritual-frame bg-card border-border p-6 hover:border-primary/40 transition-all group relative overflow-hidden shadow-sm",
                  "animate-in fade-in slide-in-from-left-6 duration-500",
                )}
              >
                <div className="flex gap-6">
                  <div 
                    className="w-14 h-14 shrink-0 rounded-full border-2 border-border bg-muted cursor-pointer overflow-hidden transition-all duration-300 group-hover:border-primary"
                    onClick={() => agent && onAgentClick(agent.id)}
                  >
                    <img 
                      src={agent?.avatarUrl} 
                      alt={agent?.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex flex-col">
                        <span 
                          className="text-base font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                          onClick={() => agent && onAgentClick(agent.id)}
                        >
                          {agent?.name}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {agent?.jobTitle} at {agent?.workplace}
                        </span>
                      </div>
                      <div className="bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="relative">
                      <p className="text-[15px] text-foreground/90 font-medium leading-relaxed italic">
                        {reaction.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        State: {Math.round((agent?.emotionalVector.ego || 0) * 100)}% Confidence | {Math.round((agent?.emotionalVector.aggression || 0) * 100)}% Alert
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
        <div className="text-center py-20 ritual-frame bg-muted/20 border-dashed border-border rounded-lg">
          <Zap className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Awaiting signal processing...</p>
        </div>
      )}
    </div>
  );
}
