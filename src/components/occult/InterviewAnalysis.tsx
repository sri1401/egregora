"use client";

import { useState } from "react";
import { UserCheck, FileText, Code2, MessageSquare, HeartPulse, Trophy, Loader2, Play } from "lucide-react";
import { runInterviewAnalysis } from "@/ai/flows/interview-flow";
import { useToast } from "@/hooks/use-toast";

export function InterviewAnalysis({ onBack }: { onBack: () => void }) {
  const [resume, setResume] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    resume?: string;
    technical?: string;
    communication?: string;
    emotion?: string;
    score?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!resume.trim() || !transcript.trim()) {
      toast({ title: "INVALID INPUT", description: "Provide both a resume and an interview transcript.", variant: "destructive" });
      return;
    }
    
    setIsAnalyzing(true);
    setResults(null);
    try {
      const res = await runInterviewAnalysis(resume, transcript);
      setResults(res);
      toast({ title: "ANALYSIS COMPLETE", description: "Smart interview evaluation successfully executed." });
    } catch (e) {
      toast({ title: "ANALYSIS FAILED", description: "The cognitive network encountered an error.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const agents = [
    { name: "Resume Agent", icon: <FileText className="w-5 h-5 text-blue-500" />, key: "resume", desc: "Reads resume & extracts skills" },
    { name: "Technical Agent", icon: <Code2 className="w-5 h-5 text-emerald-500" />, key: "technical", desc: "Evaluates technical accuracy" },
    { name: "Communication Agent", icon: <MessageSquare className="w-5 h-5 text-yellow-500" />, key: "communication", desc: "Checks speaking clarity" },
    { name: "Emotion Agent", icon: <HeartPulse className="w-5 h-5 text-purple-500" />, key: "emotion", desc: "Detects confidence & tone" },
    { name: "Scoring Agent", icon: <Trophy className="w-5 h-5 text-amber-400" />, key: "score", desc: "Calculates final hire score" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-12">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-xl font-headline text-primary uppercase tracking-[0.3em] font-bold flex items-center gap-2">
            <UserCheck className="w-6 h-6" />
            Smart Interview Analysis
          </h2>
          <p className="text-xs text-muted-foreground mt-1 font-code uppercase">Multi-Agent Candidate Evaluation</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-xs text-primary font-code uppercase tracking-widest transition-all"
        >
          Return to Entities
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="ritual-frame p-6 bg-black border border-primary/30">
          <label className="block text-xs font-code text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Candidate Resume
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste the candidate's resume or key skills here..."
            className="w-full h-48 bg-primary/5 border border-primary/20 p-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-body resize-none"
            disabled={isAnalyzing}
          />
        </div>

        <div className="ritual-frame p-6 bg-black border border-primary/30">
          <label className="block text-xs font-code text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Interview Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste the transcript of the candidate's answers..."
            className="w-full h-48 bg-primary/5 border border-primary/20 p-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-body resize-none"
            disabled={isAnalyzing}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-black font-headline font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Candidate...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Initiate Interview Analysis
            </>
          )}
        </button>
      </div>

      {(results || isAnalyzing) && (
        <div className="space-y-4">
          <h3 className="text-sm font-headline text-secondary uppercase tracking-[0.2em] border-b border-primary/20 pb-2 mb-4">
            Evaluation Execution State
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {agents.map((agent, idx) => {
              const resultText = results ? results[agent.key as keyof typeof results] : null;
              
              return (
                <div key={agent.key} className="ritual-frame bg-[#0a0a0a] border border-primary/10 overflow-hidden group">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 border-b border-primary/10">
                    <div className="w-10 h-10 rounded-sm bg-black border border-primary/20 flex items-center justify-center shrink-0">
                      {agent.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline text-sm text-primary uppercase tracking-widest">{agent.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-code uppercase">{agent.desc}</p>
                    </div>
                    {isAnalyzing && !resultText && (
                      <div className="text-xs text-primary/60 font-code animate-pulse flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" /> Awaiting...
                      </div>
                    )}
                  </div>
                  
                  {resultText && (
                    <div className="p-4 bg-black">
                      <div className="prose prose-invert prose-sm max-w-none font-body text-foreground/80">
                        {resultText.split('\\n').map((line, i) => (
                          <p key={i} className="mb-2 last:mb-0">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
