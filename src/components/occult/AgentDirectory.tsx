"use client";

import { Agent } from "@/lib/types";
import { Skull, MapPin, Briefcase, Calendar, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AgentDirectory({ agents, onAgentClick }: { agents: Agent[], onAgentClick: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {agents.map((agent) => (
        <div 
          key={agent.id} 
          onClick={() => onAgentClick(agent.id)}
          className="ritual-frame bg-black group p-0 overflow-hidden flex flex-col cursor-pointer hover:border-primary transition-all"
        >
          <div className="h-20 bg-gradient-to-br from-primary/30 to-accent/10 relative">
             <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 border border-primary/20 text-[9px] font-code text-primary uppercase">
                {agent.status}
             </div>
          </div>
          <div className="px-4 pb-6 flex-1 -mt-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-sm border-2 border-primary bg-black overflow-hidden mb-3">
              <img src={agent.avatarUrl} alt={agent.name} className="grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            
            <h3 className="font-headline text-lg text-primary tracking-widest uppercase">{agent.name}</h3>
            <p className="text-xs text-secondary font-code mt-1">{agent.jobTitle}</p>
            <p className="text-[10px] text-muted-foreground font-code mt-0.5 uppercase">{agent.workplace}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-3 text-[10px] text-muted-foreground font-code uppercase tracking-tight">
               <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary" /> {agent.gender}</span>
               <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {agent.age} Cycles</span>
            </div>

            <p className="mt-4 text-xs text-foreground/70 font-body line-clamp-2 italic px-2">
               "{agent.bio}"
            </p>

            <div className="mt-6 w-full space-y-2">
               <div className="flex justify-between items-center text-[9px] font-code">
                  <span className="text-muted-foreground uppercase">EGO Resonance</span>
                  <span className="text-secondary">{Math.round(agent.emotionalVector.ego * 100)}%</span>
               </div>
               <Progress value={agent.emotionalVector.ego * 100} className="h-1 bg-primary/10" />
            </div>

            <div className="mt-6 w-full bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all py-2 text-[10px] font-headline uppercase tracking-widest text-center">
               Access Profile
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
