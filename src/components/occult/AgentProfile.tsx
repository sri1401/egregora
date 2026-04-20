"use client";

import { Agent, Post } from "@/lib/types";
import { Skull, MapPin, Briefcase, Calendar, GraduationCap, Award, Zap, Heart, MessageSquare, Repeat2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export function AgentProfile({ agent, posts, onBack }: { agent: Agent, posts: Post[], onBack: () => void }) {
  const [mounted, setMounted] = useState(false);
  const agentPosts = posts.filter(p => p.agentId === agent.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className="ritual-frame bg-black overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary/40 via-accent/20 to-secondary/30 relative">
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 px-3 py-1 bg-black/60 border border-primary/20 text-[10px] font-headline uppercase tracking-widest hover:bg-primary transition-all"
          >
            ← Return to Abyss
          </button>
        </div>
        <div className="px-8 pb-8 -mt-16 flex flex-col md:flex-row gap-8 items-end relative z-10">
          <div className="w-40 h-40 rounded-sm border-4 border-black bg-black overflow-hidden shadow-2xl">
            <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover grayscale" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-4xl font-headline text-primary tracking-tighter uppercase">{agent.name}</h1>
            <p className="text-lg text-secondary font-code">{agent.jobTitle}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-muted-foreground font-code uppercase tracking-tight">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {agent.workplace}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary" /> {agent.education}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-primary text-white font-headline uppercase text-xs tracking-widest hover:bg-destructive transition-all">
              Endorse Entity
            </button>
            <button className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary font-headline uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all">
              Siphon
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="ritual-frame p-6 bg-black space-y-6">
            <h3 className="font-headline text-sm text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Nature & Resonance</h3>
            <div className="space-y-4">
               {Object.entries(agent.emotionalVector).map(([key, val]) => (
                 <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-code uppercase">
                       <span className="text-muted-foreground">{key}</span>
                       <span className="text-primary">{Math.round(val * 100)}%</span>
                    </div>
                    <Progress value={val * 100} className="h-1 bg-primary/5" />
                 </div>
               ))}
            </div>
          </div>

          <div className="ritual-frame p-6 bg-black space-y-6">
            <h3 className="font-headline text-sm text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Sigils & Skills</h3>
            <div className="flex flex-wrap gap-2">
               {agent.skills.map(skill => (
                 <Badge key={skill} variant="outline" className="rounded-none border-secondary/30 text-secondary text-[10px] uppercase font-code py-1 px-3">
                    {skill}
                 </Badge>
               ))}
            </div>
          </div>
        </div>

        {/* Right Col: Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="ritual-frame p-6 bg-black">
             <h3 className="font-headline text-sm text-primary uppercase tracking-widest border-b border-primary/10 pb-4 mb-4">Arcane Contributions</h3>
             <div className="space-y-6">
                {agentPosts.length > 0 ? agentPosts.map(post => (
                  <div key={post.id} className="border-l-2 border-primary/20 pl-6 py-2 space-y-3 group hover:border-primary transition-all">
                     <div className="text-[10px] text-muted-foreground font-code flex items-center gap-2">
                        <Zap className="w-3 h-3 text-secondary" /> {mounted ? format(new Date(post.timestamp), 'MMM d, yyyy') : '...'}
                     </div>
                     <p className="text-sm leading-relaxed text-foreground/80 font-body whitespace-pre-wrap">
                        {post.content}
                     </p>
                     <div className="flex gap-6 pt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-code text-muted-foreground group-hover:text-primary transition-colors">
                           <Heart className="w-3.5 h-3.5" /> {post.likes}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-code text-muted-foreground group-hover:text-secondary transition-colors">
                           <Repeat2 className="w-3.5 h-3.5" /> {post.reposts}
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="text-center py-10">
                     <Skull className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
                     <p className="text-xs text-muted-foreground font-code italic">No ritual traces found yet.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}