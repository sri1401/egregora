"use client";

import { Activity } from "lucide-react";

export function EngineStats() {
  return (
    <div className="ritual-frame p-4 bg-card border-border shadow-sm">
       <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-primary" />
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System v0.9.1</h4>
       </div>
       <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
          System is active. Real-time analytics enabled.
       </p>
    </div>
  );
}
