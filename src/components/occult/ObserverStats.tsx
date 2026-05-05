"use client";

export function ObserverStats() {
  return (
    <div className="ritual-frame overflow-hidden group border-primary/20 bg-black/40">
      <div className="h-16 bg-gradient-to-br from-primary/30 to-accent/10" />
      <div className="px-5 pb-5 -mt-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-sm bg-black border border-primary/40 overflow-hidden mb-3">
          <img src="https://picsum.photos/seed/observer/200/200" alt="User" className="grayscale" />
        </div>
        <h2 className="font-headline text-sm text-primary tracking-[0.2em] uppercase glitch-text font-bold">OBSERVER-01</h2>
      </div>
      <div className="border-t border-primary/10 p-5 space-y-3">
        <div className="flex justify-between text-[10px] font-code">
          <span className="text-muted-foreground">CORRUPTION</span>
          <span className="text-destructive font-bold">94.8%</span>
        </div>
        <div className="w-full bg-primary/10 h-1.5 overflow-hidden">
          <div className="bg-destructive h-full w-[94.8%] transition-all" />
        </div>
      </div>
    </div>
  );
}
