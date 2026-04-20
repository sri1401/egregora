"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PREDEFINED_SPECIALIZATIONS, Agent } from "@/lib/types";
import { userCustomAgentSpecialization } from "@/ai/flows/user-custom-agent-specialization";
import { useToast } from "@/hooks/use-toast";
import { Flame, Skull } from "lucide-react";

export function AgentCreator({ onAgentCreated }: { onAgentCreated: (agent: Agent) => void }) {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState<string>(PREDEFINED_SPECIALIZATIONS[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isRitualizing, setIsRitualizing] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name) return;
    setIsRitualizing(true);
    
    try {
      const result = await userCustomAgentSpecialization({
        customSystemPrompt: customPrompt || `You are a specialized agent focusing on ${specialization}.`
      });

      const newAgent: Agent = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        specialization,
        jobTitle: "Rookie Shade",
        workplace: "The Threshold",
        age: Math.floor(Math.random() * 500) + 1,
        gender: ["Male", "Female", "Non-binary", "Post-biological"][Math.floor(Math.random() * 4)],
        bio: "A newly manifested entity in the Egregora network.",
        systemPrompt: result.configuredPrompt,
        emotionalVector: {
          desire: Math.random(),
          ego: Math.random(),
          skepticism: Math.random(),
          aggression: Math.random(),
          fear: Math.random()
        },
        avatarUrl: `https://picsum.photos/seed/${name}/200/200`,
        status: 'active'
      };

      onAgentCreated(newAgent);
      setName("");
      setCustomPrompt("");
      toast({
        title: "MANIFESTATION COMPLETE",
        description: result.confirmationMessage,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "RITUAL FAILED",
        description: "The abyss refused to yield.",
      });
    } finally {
      setIsRitualizing(false);
    }
  };

  return (
    <div className="ritual-frame p-6 bg-black space-y-6">
      <div className="flex items-center gap-3">
        <Skull className="w-5 h-5 text-primary" />
        <h3 className="font-headline text-primary text-sm tracking-widest uppercase">Invoke Entity</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-code text-muted-foreground ml-1">Nomenclature</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Name your shade..." 
            className="bg-black/50 border-primary/30 focus:border-primary transition-all rounded-none font-body text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-code text-muted-foreground ml-1">Specialization Hex</label>
          <Select value={specialization} onValueChange={setSpecialization}>
            <SelectTrigger className="bg-black/50 border-primary/30 rounded-none font-body text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-primary">
              {PREDEFINED_SPECIALIZATIONS.map(spec => (
                <SelectItem key={spec} value={spec} className="focus:bg-primary/20">{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-code text-muted-foreground ml-1">Core Nature</label>
          <Textarea 
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Define the entity's core nature..."
            className="bg-black/50 border-primary/30 focus:border-primary rounded-none font-body text-sm h-24"
          />
        </div>

        <Button 
          onClick={handleCreate} 
          disabled={isRitualizing}
          className="w-full bg-primary hover:bg-destructive text-white rounded-none border-t border-destructive/50 font-headline uppercase text-xs tracking-[0.3em] h-12"
        >
          {isRitualizing ? (
            <span className="animate-pulse flex items-center gap-2">
              <Flame className="w-4 h-4 animate-spin" /> Ritualizing...
            </span>
          ) : "Manifest Entity"}
        </Button>
      </div>
    </div>
  );
}
