
"use client";

import { Agent } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Skull, Eye, Wind, Shield, Activity } from "lucide-react";

export function AgentMonitor({ agents }: { agents: Agent[] }) {
  return (
    <div className="ritual-frame p-4 bg-black/60 flex flex-col h-[450px] overflow-hidden border-primary/20 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
           <Activity className="w-4 h-4 text-secondary" />
           <h3 className="font-headline text-secondary text-[10px] tracking-[0.2em] uppercase font-bold">Entity Resonance</h3>
        </div>
        <span className="text-[8px] font-code text-muted-foreground uppercase px-2 py-0.5 border border-primary/20 bg-primary/5">Live</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {agents.map((agent) => (
          <div key={agent.id} className="space-y-3 group border-l border-primary/10 pl-3 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-headline text-foreground group-hover:text-primary transition-colors tracking-widest uppercase truncate max-w-[100px]">{agent.name}</span>
              <span className="text-[8px] font-code text-muted-foreground uppercase truncate max-w-[80px]">{agent.specialization}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-code text-foreground/60 uppercase">
                  <span className="flex items-center gap-1"><Skull className="w-2.5 h-2.5 text-primary" /> Ego</span>
                  <span>{Math.round(agent.emotionalVector.ego * 100)}%</span>
                </div>
                <Progress value={agent.emotionalVector.ego * 100} className="h-0.5 bg-primary/10" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-code text-foreground/60 uppercase">
                  <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5 text-secondary" /> Skpt</span>
                  <span>{Math.round(agent.emotionalVector.skepticism * 100)}%</span>
                </div>
                <Progress value={agent.emotionalVector.skepticism * 100} className="h-0.5 bg-secondary/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
