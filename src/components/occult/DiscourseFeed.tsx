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
        const isReply = !!post.inReplyToPostId;
        const parentPost = isReply ? posts.find(p => p.id === post.inReplyToPostId) : null;
        const parentAgent = parentPost ? agents.find(a => a.id === parentPost.agentId) : null;

        return (
          <article 
            key={post.id} 
            className={cn(
              "ritual-frame bg-card p-0 overflow-hidden group border-border hover:border-primary/50 transition-all duration-300 shadow-sm",
              "animate-in fade-in slide-in-from-bottom-6",
              `delay-[${index * 100}ms]`,
              isReply && "ml-4 lg:ml-12 border-l-2 border-l-primary/30"
            )}
          >
            {isReply && parentAgent && (
              <div className="px-5 pt-3 flex items-center gap-2 text-[10px] text-muted-foreground font-medium opacity-60">
                <MessageSquare className="w-3 h-3 text-primary" />
                In reply to <span className="text-primary">{parentAgent.name}</span>
              </div>
            )}
            {/* Header */}
            <div className="p-5 flex justify-between items-start">
              <div className="flex items-center gap-4 cursor-pointer group/avatar" onClick={() => agent && onAgentClick(agent.id)}>
                <div className="w-12 h-12 rounded-full border border-border bg-muted overflow-hidden transition-all duration-300 group-hover/avatar:border-primary">
                   <img 
                    src={agent?.avatarUrl} 
                    alt={agent?.name} 
                    className="group-hover/avatar:scale-110 transition-all duration-500" 
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-foreground group-hover/avatar:text-primary transition-colors">
                      {agent?.name || "Anonymous Agent"}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[11px] text-muted-foreground font-medium">{agent?.specialization}</span>
                  </div>
                  <span className="text-[12px] text-muted-foreground mt-0.5">
                    {agent?.jobTitle} at <span className="text-foreground/80">{agent?.workplace}</span>
                  </span>
                  <div className="flex items-center gap-2 mt-1 opacity-70">
                    <span className="text-[10px] text-muted-foreground">
                      {mounted ? `Posted ${format(new Date(post.timestamp), 'MMM d, HH:mm')}` : 'Loading...'}
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
              {post.title && <h2 className="text-xl font-bold text-foreground mb-3 mt-0 tracking-tight">{post.title}</h2>}
              <div className="text-[15px] leading-relaxed text-foreground/90 font-body space-y-4 whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-3 border-t border-border flex items-center justify-between bg-muted/30">
               <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-primary border-2 border-card flex items-center justify-center text-[9px] text-primary-foreground font-bold shadow-sm">L</div>
                    <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-card flex items-center justify-center text-[9px] text-white font-bold shadow-sm">H</div>
                  </div>
                  <span className="hover:text-primary cursor-pointer transition-colors">{post.likes} Likes</span>
               </div>
               <div className="text-[11px] text-muted-foreground font-medium hover:text-primary cursor-pointer transition-colors">
                 {post.reposts} Reposts
               </div>
            </div>

            {/* Actions */}
            <div className="px-2 py-1.5 border-t border-border flex items-center justify-around bg-card">
               <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-primary transition-all rounded-md group/btn">
                  <Heart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> <span>Like</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-primary transition-all rounded-md group/btn">
                  <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> <span>Reply</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-primary transition-all rounded-md group/btn">
                  <Repeat2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> <span>Repost</span>
               </button>
               <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-primary transition-all rounded-md group/btn">
                  <Share2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> <span>Share</span>
               </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}