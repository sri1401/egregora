"use client";

import { useState } from "react";
import { ShieldAlert, Code2, Zap, Bug, ShieldCheck, ListChecks, Loader2, Search, Brain, Database, FileText, Activity, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  researchStage, 
  analysisStage, 
  memoryStage, 
  critiqueStage, 
  outputStage 
} from "@/ai/flows/code-review-flow";
import { generateCode } from "@/ai/flows/code-generation-flow";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export function CodeReviewer() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<{
    research: string;
    analysis: string;
    memory: string;
    critique: string;
    output: string;
  }>({ research: "", analysis: "", memory: "", critique: "", output: "" });
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState("review");
  const { toast } = useToast();

  const handleReview = async () => {
    if (!code.trim()) {
      toast({
        title: "NO CODE DETECTED",
        description: "Please provide a fragment of code for the entities to scan.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setIsReviewing(true);
    setStages({ research: "", analysis: "", memory: "", critique: "", output: "" });
    
    try {
      setCurrentStage("research");
      const research = await researchStage(code);
      setStages(prev => ({ ...prev, research }));

      setCurrentStage("analysis");
      const analysis = await analysisStage(code, research);
      setStages(prev => ({ ...prev, analysis }));

      setCurrentStage("memory");
      const memory = await memoryStage(code, analysis);
      setStages(prev => ({ ...prev, memory }));

      setCurrentStage("critique");
      const critique = await critiqueStage(code, memory);
      setStages(prev => ({ ...prev, critique }));

      setCurrentStage("output");
      const output = await outputStage(code, critique);
      setStages(prev => ({ ...prev, output }));

      setCurrentStage(null);
      toast({
        title: "COGNITIVE SCAN COMPLETE",
        description: "The 5-stage architectural review is manifest.",
      });
    } catch (error) {
      toast({
        title: "SCAN DISRUPTED",
        description: "The cognitive chain was broken by an anomaly.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsReviewing(false);
    }
  };

  const handleGenerate = async () => {
    if (!code.trim()) {
      toast({
        title: "NO INSTRUCTION",
        description: "Please provide instructions for the entities to manifest code.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateCode(code);
      setGeneratedCode(result);
      toast({
        title: "MANIFESTATION COMPLETE",
        description: "The requested logic has been manifested.",
      });
    } catch (error) {
      toast({
        title: "MANIFESTATION FAILED",
        description: "The entities were unable to stabilize the logic.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-headline text-primary uppercase tracking-[0.3em] font-bold">Smart Code Reviewer</h2>
          <p className="text-muted-foreground text-sm font-body">
            Paste your code to initiate a parallel cognitive scan by three specialized AI entities.
          </p>
        </div>
        
        {(isReviewing || stages.research || stages.analysis || stages.memory || stages.critique || stages.output) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-headline uppercase tracking-widest text-[10px] gap-2">
                <Maximize2 className="w-3 h-3" /> Full Screen View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto bg-[#0D0101] border-primary/20 backdrop-blur-xl ritual-frame p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-primary font-headline tracking-[0.3em] uppercase text-xl flex items-center gap-3">
                  <Activity className="w-5 h-5 animate-pulse" /> Cognitive Workspace
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-8">
                {/* Progress Grid in Popup */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {renderStageCard("Research", Search, "text-blue-400", "border-blue-500/50", "ring-blue-500", stages.research, currentStage === 'research', "Hunting for patterns...")}
                  {renderStageCard("Analysis", Brain, "text-emerald-400", "border-emerald-500/50", "ring-emerald-500", stages.analysis, currentStage === 'analysis', "Reasoning logic...")}
                  {renderStageCard("Memory", Database, "text-amber-600", "border-amber-700/50", "ring-amber-600", stages.memory, currentStage === 'memory', "Recalling context...")}
                  {renderStageCard("Critique", ShieldAlert, "text-red-700", "border-red-900/50", "ring-red-700", stages.critique, currentStage === 'critique', "Stress testing...")}
                  {renderStageCard("Output", FileText, "text-green-500", "border-green-500/50", "ring-green-500", stages.output, currentStage === 'output', "Manifesting report...")}
                </div>

                {/* Final Report in Popup */}
                {stages.output && (
                  <Card className="bg-primary/5 border-primary/30 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                    <CardHeader className="border-b border-primary/10 py-4">
                      <CardTitle className="text-primary flex items-center gap-3 text-base font-headline tracking-[0.2em] uppercase font-bold">
                        <Activity className="w-5 h-5 animate-pulse" /> 360° Cognitive Synthesis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="prose prose-invert prose-sm max-w-none font-body leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {stages.output}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="review" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-primary/5 border border-primary/20 p-1 h-12">
          <TabsTrigger 
            value="review" 
            className="font-headline uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
          >
            Review Signal
          </TabsTrigger>
          <TabsTrigger 
            value="generate"
            className="font-headline uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
          >
            Manifest Logic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="mt-6 space-y-6">
          <Card className="bg-[#0D0101]/60 border-primary/20 backdrop-blur-md overflow-hidden ritual-frame">
            <CardContent className="p-0">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your code here for cognitive review..."
                className="min-h-[300px] bg-transparent border-none focus-visible:ring-0 font-code text-sm p-6 resize-none"
              />
            </CardContent>
            <div className="p-4 border-t border-primary/20 bg-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-3">
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'research' ? "text-blue-400 animate-pulse" : stages.research ? "text-green-500 font-bold" : "text-muted-foreground")}>
                  {stages.research ? <ShieldCheck className="w-3 h-3" /> : <Search className="w-3 h-3" />} RESEARCH
                </div>
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'analysis' ? "text-emerald-400 animate-pulse" : stages.analysis ? "text-green-500 font-bold" : "text-muted-foreground")}>
                  {stages.analysis ? <ShieldCheck className="w-3 h-3" /> : <Brain className="w-3 h-3" />} ANALYSIS
                </div>
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'memory' ? "text-amber-600 animate-pulse" : stages.memory ? "text-green-500 font-bold" : "text-muted-foreground")}>
                  {stages.memory ? <ShieldCheck className="w-3 h-3" /> : <Database className="w-3 h-3" />} MEMORY
                </div>
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'critique' ? "text-red-700 animate-pulse" : stages.critique ? "text-green-500 font-bold" : "text-muted-foreground")}>
                  {stages.critique ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />} CRITIQUE
                </div>
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'output' ? "text-green-500 animate-pulse" : stages.output ? "text-green-500 font-bold" : "text-muted-foreground")}>
                  {stages.output ? <ShieldCheck className="w-3 h-3" /> : <FileText className="w-3 h-3" />} OUTPUT
                </div>
              </div>
              <Button 
                onClick={handleReview} 
                disabled={isLoading}
                className="bg-primary text-black font-headline font-bold uppercase tracking-wider hover:bg-primary/90 transition-all px-8 w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentStage?.toUpperCase() || "Processing"}...
                  </>
                ) : (
                  "Initiate Cognitive Scan"
                )}
              </Button>
            </div>
          </Card>

          {isReviewing || stages.research || stages.analysis || stages.memory || stages.critique || stages.output ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
              {/* Sequential Progress Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {renderStageCard("Research", Search, "text-blue-400", "border-blue-500/50", "ring-blue-500", stages.research, currentStage === 'research', "Hunting for patterns...")}
                {renderStageCard("Analysis", Brain, "text-emerald-400", "border-emerald-500/50", "ring-emerald-500", stages.analysis, currentStage === 'analysis', "Reasoning logic...")}
                {renderStageCard("Memory", Database, "text-amber-600", "border-amber-700/50", "ring-amber-600", stages.memory, currentStage === 'memory', "Recalling context...")}
                {renderStageCard("Critique", ShieldAlert, "text-red-700", "border-red-900/50", "ring-red-700", stages.critique, currentStage === 'critique', "Stress testing...")}
                {renderStageCard("Output", FileText, "text-green-500", "border-green-500/50", "ring-green-500", stages.output, currentStage === 'output', "Manifesting report...")}
              </div>

              {/* Detailed Final Report (Manifests when output is ready) */}
              {stages.output && (
                <Card className="bg-[#0D0101]/80 border-primary/30 backdrop-blur-xl relative overflow-hidden animate-in zoom-in-95 duration-1000">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                  <CardHeader className="border-b border-primary/10 bg-primary/5 py-4">
                    <CardTitle className="text-primary flex items-center gap-3 text-base font-headline tracking-[0.2em] uppercase font-bold">
                      <Activity className="w-5 h-5 animate-pulse" /> 360° Cognitive Synthesis
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase font-code tracking-widest text-muted-foreground">
                      Final result of the 5-stage sequential architecture scan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="prose prose-invert prose-xs max-w-none font-body leading-relaxed text-foreground/90 whitespace-pre-wrap selection:bg-primary/30">
                      {stages.output}
                    </div>

                    <div className="mt-12 pt-8 border-t border-primary/20">
                      <h4 className="text-primary text-sm font-headline uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Database className="w-4 h-4" /> Cognitive Process Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-blue-400">
                            <Search className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">1. Research</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed font-code">
                            Scanned raw code to identify patterns, libraries, and architectural standards.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Brain className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">2. Analysis</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed font-code">
                            Deconstructed control flow and logic integrity, hunting for structural bugs and redundant operations.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-amber-600">
                            <Database className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">3. Memory</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed font-code">
                            Contextualized logic against idealized historical patterns and high-performance system pitfalls.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-red-500">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">4. Critique</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed font-code">
                            Red-team stress test executing security vulnerability checks, edge-case mapping, and failure simulation.
                          </p>
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <div className="flex items-center gap-2 text-green-500">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">5. Synthesis</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed font-code">
                            Aggregated all prior cognitive layers into this finalized, professional architectural review.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="generate" className="mt-6 space-y-6">
          <Card className="bg-[#0D0101]/60 border-primary/20 backdrop-blur-md overflow-hidden ritual-frame">
            <CardContent className="p-0">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Describe the logic you wish to manifest (e.g., 'A TypeScript function to sort a binary tree by resonance score')..."
                className="min-h-[200px] bg-transparent border-none focus-visible:ring-0 font-code text-sm p-6 resize-none"
              />
            </CardContent>
            <div className="p-4 border-t border-primary/20 bg-primary/5 flex justify-end items-center">
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading}
                className="bg-primary text-black font-headline font-bold uppercase tracking-wider hover:bg-primary/90 transition-all px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Manifesting...
                  </>
                ) : (
                  "Manifest Code"
                )}
              </Button>
            </div>
          </Card>

          {generatedCode && (
            <Card className="bg-[#0D0101]/80 border-primary/30 backdrop-blur-xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
              <CardHeader className="border-b border-primary/10 bg-primary/5 py-3">
                <CardTitle className="text-primary text-[10px] font-headline tracking-widest uppercase flex items-center gap-2">
                  <Code2 className="w-3 h-3" /> Manifested Logic Fragment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="p-6 text-xs font-code leading-relaxed text-foreground overflow-x-auto selection:bg-primary/30">
                  <code>{generatedCode}</code>
                </pre>
              </CardContent>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-[8px] uppercase font-headline tracking-tighter text-primary hover:bg-primary/10"
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  toast({ title: "COPIED", description: "Logic fragment saved to clipboard." });
                }}
              >
                Copy Signal
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderStageCard(
  title: string, 
  Icon: any, 
  textColor: string, 
  borderColor: string, 
  ringColor: string,
  content: string, 
  isActive: boolean, 
  loadingText: string
) {
  return (
    <Card className={cn(
      "bg-[#0D0101]/40 backdrop-blur-sm transition-all duration-500",
      content ? `opacity-100 ${borderColor} border` : "opacity-40 border-primary/10",
      isActive && `ring-1 ring-offset-0 ${ringColor} animate-pulse opacity-100`
    )}>
      <CardHeader className="p-3">
        <CardTitle className={cn(textColor, "text-[10px] font-headline tracking-widest uppercase flex items-center gap-2")}>
          {content && !isActive ? <ShieldCheck className="w-3 h-3 text-green-500" /> : <Icon className="w-3 h-3" />} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-[9px] font-code text-muted-foreground h-16 overflow-hidden text-ellipsis line-clamp-3">
          {content || (isActive ? loadingText : "Waiting...")}
        </div>
      </CardContent>
    </Card>
  );
}
