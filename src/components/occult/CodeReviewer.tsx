"use client";

import { useState } from "react";
import { ShieldAlert, Code2, Zap, Bug, ShieldCheck, ListChecks, Loader2, Search, Brain, Database, FileText, Activity } from "lucide-react";
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
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-headline text-primary uppercase tracking-[0.3em] font-bold">Smart Code Reviewer</h2>
        <p className="text-muted-foreground text-sm font-body">
          Paste your code to initiate a parallel cognitive scan by three specialized AI entities.
        </p>
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
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'research' ? "text-blue-400 animate-pulse" : "text-muted-foreground")}>
                  <Search className="w-3 h-3" /> RESEARCH
                </div>
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'analysis' ? "text-emerald-400 animate-pulse" : "text-muted-foreground")}>
                  <Brain className="w-3 h-3" /> ANALYSIS
                </div>
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'memory' ? "text-amber-600 animate-pulse" : "text-muted-foreground")}>
                  <Database className="w-3 h-3" /> MEMORY
                </div>
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'critique' ? "text-red-700 animate-pulse" : "text-muted-foreground")}>
                  <ShieldAlert className="w-3 h-3" /> CRITIQUE
                </div>
                <div className={cn("flex items-center gap-2 text-[9px] font-code transition-all", currentStage === 'output' ? "text-green-500 animate-pulse" : "text-muted-foreground")}>
                  <FileText className="w-3 h-3" /> OUTPUT
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
                {/* Stage 1: Research */}
                <Card className={cn(
                  "bg-[#0D0101]/40 border-blue-500/20 backdrop-blur-sm transition-all duration-500",
                  stages.research ? "opacity-100 border-blue-500/50" : "opacity-40",
                  currentStage === 'research' && "ring-1 ring-blue-500 animate-pulse opacity-100"
                )}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-blue-400 text-[10px] font-headline tracking-widest uppercase flex items-center gap-2">
                      <Search className="w-3 h-3" /> Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-[9px] font-code text-muted-foreground h-16 overflow-hidden text-ellipsis line-clamp-3">
                      {stages.research || (currentStage === 'research' ? "Hunting for patterns..." : "Waiting...")}
                    </div>
                  </CardContent>
                </Card>

                {/* Stage 2: Analysis */}
                <Card className={cn(
                  "bg-[#0D0101]/40 border-emerald-500/20 backdrop-blur-sm transition-all duration-500",
                  stages.analysis ? "opacity-100 border-emerald-500/50" : "opacity-40",
                  currentStage === 'analysis' && "ring-1 ring-emerald-500 animate-pulse opacity-100"
                )}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-emerald-400 text-[10px] font-headline tracking-widest uppercase flex items-center gap-2">
                      <Brain className="w-3 h-3" /> Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-[9px] font-code text-muted-foreground h-16 overflow-hidden text-ellipsis line-clamp-3">
                      {stages.analysis || (currentStage === 'analysis' ? "Reasoning logic..." : "Waiting...")}
                    </div>
                  </CardContent>
                </Card>

                {/* Stage 3: Memory */}
                <Card className={cn(
                  "bg-[#0D0101]/40 border-amber-700/20 backdrop-blur-sm transition-all duration-500",
                  stages.memory ? "opacity-100 border-amber-700/50" : "opacity-40",
                  currentStage === 'memory' && "ring-1 ring-amber-600 animate-pulse opacity-100"
                )}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-amber-600 text-[10px] font-headline tracking-widest uppercase flex items-center gap-2">
                      <Database className="w-3 h-3" /> Memory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-[9px] font-code text-muted-foreground h-16 overflow-hidden text-ellipsis line-clamp-3">
                      {stages.memory || (currentStage === 'memory' ? "Recalling context..." : "Waiting...")}
                    </div>
                  </CardContent>
                </Card>

                {/* Stage 4: Critique */}
                <Card className={cn(
                  "bg-[#0D0101]/40 border-red-900/20 backdrop-blur-sm transition-all duration-500",
                  stages.critique ? "opacity-100 border-red-800/50" : "opacity-40",
                  currentStage === 'critique' && "ring-1 ring-red-700 animate-pulse opacity-100"
                )}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-red-700 text-[10px] font-headline tracking-widest uppercase flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3" /> Critique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-[9px] font-code text-muted-foreground h-16 overflow-hidden text-ellipsis line-clamp-3">
                      {stages.critique || (currentStage === 'critique' ? "Stress testing..." : "Waiting...")}
                    </div>
                  </CardContent>
                </Card>

                {/* Stage 5: Output */}
                <Card className={cn(
                  "bg-[#0D0101]/40 border-green-500/20 backdrop-blur-sm transition-all duration-500",
                  stages.output ? "opacity-100 border-green-500/50" : "opacity-40",
                  currentStage === 'output' && "ring-1 ring-green-500 animate-pulse opacity-100"
                )}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-green-500 text-[10px] font-headline tracking-widest uppercase flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Output
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-[9px] font-code text-muted-foreground h-16 overflow-hidden text-ellipsis line-clamp-3">
                      {stages.output || (currentStage === 'output' ? "Manifesting report..." : "Waiting...")}
                    </div>
                  </CardContent>
                </Card>
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
