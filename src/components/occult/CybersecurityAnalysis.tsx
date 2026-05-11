"use client";

import { useState } from "react";
import { Shield, Activity, AlertTriangle, CheckCircle, FileText, Loader2, Zap, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  detectionStage, 
  behaviorStage, 
  riskStage, 
  decisionStage, 
  reportStage 
} from "@/ai/flows/cybersecurity-analysis-flow";

export function CybersecurityAnalysis() {
  const [target, setTarget] = useState("Global Network Infrastructure");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState<number | null>(null);
  const [expandedContent, setExpandedContent] = useState<{ title: string, content: string } | null>(null);
  const [results, setResults] = useState<{
    detection?: string;
    behavior?: string;
    risk?: string;
    decision?: string;
    report?: string;
  }>({});

  const stages = [
    { id: 0, name: "Threat Detection", icon: Shield, color: "text-blue-500", agent: "Detection Agent" },
    { id: 1, name: "Behavior Analysis", icon: Activity, color: "text-purple-500", agent: "Behavior Agent" },
    { id: 2, name: "Risk Assessment", icon: AlertTriangle, color: "text-amber-500", agent: "Risk Agent" },
    { id: 3, name: "Decision Engine", icon: CheckCircle, color: "text-green-500", agent: "Decision Agent" },
    { id: 4, name: "Forensic Report", icon: FileText, color: "text-slate-500", agent: "Report Agent" },
  ];

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setResults({});
    
    try {
      setCurrentStage(0);
      const detection = await detectionStage(target);
      setResults(prev => ({ ...prev, detection }));

      setCurrentStage(1);
      const behavior = await behaviorStage(target, detection);
      setResults(prev => ({ ...prev, behavior }));

      setCurrentStage(2);
      const risk = await riskStage(target, behavior);
      setResults(prev => ({ ...prev, risk }));

      setCurrentStage(3);
      const decision = await decisionStage(target, risk);
      setResults(prev => ({ ...prev, decision }));

      setCurrentStage(4);
      const report = await reportStage(target, decision);
      setResults(prev => ({ ...prev, report }));

    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
      setCurrentStage(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {/* Expanded Overlay */}
      {expandedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card border border-border w-full max-w-4xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-8 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">{expandedContent.title}</h3>
              <button 
                onClick={() => setExpandedContent(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10 overflow-y-auto text-lg leading-relaxed font-body text-foreground/90 whitespace-pre-wrap">
              {expandedContent.content}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-card border border-border p-6 rounded-lg shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Cybersecurity Cognitive Analysis</h2>
          <p className="text-muted-foreground text-sm">Multi-agent threat intelligence and autonomous mitigation simulation.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
          <input 
            type="text" 
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Target Context..."
            className="bg-muted border border-border px-4 py-2 rounded-md text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button 
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isAnalyzing ? "Analyzing..." : "Launch Analysis"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const isComplete = !!Object.values(results)[stage.id];
          const isActive = currentStage === stage.id;
          
          return (
            <div 
              key={stage.id}
              className={cn(
                "p-4 rounded-lg border transition-all duration-500",
                isActive ? "bg-primary/5 border-primary shadow-md xl:scale-105" : "bg-card border-border",
                isComplete && !isActive ? "bg-muted/30" : ""
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-md bg-muted", isActive && "bg-primary/10")}>
                  <stage.icon className={cn("w-5 h-5", stage.color, isActive && "animate-pulse")} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{stage.agent}</span>
              </div>
              <h3 className="text-sm font-semibold mb-2">{stage.name}</h3>
              {isActive && (
                <div className="flex items-center gap-2 text-[10px] text-primary font-medium animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing...
                </div>
              )}
              {isComplete && !isActive && (
                <div className="flex items-center gap-2 text-[10px] text-green-500 font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Complete
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <AnalysisSection 
            title="Threat Detection" 
            content={results.detection} 
            isLoading={currentStage === 0} 
            icon={Shield} 
            onExpand={() => results.detection && setExpandedContent({ title: "Threat Detection Report", content: results.detection })}
          />
          <AnalysisSection 
            title="Behavior Analysis" 
            content={results.behavior} 
            isLoading={currentStage === 1} 
            icon={Activity} 
            onExpand={() => results.behavior && setExpandedContent({ title: "Behavior Analysis Report", content: results.behavior })}
          />
          <AnalysisSection 
            title="Risk Assessment" 
            content={results.risk} 
            isLoading={currentStage === 2} 
            icon={AlertTriangle} 
            onExpand={() => results.risk && setExpandedContent({ title: "Risk Assessment Report", content: results.risk })}
          />
        </div>
        <div className="space-y-6">
          <AnalysisSection 
            title="Decision Engine" 
            content={results.decision} 
            isLoading={currentStage === 3} 
            icon={CheckCircle} 
            onExpand={() => results.decision && setExpandedContent({ title: "Decision Engine Analysis", content: results.decision })}
          />
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold">Final Forensic Report</h3>
              </div>
              {results.report && (
                <button 
                  onClick={() => setExpandedContent({ title: "Final Forensic Report", content: results.report! })}
                  className="flex items-center gap-2 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Read Full
                </button>
              )}
            </div>
            <div className="p-6 flex-1 overflow-y-auto font-body text-[15px] leading-relaxed whitespace-pre-wrap italic text-foreground/80">
              {results.report ? (
                results.report
              ) : isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                  <Loader2 className="w-8 h-8 animate-spin opacity-20" />
                  <p className="text-xs uppercase tracking-widest animate-pulse">Compiling forensic data...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30">
                  <FileText className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-xs uppercase tracking-widest">Awaiting Analysis Completion</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisSection({ title, content, isLoading, icon: Icon, onExpand }: { title: string, content?: string, isLoading: boolean, icon: any, onExpand: () => void }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="px-6 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-bold">{title}</h3>
        </div>
        <div className="flex items-center gap-4">
          {content && (
            <button 
              onClick={onExpand}
              className="flex items-center gap-2 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Read
            </button>
          )}
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
        </div>
      </div>
      <div className="p-6 text-sm text-foreground/70 min-h-[100px] flex items-center">
        {content ? (
          <p className="leading-relaxed">{content}</p>
        ) : isLoading ? (
          <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
            <div className="w-1 h-4 bg-primary/20 rounded-full animate-bounce" />
            <p className="text-xs uppercase tracking-tight">Agent is analyzing signal...</p>
          </div>
        ) : (
          <p className="text-muted-foreground/30 italic">No data yet.</p>
        )}
      </div>
    </div>
  );
}
