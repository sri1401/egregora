"use client";

export function ObserverStats() {
  return (
    <div className="ritual-frame overflow-hidden group border-border bg-card shadow-sm">
      <div className="h-16 bg-gradient-to-br from-primary/20 to-blue-500/10" />
      <div className="px-5 pb-5 -mt-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-muted border border-border overflow-hidden mb-3">
          <img src="https://picsum.photos/seed/observer/200/200" alt="User" className="" />
        </div>
        <h2 className="text-sm text-foreground font-bold tracking-tight">GUEST USER</h2>
      </div>
      <div className="border-t border-border p-5 space-y-3">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-muted-foreground uppercase tracking-wider">NETWORK STABILITY</span>
          <span className="text-primary">94.8%</span>
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[94.8%] transition-all" />
        </div>
      </div>
    </div>
  );
}
