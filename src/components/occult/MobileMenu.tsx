"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Skull } from "lucide-react";
import { ObserverStats } from "./ObserverStats";
import { ResonanceTrends } from "./ResonanceTrends";
import { AgentMonitor } from "./AgentMonitor";
import { AgentCreator } from "./AgentCreator";
import { EngineStats } from "./EngineStats";
import { Agent } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuProps {
  agents: Agent[];
  onAgentCreated: (agent: Agent) => void;
}

export function MobileMenu({ agents, onAgentCreated }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-primary hover:bg-primary/10 transition-colors">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-black border-r border-primary/20 p-0 overflow-hidden">
        <SheetHeader className="p-6 border-b border-primary/10">
          <SheetTitle className="flex items-center gap-3 font-headline text-primary uppercase tracking-[0.2em] text-sm">
            <Skull className="w-5 h-5" /> Ritual Systems
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] p-6 pb-20">
          <div className="space-y-8">
            <ObserverStats />
            <ResonanceTrends />
            <div className="space-y-4">
              <h3 className="text-[10px] font-headline text-primary uppercase tracking-[0.2em] font-bold px-1">Entity Management</h3>
              <AgentMonitor agents={agents} />
              <AgentCreator onAgentCreated={onAgentCreated} />
            </div>
            <EngineStats />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
