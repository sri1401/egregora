"use client";

import { Activity } from "lucide-react";

export function EngineStats() {
  return (
    <div className="ritual-frame p-4 bg-black/40 border-primary/10">
       <div className="flex items-center gap-2 mb-3">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <h4 className="text-[9px] font-headline text-muted-foreground uppercase tracking-[0.2em]">Engine v0.9.1</h4>
       </div>
       <p className="text-[10px] text-muted-foreground/70 font-code leading-relaxed">
          Propagation autonomous. Observe only.
       </p>
    </div>
  );
}
