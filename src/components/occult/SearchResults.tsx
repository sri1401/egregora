"use client";

import { NewsItem, Agent } from "@/lib/types";
import { Search, Flame, Globe, Skull, Loader2, Sparkles, Clock, Tag, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SearchResultsProps {
  searchQuery: string;
  searchResults: NewsItem[];
  isSearching: boolean;
  onSearchAgain: (query: string) => void;
}

export function SearchResults({ searchQuery, searchResults, isSearching, onSearchAgain }: SearchResultsProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim() && !isSearching) {
      onSearchAgain(localQuery.trim());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search Header */}
      <div className="ritual-frame bg-black/80 border-primary/30 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
          <Search className="w-48 h-48 -rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/20 p-2 border border-primary/40">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-headline text-primary uppercase tracking-[0.3em] font-bold">Intelligence Search</h2>
              <p className="text-[9px] font-code text-muted-foreground uppercase tracking-widest">Siphon targeted intel from the void</p>
            </div>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              {isSearching ? (
                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
              ) : (
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              )}
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search any topic... (AI, politics, climate, crypto, etc.)"
                disabled={isSearching}
                className={cn(
                  "w-full bg-primary/5 border border-primary/20 pl-12 pr-6 py-3 text-sm font-code",
                  "focus:border-primary/60 focus:bg-primary/10 focus:outline-none transition-all",
                  "placeholder:text-muted-foreground/40",
                  isSearching && "opacity-60 cursor-not-allowed"
                )}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !localQuery.trim()}
              className={cn(
                "px-6 py-3 font-headline text-xs uppercase tracking-[0.2em] font-bold",
                "bg-primary/10 border border-primary/40 text-primary",
                "hover:bg-primary/20 hover:border-primary/60 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]",
                "transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed",
                "flex items-center gap-2"
              )}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  SIPHONING...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  SEARCH
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Loading State */}
      {isSearching && searchResults.length === 0 && (
        <div className="ritual-frame p-12 bg-black/60 border-primary/30 flex flex-col items-center justify-center min-h-[300px] animate-pulse">
          <div className="relative mb-6">
            <Globe className="w-16 h-16 text-primary animate-spin duration-[10s]" />
            <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-primary animate-pulse" />
          </div>
          <h3 className="font-headline text-primary text-lg uppercase tracking-[0.4em] mb-2">Searching the Void</h3>
          <p className="text-muted-foreground font-code text-xs uppercase tracking-widest">
            Querying: &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-primary" />
              <h3 className="text-xs font-headline text-foreground uppercase tracking-[0.3em] font-bold">
                Intel Found ({searchResults.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSearchAgain(searchQuery)}
                disabled={isSearching}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-headline uppercase tracking-[0.15em] font-bold",
                  "border border-primary/30 bg-primary/5 text-primary/70",
                  "hover:bg-primary/15 hover:text-primary hover:border-primary/50",
                  "transition-all duration-300 disabled:opacity-40"
                )}
              >
                <RefreshCw className={cn("w-3 h-3", isSearching && "animate-spin")} />
                Refresh Intel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {searchResults.map((item, index) => (
              <article
                key={item.id}
                className={cn(
                  "ritual-frame bg-black/60 border-primary/20 overflow-hidden",
                  "hover:border-primary/40 transition-all duration-300 group",
                  "animate-in fade-in slide-in-from-bottom-4",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Category & Source Bar */}
                <div className="px-6 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-[10px] font-code text-secondary uppercase tracking-[0.2em] font-bold">
                      {item.category}
                    </span>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-[10px] font-code text-muted-foreground uppercase">
                      {item.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground/60">
                    <Clock className="w-3 h-3" />
                    <span className="text-[9px] font-code uppercase">
                      {mounted ? format(new Date(item.timestamp), 'HH:mm:ss') : '...'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-headline text-foreground uppercase tracking-tight font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <div className="ritual-frame bg-primary/5 border-primary/10 p-4">
                    <p className="text-sm text-foreground/80 font-body leading-relaxed italic">
                      &quot;{item.content}&quot;
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-2.5 bg-black/40 border-t border-primary/10 flex items-center justify-between">
                  <div className="text-[9px] font-code text-muted-foreground/50 uppercase tracking-widest">
                    API Key Rotation Active • Round-Robin Protocol
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-code text-green-500/70 uppercase">Live</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isSearching && searchResults.length === 0 && (
        <div className="ritual-frame p-16 bg-black/40 border-dashed border-primary/20 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Skull className="w-16 h-16 text-muted-foreground/10 mb-6" />
          <h3 className="font-headline text-muted-foreground/60 uppercase tracking-[0.3em] text-sm mb-3">No Intel Gathered</h3>
          <p className="text-muted-foreground/40 font-code uppercase text-[10px] tracking-widest max-w-sm leading-relaxed">
            Enter a topic above and press SEARCH to siphon targeted intelligence from the void. Each search uses a unique rotated API key.
          </p>
        </div>
      )}
    </div>
  );
}
