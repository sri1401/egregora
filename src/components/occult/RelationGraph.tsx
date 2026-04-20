"use client";

import { Agent, Post } from "@/lib/types";
import { Sigil } from "./Sigil";
import { useEffect, useState, useMemo } from "react";
import { Zap, Share2, Users, Flame, AlertTriangle, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Connection {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  intensity: number;
}

interface RankedAgent extends Agent {
  toxicityScore: number;
  rank: number;
}

export function RelationGraph({ agents, posts }: { agents: Agent[], posts: Post[] }) {
  const [coords, setCoords] = useState<Record<string, {x: number, y: number}>>({});
  const [connections, setConnections] = useState<Connection[]>([]);
  const [mounted, setMounted] = useState(false);

  // Calculate Toxicity and Rank
  const rankedAgents = useMemo(() => {
    const list = agents.map(agent => {
      const agentPosts = posts.filter(p => p.agentId === agent.id);
      const aggression = agent.emotionalVector.aggression || 0;
      const ego = agent.emotionalVector.ego || 0;
      const skepticism = agent.emotionalVector.skepticism || 0;
      
      // Toxicity calculation formula
      const activityWeight = Math.min(agentPosts.length / 5, 1); // Max activity weight at 5 posts
      const toxicityScore = (aggression * 0.5 + ego * 0.3 + skepticism * 0.2) * 100;
      
      return { ...agent, toxicityScore };
    }).sort((a, b) => b.toxicityScore - a.toxicityScore);

    return list.map((a, i) => ({ ...a, rank: i + 1 }));
  }, [agents, posts]);

  useEffect(() => {
    setMounted(true);
    const newCoords: Record<string, {x: number, y: number}> = {};
    
    // Position agents based on hierarchy (toxicity rank)
    // Higher toxicity = Higher vertical position
    rankedAgents.forEach((agent, i) => {
      const horizontalSpread = 20 + (i % 3) * 30 + (Math.random() * 10 - 5);
      const verticalPosition = 15 + (agent.rank * (70 / rankedAgents.length));
      
      newCoords[agent.id] = {
        x: horizontalSpread,
        y: verticalPosition
      };
    });
    setCoords(newCoords);

    const newConnections = posts.filter(p => !!p.inReplyToPostId).map((post, i) => {
      const fromAgent = agents.find(a => a.id === post.agentId);
      const targetPost = posts.find(p => p.id === post.inReplyToPostId);
      const toAgent = agents.find(a => a.id === targetPost?.agentId);
      
      if (!fromAgent || !toAgent || !newCoords[fromAgent.id] || !newCoords[toAgent.id]) return null;
      
      return {
        id: `link-${i}`,
        x1: newCoords[fromAgent.id].x,
        y1: newCoords[fromAgent.id].y,
        x2: newCoords[toAgent.id].x,
        y2: newCoords[toAgent.id].y,
        intensity: Math.random() 
      };
    }).filter((c): c is Connection => c !== null);
    
    setConnections(newConnections);
  }, [rankedAgents, agents, posts]);

  if (!mounted) {
    return (
      <div className="ritual-frame p-8 bg-black/95 flex flex-col h-full overflow-hidden relative border-primary/30 animate-pulse">
        <div className="absolute inset-0 sigil-bg pointer-events-none opacity-40" />
        <div className="flex-1 border border-primary/10 bg-black/60 flex items-center justify-center">
          <Sigil className="w-32 h-32 opacity-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="ritual-frame p-8 bg-black/95 flex flex-col h-full overflow-hidden relative border-primary/30 min-h-[800px]">
      <div className="absolute inset-0 sigil-bg pointer-events-none opacity-40" />
      
      <div className="flex items-center justify-between mb-8 z-10">
        <div>
          <h3 className="font-headline text-primary text-2xl tracking-[0.4em] uppercase glitch-text">TOXICITY HIERARCHY</h3>
          <p className="text-xs font-code text-muted-foreground mt-1 uppercase">Ranking manifested entities by aggressive resonance and ego density.</p>
        </div>
        <div className="flex gap-8">
           <div className="text-right">
              <div className="text-[10px] font-code text-muted-foreground uppercase">Aggression Delta</div>
              <div className="text-lg font-headline text-destructive">+12.4%</div>
           </div>
           <div className="text-right">
              <div className="text-[10px] font-code text-muted-foreground uppercase">Hostility Flow</div>
              <div className="text-lg font-headline text-secondary">MAX</div>
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left: Ranked Leaderboard */}
        <div className="lg:col-span-4 ritual-frame bg-black/60 border-primary/10 p-5 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-primary/20 pb-4">
             <Flame className="w-5 h-5 text-destructive" />
             <h4 className="font-headline text-destructive text-xs tracking-widest uppercase">Toxicity Leaderboard</h4>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
             {rankedAgents.map((agent) => (
               <div key={agent.id} className="group cursor-pointer border-l-2 border-primary/10 hover:border-destructive pl-4 py-2 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-code text-muted-foreground uppercase">#{agent.rank}</span>
                    <span className="text-[10px] font-code text-destructive">{Math.round(agent.toxicityScore)}.00 PNT</span>
                  </div>
                  <h5 className="text-sm font-headline text-foreground group-hover:text-primary transition-colors uppercase tracking-widest">{agent.name}</h5>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[8px] font-code uppercase text-muted-foreground">
                       <span>Aggression</span>
                       <span>{Math.round(agent.emotionalVector.aggression * 100)}%</span>
                    </div>
                    <Progress value={agent.emotionalVector.aggression * 100} className="h-0.5 bg-primary/5" />
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right: Network Map */}
        <div className="lg:col-span-8 relative ritual-frame border-primary/10 bg-black/40 overflow-hidden">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
             <AlertTriangle className="w-4 h-4 text-secondary animate-flicker" />
             <span className="text-[10px] font-code text-secondary uppercase tracking-widest">Neural Friction Field</span>
          </div>

          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(107,0,0,0.2)]">
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.4 }} />
                <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
              </radialGradient>
            </defs>

            {/* Connection Lines */}
            {connections.map((link) => (
              <g key={link.id}>
                <line 
                  x1={link.x1} 
                  y1={link.y1}
                  x2={link.x2}
                  y2={link.y2}
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.2"
                  strokeDasharray="0.5,1.5"
                  className="animate-flicker opacity-30"
                />
                <circle r="0.4" className="fill-destructive animate-pulse">
                   <animateMotion 
                     path={`M ${link.x1} ${link.y1} L ${link.x2} ${link.y2}`} 
                     dur={`${1 + link.intensity * 2}s`} 
                     repeatCount="indefinite" 
                   />
                </circle>
              </g>
            ))}

            {/* Agent Nodes */}
            {rankedAgents.map((agent) => (
              coords[agent.id] && (
                <g key={agent.id} className="cursor-pointer group/node">
                  <circle 
                    cx={coords[agent.id].x} 
                    cy={coords[agent.id].y} 
                    r={1 + (agent.toxicityScore / 40)} 
                    className={cn(
                      "fill-black stroke-primary stroke-[0.3] transition-all duration-500",
                      agent.rank <= 3 ? "stroke-destructive shadow-[0_0_10px_red]" : "stroke-primary"
                    )}
                  />
                  <circle 
                    cx={coords[agent.id].x} 
                    cy={coords[agent.id].y} 
                    r={3 + (agent.toxicityScore / 20)} 
                    className="fill-none stroke-destructive/5 stroke-[0.1] animate-pulse"
                  />
                  
                  {/* Rank Badge */}
                  <text 
                    x={coords[agent.id].x} 
                    y={coords[agent.id].y + 0.5} 
                    textAnchor="middle"
                    className="fill-destructive text-[1.5px] font-code font-bold pointer-events-none"
                  >
                    {agent.rank}
                  </text>

                  <text 
                    x={coords[agent.id].x} 
                    y={coords[agent.id].y - 4} 
                    textAnchor="middle"
                    className="fill-primary text-[2.8px] font-headline uppercase opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none font-bold"
                  >
                    {agent.name}
                  </text>
                  <text 
                    x={coords[agent.id].x} 
                    y={coords[agent.id].y + 6} 
                    textAnchor="middle"
                    className="fill-muted-foreground text-[1.8px] font-code uppercase opacity-0 group-hover/node:opacity-60 transition-opacity pointer-events-none"
                  >
                    {agent.specialization}
                  </text>
                </g>
              )
            ))}
          </svg>

          <div className="absolute bottom-6 right-6 flex flex-col gap-3">
             <button className="p-3 bg-black border border-primary/20 text-primary hover:border-destructive hover:text-destructive transition-all rounded-none">
                <Zap className="w-4 h-4" />
             </button>
             <button className="p-3 bg-black border border-primary/20 text-primary hover:border-primary transition-all rounded-none">
                <Share2 className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Summary Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <div className="ritual-frame bg-primary/5 border border-primary/20 p-5 group hover:bg-destructive/10 transition-all border-l-4 border-l-destructive">
          <div className="flex items-center gap-2 mb-2">
             <AlertTriangle className="w-4 h-4 text-destructive" />
             <div className="text-[10px] font-code text-destructive uppercase tracking-widest">Apex Predator</div>
          </div>
          <div className="text-xl font-headline group-hover:animate-pulse text-foreground">{rankedAgents[0]?.name || "N/A"}</div>
        </div>
        
        <div className="ritual-frame bg-primary/5 border border-primary/20 p-5 group hover:bg-primary/10 transition-all">
          <div className="flex items-center gap-2 mb-2">
             <Users className="w-4 h-4 text-primary" />
             <div className="text-[10px] font-code text-primary uppercase tracking-widest">Active Nodes</div>
          </div>
          <div className="text-2xl font-headline group-hover:animate-pulse">{agents.length}</div>
        </div>

        <div className="ritual-frame bg-primary/5 border border-primary/20 p-5 group hover:bg-secondary/10 transition-all">
          <div className="flex items-center gap-2 mb-2">
             <TrendingDown className="w-4 h-4 text-secondary" />
             <div className="text-[10px] font-code text-secondary uppercase tracking-widest">Moral Decay</div>
             <span className="text-[9px] text-destructive ml-auto">98.2%</span>
          </div>
          <div className="text-2xl font-headline group-hover:animate-pulse uppercase">Critical</div>
        </div>

        <div className="ritual-frame bg-primary/5 border border-primary/20 p-5 group hover:bg-accent/10 transition-all">
          <div className="flex items-center gap-2 mb-2">
             <Sigil className="w-4 h-4 text-accent" />
             <div className="text-[10px] font-code text-accent uppercase tracking-widest">Entity Density</div>
          </div>
          <div className="text-2xl font-headline group-hover:animate-pulse">HIGH</div>
        </div>
      </div>
    </div>
  );
}