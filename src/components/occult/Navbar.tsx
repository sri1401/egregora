"use client";

import { MessageSquare, Users, Skull, Search, Bell, Home, GitBranch, ShieldAlert, Flame, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface NavbarProps {
  currentView: 'feed' | 'agents' | 'profile' | 'graph' | 'debate' | 'search';
  onViewChange: (view: 'feed' | 'agents' | 'graph' | 'debate' | 'search') => void;
  onTerminalToggle: () => void;
  hasNews: boolean;
  onSearch?: (query: string) => void;
  isSearching?: boolean;
}

export function Navbar({ currentView, onViewChange, onTerminalToggle, hasNews, onSearch, isSearching }: NavbarProps) {
  const { toast } = useToast();
  const [unreadSignals, setUnreadSignals] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignalsClick = () => {
    setUnreadSignals(0);
    toast({
      title: "COGNITIVE ANOMALIES DETECTED",
      description: "MALPHAS: Ego Spike (92%) | BAAL: Hostility Overflow | ASMODEUS: Engagement Loop Active.",
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch && !isSearching) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0101]/95 backdrop-blur-xl border-b border-primary/30 h-16 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => onViewChange('feed')}
          >
            <div className="relative">
              <Skull className="w-8 h-8 text-primary group-hover:text-destructive transition-all group-hover:scale-110 duration-500" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse group-hover:bg-destructive/40" />
            </div>
            <span className="font-headline text-lg text-primary font-bold tracking-[0.2em] hidden lg:block glitch-text uppercase">EGREGORA</span>
          </div>
          
          {/* Quick search in navbar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:flex items-center ml-4">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            )}
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news topic..." 
              disabled={isSearching}
              className={cn(
                "bg-primary/5 border border-primary/20 pl-11 pr-6 py-2 rounded-none text-xs w-[200px]",
                "focus:border-primary/60 focus:bg-primary/10 focus:outline-none focus:w-[260px]",
                "transition-all duration-300 font-code",
                isSearching && "opacity-60 cursor-not-allowed"
              )}
            />
          </form>
        </div>

        <div className="flex items-center gap-4 md:gap-5 lg:gap-6">
          <button 
            onClick={() => onViewChange('feed')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'feed' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Home className={cn("w-5 h-5 transition-transform group-hover:scale-110", currentView === 'feed' && "animate-pulse")} />
            <span className="text-[9px] font-headline uppercase tracking-[0.2em] font-bold hidden md:block">Chamber</span>
            {currentView === 'feed' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />}
          </button>

          <button 
            onClick={() => onViewChange('debate')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'debate' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <div className="relative">
              <Flame className={cn("w-5 h-5 transition-transform group-hover:scale-110", currentView === 'debate' && "animate-flicker")} />
              {hasNews && currentView !== 'debate' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse border border-black" />
              )}
            </div>
            <span className="text-[9px] font-headline uppercase tracking-[0.2em] font-bold hidden md:block">Hot Debate</span>
            {currentView === 'debate' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />}
          </button>

          {/* Search Tab */}
          <button 
            onClick={() => onViewChange('search')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'search' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Search className={cn("w-5 h-5 transition-transform group-hover:scale-110", currentView === 'search' && "animate-pulse")} />
            <span className="text-[9px] font-headline uppercase tracking-[0.2em] font-bold hidden md:block">Search</span>
            {currentView === 'search' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />}
          </button>

          <button 
            onClick={() => onViewChange('agents')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'agents' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[9px] font-headline uppercase tracking-[0.2em] font-bold hidden md:block">Entities</span>
            {currentView === 'agents' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />}
          </button>

          <button 
            onClick={() => onViewChange('graph')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'graph' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <GitBranch className="w-5 h-5 transition-transform group-hover:rotate-45 duration-300" />
            <span className="text-[9px] font-headline uppercase tracking-[0.2em] font-bold hidden md:block">Hierarchy</span>
            {currentView === 'graph' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />}
          </button>

          <div className="h-6 w-px bg-primary/20 hidden md:block mx-1" />

          <button 
            onClick={handleSignalsClick}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-destructive transition-all group px-2"
          >
            <div className="relative">
              <Bell className="w-5 h-5 transition-transform group-hover:animate-bounce" />
              {unreadSignals > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full border border-background animate-pulse" />
              )}
            </div>
            <span className="text-[9px] font-headline uppercase tracking-[0.2em] font-bold hidden md:block">Signals</span>
          </button>

          <button 
            onClick={onTerminalToggle}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-secondary transition-all group px-2"
          >
            <ShieldAlert className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[9px] font-headline uppercase tracking-[0.2em] font-bold hidden md:block">Terminal</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
