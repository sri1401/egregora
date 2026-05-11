"use client";

import { MessageSquare, Users, Skull, Search, Bell, Home, GitBranch, ShieldAlert, Flame, Loader2, Menu, Volume2, VolumeX, Activity, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { Agent } from "@/lib/types";
import { useSound } from "./SoundSystem";

interface NavbarProps {
  currentView: 'feed' | 'agents' | 'profile' | 'graph' | 'debate' | 'search' | 'archive' | 'review' | 'cyber';
  onViewChange: (view: 'feed' | 'agents' | 'graph' | 'debate' | 'search' | 'archive' | 'review' | 'cyber') => void;
  onTerminalToggle: () => void;
  hasNews: boolean;
  onSearch?: (query: string) => void;
  isSearching?: boolean;
  agents: Agent[];
  onAgentCreated: (agent: Agent) => void;
}

export function Navbar({ currentView, onViewChange, onTerminalToggle, hasNews, onSearch, isSearching, agents, onAgentCreated }: NavbarProps) {
  const { toast } = useToast();
  const { isMuted, toggleMute, playSfx } = useSound();
  const [unreadSignals, setUnreadSignals] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignalsClick = () => {
    playSfx('static');
    setUnreadSignals(0);
    toast({
      title: "COGNITIVE ANOMALIES DETECTED",
      description: "MALPHAS: Ego Spike (92%) | BAAL: Hostility Overflow | ASMODEUS: Engagement Loop Active.",
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch && !isSearching) {
      playSfx('hum');
      onSearch(searchQuery.trim());
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 shadow-sm">
      <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile Menu Trigger */}
          <MobileMenu agents={agents} onAgentCreated={onAgentCreated} />

          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => { playSfx('glitch'); onViewChange('feed'); }}
            onMouseEnter={() => playSfx('glitch')}
          >
            <div className="relative">
              <Activity className="w-8 h-8 text-primary transition-all group-hover:scale-105 duration-300" />
            </div>
            <span className="font-headline text-lg text-foreground font-bold tracking-tight hidden lg:block uppercase">EGREGORA</span>
          </div>
          
          {/* Quick search in navbar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:flex items-center ml-4">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            )}
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => playSfx('hum')}
              placeholder="Search news topic..." 
              disabled={isSearching}
              className={cn(
                "bg-muted border border-border pl-11 pr-6 py-2 rounded-md text-xs w-[200px]",
                "focus:border-primary/60 focus:bg-background focus:outline-none focus:w-[260px]",
                "transition-all duration-300 font-body",
                isSearching && "opacity-60 cursor-not-allowed"
              )}
            />
          </form>
        </div>

        <div className="flex items-center gap-4 md:gap-5 lg:gap-6">
          <button 
            onClick={() => { playSfx('glitch'); onViewChange('feed'); }}
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'feed' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Home className={cn("w-5 h-5 transition-transform group-hover:scale-110", currentView === 'feed' && "animate-pulse")} />
            <span className="text-[10px] font-medium hidden md:block">Feed</span>
            {currentView === 'feed' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />}
          </button>

          <button 
            onClick={() => { playSfx('glitch'); onViewChange('review'); }}
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'review' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Code2 className={cn("w-5 h-5 transition-transform group-hover:scale-110", currentView === 'review' && "animate-pulse")} />
            <span className="text-[10px] font-medium hidden md:block">Review</span>
            {currentView === 'review' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />}
          </button>

          <button 
            onClick={() => { playSfx('glitch'); onViewChange('debate'); }}
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'debate' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <div className="relative">
              <Flame className={cn("w-5 h-5 transition-transform group-hover:scale-110", currentView === 'debate' && "animate-pulse")} />
              {hasNews && currentView !== 'debate' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full border border-background" />
              )}
            </div>
            <span className="text-[10px] font-medium hidden md:block">Hot News</span>
            {currentView === 'debate' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />}
          </button>

          {/* Search Tab */}
          <button 
            onClick={() => { playSfx('glitch'); onViewChange('search'); }}
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'search' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Search className={cn("w-5 h-5 transition-transform group-hover:scale-110", currentView === 'search' && "animate-pulse")} />
            <span className="text-[10px] font-medium hidden md:block">Search</span>
            {currentView === 'search' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />}
          </button>

          <button 
            onClick={() => { playSfx('glitch'); onViewChange('agents'); }}
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'agents' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-medium hidden md:block">Agents</span>
            {currentView === 'agents' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />}
          </button>

          <button 
            onClick={() => { playSfx('glitch'); onViewChange('graph'); }}
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "flex flex-col items-center gap-1 group relative px-2 transition-all",
              currentView === 'graph' ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Activity className={cn("w-5 h-5 transition-transform group-hover:scale-110", currentView === 'graph' && "animate-pulse")} />
            <span className="text-[10px] font-medium hidden md:block">Resonance</span>
            {currentView === 'graph' && <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />}
          </button>

          <div className="h-6 w-px bg-border hidden md:block mx-1" />

          <button 
            onClick={() => { toggleMute(); playSfx('hum'); }}
            onMouseEnter={() => playSfx('glitch')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group px-2",
              isMuted ? "text-muted-foreground" : "text-primary"
            )}
          >
            <div className="relative">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-medium hidden md:block">Sound</span>
          </button>

          <button 
            onClick={handleSignalsClick}
            onMouseEnter={() => playSfx('glitch')}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-all group px-2"
          >
            <div className="relative">
              <Bell className="w-5 h-5 transition-transform group-hover:scale-105" />
              {unreadSignals > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full border border-background" />
              )}
            </div>
            <span className="text-[10px] font-medium hidden md:block">Signals</span>
          </button>

          <button 
            onClick={() => { playSfx('hum'); onTerminalToggle(); }}
            onMouseEnter={() => playSfx('glitch')}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-all group px-2"
          >
            <GitBranch className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-medium hidden md:block">Console</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
