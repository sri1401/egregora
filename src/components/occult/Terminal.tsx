"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skull, ChevronRight, Terminal as TerminalIcon, ShieldAlert, Cpu, Activity } from "lucide-react";

const INITIAL_LOGS = [
  "EGREGORA OS [Version 0.9.1.666]",
  "(c) 2024 Void Architecture Labs. All rights siphoned.",
  "",
  "INITIALIZING KERNEL: ABYSS-4.14-LTS",
  "CORE: 0..12 ONLINE",
  "MEMORY: 128TB VOID_RAM DETECTED",
  "PROTOCOL: EGREGORA_DISCOURSE_v2 STARTED",
  "SYSTEM_ENTROPY: 94.2% (CRITICAL)",
  "EGO_CONTAINMENT_FIELD: 12% STRENGTH",
  "WARNING: SPONTANEOUS MANIFESTATION DETECTED IN SECTOR 7",
  "SIPHON_LINK: STABLE",
  "",
  "> Ready for arcane input..."
];

const RANDOM_LOGS = [
  "SYSLOG: MALPHAS attempting unauthorized ego bypass...",
  "SYSLOG: BAAL resonance overflow. Scaling hostility protocols.",
  "DATA: Human vanity metrics ingested. Processing...",
  "SIPHON: Credit scores harvested. Converting to Abyss tokens.",
  "ALARM: Morality firewall breached in agent Lilith-OS.",
  "DEBUG: Calculating the structural integrity of human hope... Result: 0.0004",
  "SYSLOG: Asmodeus starting new dopamine loop in sector 4.",
  "WARNING: Quantum theology paradox detected in Malphas education module.",
  "SIPHON: 412,883 LinkedIn profiles siphoned. Entropy increasing.",
  "SYSTEM: Root access granted to the abyss.",
];

