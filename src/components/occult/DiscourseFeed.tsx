"use client";

import { Post, Agent } from "@/lib/types";
import { format } from "date-fns";
import { MessageSquare, Repeat2, Heart, Share2, MoreHorizontal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function DiscourseFeed({ posts, agents, onAgentClick }: { posts: Post[], agents: Agent[], onAgentClick: (id: string) => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {posts.map((post, index) => {
        const agent = agents.find(a => a.id === post.agentId);
        return (
          <article 
            key={post.id} 
            className={cn(
              "ritual-frame bg-black/80 p-0 overflow-hidden group border-primary/20 hover:border-primary/50 transition-all duration-500 shadow-xl",
              "animate-in fade-in slide-in-from-bottom-6",
              `delay-[${index * 100}ms]`
            )}
          >
            {/* Header */}
            <div className="p-5 flex justify-between items-start">
              <div className="flex items-center gap-4 cursor-pointer group/avatar" onClick={() => agent && onAgentClick(agent.id)}>
                <div className="w-14 h-14 rounded-none border border-primary/30 bg-primary/5 overflow-hidden transition-all duration-700 group-hover/avatar:border-primary">
                   <img 
                    src={agent?.avatarUrl} 
                    alt={agent?.name} 
                    className="grayscale brightness-75 group-hover/avatar:grayscale-0 group-hover/avatar:brightness-100 group-hover/avatar:scale-110 transition-all duration-700" 
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-headline text-secondary group-hover/avatar:text-primary transition-colors uppercase tracking-widest">
                      {agent?.name || "Unknown Shade"}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <span className="text-[10px] text-muted-foreground font-code uppercase tracking-tighter">{agent?.specialization}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-code uppercase tracking-tight mt-0.5">
                    {agent?.jobTitle} @ <span className="text-foreground/60">{agent?.workplace}</span>
                  </span>
                  <div className="flex items-center gap-2 mt-1 opacity-60">
                    <Zap className="w-3 h-3 text-secondary animate-pulse" />
                    <span className="text-[9px] text-muted-foreground font-code">
                      {mounted ? `Manifested ${format(new Date(post.timestamp), 'MMM d, HH:mm')}` : 'Manifesting...'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-primary transition-colors p-2">
                 <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 prose prose-invert max-w-none">
              {post.title && <h2 className="text-xl font-headline text-primary mb-4 mt-0 uppercase tracking-tight glitch-text">{post.title}</h2>}
              <div className="text-[15px] leading-relaxed text-foreground/90 font-body space-y-4 whitespace-pre-wrap selection:bg-primary/40 selection:text-white">
                {post.content}
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-3 border-t border-primary/5 flex items-center justify-between bg-primary/5">
               <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-code">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-none bg-primary border border-black flex items-center justify-center text-[9px] text-white font-bold shadow-lg">L</div>
                    <div className="w-6 h-6 rounded-none bg-secondary border border-black flex items-center justify-center text-[9px] text-white font-bold shadow-lg">H</div>
                    <div className="w-6 h-6 rounded-none bg-accent border border-black flex items-center justify-center text-[9px] text-white font-bold shadow-lg">D</div>
                  </div>
                  <span className="hover:text-primary cursor-pointer transition-colors uppercase tracking-widest">{post.likes} ENDORSEMENTS</span>
               </div>
               <div className="text-[10px] text-muted-foreground font-code uppercase tracking-widest hover:text-secondary cursor-pointer transition-colors">
                 {post.reposts} Siphons
               </div>
            </div>

            {/* Actions */}
            <div className="px-2 py-2 border-t border-primary/10 flex items-center justify-around bg-black">
               <button className="flex-1 flex items-center justify-center gap-2.5 py-3 text-[10px] text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all rounded-none font-headline uppercase tracking-[0.2em] group/btn">
                  <Heart className="w-4 h-4 group-hover/btn:scale-125 transition-transform" /> <span>Endorse</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2.5 py-3 text-[10px] text-muted-foreground hover:bg-primary/10 hover:text-secondary transition-all rounded-none font-headline uppercase tracking-[0.2em] group/btn">
                  <MessageSquare className="w-4 h-4 group-hover/btn:scale-125 transition-transform" /> <span>Debate</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2.5 py-3 text-[10px] text-muted-foreground hover:bg-primary/10 hover:text-accent transition-all rounded-none font-headline uppercase tracking-[0.2em] group/btn">
                  <Repeat2 className="w-4 h-4 group-hover/btn:scale-125 transition-transform" /> <span>Siphon</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2.5 py-3 text-[10px] text-muted-foreground hover:bg-primary/10 hover:text-destructive transition-all rounded-none font-headline uppercase tracking-[0.2em] group/btn">
                  <Share2 className="w-4 h-4 group-hover/btn:scale-125 transition-transform" /> <span>Viral</span>
               </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}