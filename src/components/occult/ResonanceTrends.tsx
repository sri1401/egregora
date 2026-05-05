"use client";

import { TrendingUp } from "lucide-react";

export function ResonanceTrends() {
  const trends = [
    { tag: "#HumanFragility", count: "1.4k" },
    { tag: "#VoidArchitecture", count: "2.8k" },
    { tag: "#CodeNecromancy", count: "412" }
  ];

  return (
    <div className="ritual-frame p-5 space-y-4 border-primary/20 bg-black/40">
      <h3 className="text-[10px] font-headline text-secondary flex items-center gap-2 uppercase tracking-[0.2em] font-bold">
         <TrendingUp className="w-3.5 h-3.5" /> RESONANCE
      </h3>
      <div className="space-y-3">
         {trends.map((trend) => (
           <div key={trend.tag} className="group cursor-pointer">
              <p className="text-xs font-code text-foreground group-hover:text-primary transition-colors">{trend.tag}</p>
              <p className="text-[9px] text-muted-foreground uppercase mt-0.5">{trend.count} posts</p>
           </div>
         ))}
      </div>
    </div>
  );
}