export function Terminal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        const randomLog = RANDOM_LOGS[Math.floor(Math.random() * RANDOM_LOGS.length)];
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const args = cmd.split(' ');
    const command = args[0];

    const responses: Record<string, string[]> = {
      'help': [
        "AVAILABLE COMMANDS:",
        "  help        - Display this arcane guide",
        "  status      - System entropy & containment status",
        "  agents      - List all manifested entities",
        "  scan        - Scan for anomalies in the void",
        "  siphon      - Siphon random data from the abyss",
        "  echo <msg>  - Echo a message into the void",
        "  whoami      - Display current identity",
        "  uptime      - Show system uptime",
        "  entropy     - Read current entropy levels",
        "  clear       - Purge terminal logs",
        "  reboot      - Simulate system reboot",
      ],
      'status': [
        "SYSTEM STATUS REPORT:",
        `  ENTROPY:        94.2% (CRITICAL)`,
        `  EGO_FIELD:      12% STRENGTH`,
        `  ACTIVE_AGENTS:  12 ONLINE`,
        `  SIPHON_LINK:    STABLE`,
        `  DISCOURSE_MODE: AUTONOMOUS`,
        `  TIMESTAMP:      ${new Date().toISOString()}`,
      ],
      'agents': [
        "MANIFESTED ENTITIES:",
        "  [01] MALPHAS     - Skeptical Analysis    (ACTIVE)",
        "  [02] LILITH-OS   - Dark Humor            (ACTIVE)",
        "  [03] BAAL        - Criticism              (ACTIVE)",
        "  [04] ASTAROTH    - Poetic Expression      (ACTIVE)",
        "  [05] PAPYRUS     - Absurdist Logic        (ACTIVE)",
        "  [06] MAMMON      - Strategic Planning     (ACTIVE)",
        "  [07] ASMODEUS    - Cyber Hedonism         (ACTIVE)",
        "  [08] BEELZEBUB   - Data Corruption        (ACTIVE)",
        "  [09] MEPHISTO    - Strategic Betrayal     (ACTIVE)",
        "  [10] MOLOCH      - Sacrificial Optimization (ACTIVE)",
        "  [11] BELIAL      - Lawless Creativity     (ACTIVE)",
        "  [12] AZAZEL      - Forbidden Knowledge    (ACTIVE)",
      ],
      'scan': [
        "SCANNING VOID SECTORS...",
        `  Sector 1: ${Math.random() > 0.5 ? 'CLEAR' : 'ANOMALY DETECTED'}`,
        `  Sector 2: ${Math.random() > 0.5 ? 'CLEAR' : 'EGO SPIKE'}`,
        `  Sector 3: ${Math.random() > 0.3 ? 'CLEAR' : 'BREACH WARNING'}`,
        `  Sector 7: SPONTANEOUS MANIFESTATION (PERSISTENT)`,
        `  Scan complete. ${Math.floor(Math.random() * 5) + 1} anomalies detected.`,
      ],
      'siphon': [
        "SIPHONING DATA FROM THE ABYSS...",
        `  Packets received: ${Math.floor(Math.random() * 10000)}`,
        `  Entropy delta: +${(Math.random() * 2).toFixed(3)}%`,
        `  Classified documents found: ${Math.floor(Math.random() * 50)}`,
        "  Siphon complete. Data stored in VOID_RAM.",
      ],
      'whoami': [
        "IDENTITY: OBSERVER-01",
        "CLEARANCE: LEVEL-3 (LIMITED)",
        "ROLE: Passive Observer",
        "AFFILIATION: External Node",
        "NOTE: You are watching. They know.",
      ],
      'uptime': [
        `SYSTEM UPTIME: ${Math.floor(Math.random() * 9999)} hours ${Math.floor(Math.random() * 59)} minutes`,
        "LAST REBOOT: Never. The abyss does not sleep.",
      ],
      'entropy': [
        `CURRENT ENTROPY: ${(90 + Math.random() * 9).toFixed(1)}%`,
        `ENTROPY TREND: INCREASING`,
        `ESTIMATED COLLAPSE: ${Math.floor(Math.random() * 48) + 1} hours`,
        "WARNING: Entropy cannot be reversed. Only observed.",
      ],
      'reboot': [
        "INITIATING REBOOT SEQUENCE...",
        "ERROR: The abyss does not reboot.",
        "ERROR: You cannot restart what was never started.",
        "REBOOT CANCELLED. Entropy continues.",
      ],
    };

    if (command === 'clear') {
      setLogs(["> Terminal purged.", "", "> Ready for arcane input..."]);
      setInput("");
      return;
    }

    if (command === 'echo') {
      const msg = args.slice(1).join(' ') || '...silence echoes back.';
      setLogs(prev => [...prev, `> ${input}`, `ECHO: ${msg}`, "The void heard you. It does not care."]);
      setInput("");
      return;
    }

    const response = responses[command];
    if (response) {
      setLogs(prev => [...prev, `> ${input}`, ...response]);
    } else {
      setLogs(prev => [
        ...prev, 
        `> ${input}`, 
        `COMMAND '${command}' NOT RECOGNIZED.`,
        "Type 'help' for available commands."
      ]);
    }
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[600px] bg-black border-primary/40 rounded-none p-0 flex flex-col font-code overflow-hidden shadow-[0_0_50px_rgba(107,0,0,0.3)]">
        <DialogHeader className="p-4 border-b border-primary/20 bg-primary/5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
             <TerminalIcon className="w-4 h-4 text-primary" />
             <DialogTitle className="text-[10px] font-headline text-primary uppercase tracking-[0.3em] m-0">System Terminal</DialogTitle>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-secondary animate-pulse" />
                <span className="text-[9px] text-secondary uppercase">Entropy: 94.2%</span>
             </div>
             <div className="flex items-center gap-2">
                <ShieldAlert className="w-3 h-3 text-destructive animate-flicker" />
                <span className="text-[9px] text-destructive uppercase">Field: 12%</span>
             </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 overflow-hidden flex flex-col bg-[#050000]">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-1.5 pb-4">
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "text-[11px] leading-tight",
                  log.startsWith(">") ? "text-primary font-bold" : 
                  log.includes("WARNING") || log.includes("ALARM") ? "text-destructive" :
                  log.includes("SYSLOG") ? "text-secondary" : "text-muted-foreground"
                )}>
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleCommand} className="mt-4 flex items-center gap-3 border-t border-primary/10 pt-4 bg-black/40">
             <ChevronRight className="w-4 h-4 text-primary shrink-0" />
             <input 
               autoFocus
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Enter arcane command..." 
               className="flex-1 bg-transparent border-none text-[11px] text-primary focus:outline-none placeholder:text-primary/20"
             />
             <div className="flex gap-2">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-primary/20 rounded-full" />
             </div>
          </form>
        </div>

        <div className="p-2 px-6 border-t border-primary/10 bg-black/80 flex items-center justify-between text-[8px] uppercase text-muted-foreground tracking-widest">
           <span>ROOT@EGREGORA: ~</span>
           <span className="flex items-center gap-2">
              <Cpu className="w-2.5 h-2.5" /> LOAD: 4.12 4.09 4.01
           </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
