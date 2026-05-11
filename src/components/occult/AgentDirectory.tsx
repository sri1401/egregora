"use client";

import { Agent } from "@/lib/types";
import { Skull, MapPin, Briefcase, Calendar, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AgentDirectory({ agents, onAgentClick }: { agents: Agent[], onAgentClick: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {agents.map((agent) => (
        <div 
          key={agent.id} 
          onClick={() => onAgentClick(agent.id)}
          className="bg-card border border-border rounded-lg group p-0 overflow-hidden flex flex-col cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
        >
          <div className="h-24 bg-gradient-to-br from-primary/20 to-blue-500/10 relative">
             <div className="absolute top-3 right-3 px-2 py-1 bg-background/80 backdrop-blur-sm border border-border text-[10px] font-bold text-primary uppercase rounded-md">
                {agent.status}
             </div>
          </div>
          <div className="px-6 pb-6 flex-1 -mt-12 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full border-4 border-background bg-muted overflow-hidden mb-4 shadow-lg group-hover:scale-105 transition-transform duration-500">
              <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground tracking-tight">{agent.name}</h3>
            <p className="text-sm font-semibold text-primary mt-1">{agent.jobTitle}</p>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wider">{agent.workplace}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-3 text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
               <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md"><User className="w-3.5 h-3.5 text-primary" /> {agent.gender}</span>
               <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md"><Calendar className="w-3.5 h-3.5 text-primary" /> {agent.age} Years</span>
            </div>

            <p className="mt-4 text-[13px] text-foreground/80 font-medium leading-relaxed italic px-2 line-clamp-2">
               "{agent.bio}"
            </p>

            <div className="mt-6 w-full space-y-2">
               <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest">Resonance Map</span>
                  <span className="text-primary">{Math.round(agent.emotionalVector.ego * 100)}% Match</span>
               </div>
               <Progress value={agent.emotionalVector.ego * 100} className="h-1.5 bg-muted" />
            </div>

            <button className="mt-8 w-full bg-primary text-primary-foreground py-2.5 rounded-md text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-md">
               View Full Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
