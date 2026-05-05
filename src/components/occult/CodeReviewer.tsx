"use client";

import { useState } from "react";
import { ShieldAlert, Code2, Zap, Bug, ShieldCheck, ListChecks, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { reviewCode } from "@/ai/flows/code-review-flow";
import { generateCode } from "@/ai/flows/code-generation-flow";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CodeReviewer() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    logicReview: string;
    securityReview: string;
    suggestions: string;
  } | null>(null);
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
    try {
      const review = await reviewCode(code);
      setResults(review);
      toast({
        title: "SCAN COMPLETE",
        description: "The 360° cognitive review is ready.",
      });
    } catch (error) {
      toast({
        title: "SCAN FAILED",
        description: "The entities were unable to reach a consensus.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
                placeholder="// Paste your code here for review..."
                className="min-h-[300px] bg-transparent border-none focus-visible:ring-0 font-code text-sm p-6 resize-none"
              />
            </CardContent>
            <div className="p-4 border-t border-primary/20 bg-primary/5 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-code text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> CLAUDE: LOGIC
                </div>
                <div className="flex items-center gap-2 text-[10px] font-code text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> GPT-4: SECURITY
                </div>
                <div className="flex items-center gap-2 text-[10px] font-code text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> GROQ: SPEED
                </div>
              </div>
              <Button 
                onClick={handleReview} 
                disabled={isLoading}
                className="bg-primary text-black font-headline font-bold uppercase tracking-wider hover:bg-primary/90 transition-all px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Initiate Review"
                )}
              </Button>
            </div>
          </Card>

          {results && (
            <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-8 duration-700">
              {/* Logic Review - Warning/Amber */}
              <Card className="bg-[#0D0101]/60 border-amber-500/30 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-500 flex items-center gap-2 text-sm font-headline tracking-widest uppercase">
                    <Bug className="w-4 h-4" /> Logic & Arch
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-code">Claude's Analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-body leading-relaxed text-foreground/80 whitespace-pre-wrap">
                    {results.logicReview}
                  </div>
                </CardContent>
              </Card>

              {/* Security Review - Critical/Red */}
              <Card className="bg-[#0D0101]/60 border-destructive/30 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-destructive/50" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-destructive flex items-center gap-2 text-sm font-headline tracking-widest uppercase">
                    <ShieldCheck className="w-4 h-4" /> Security Scan
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-code">GPT-4's Analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-body leading-relaxed text-foreground/80 whitespace-pre-wrap">
                    {results.securityReview}
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions - Info/Green */}
              <Card className="bg-[#0D0101]/60 border-emerald-500/30 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-emerald-500 flex items-center gap-2 text-sm font-headline tracking-widest uppercase">
                    <ListChecks className="w-4 h-4" /> Quick Wins
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-code">Groq's Suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-body leading-relaxed text-foreground/80 whitespace-pre-wrap">
                    {results.suggestions}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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
