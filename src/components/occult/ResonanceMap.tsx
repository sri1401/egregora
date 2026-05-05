"use client";

import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { Agent, Post } from "@/lib/types";
import { projectTo2D, calculateCentroid } from "@/lib/vector-utils";
import { Skull, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResonanceMapProps {
  agents: Agent[];
  posts: Post[];
  className?: string;
}

export function ResonanceMap({ agents, posts, className }: ResonanceMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Combine all items with embeddings
  const allItems = useMemo(() => {
    const validAgents = agents.filter(a => !!a.embedding);
    const validPosts = posts.filter(p => !!p.embedding).slice(0, 50); // Show last 50 posts
    
    const embeddings = [
      ...validAgents.map(a => a.embedding!),
      ...validPosts.map(p => p.embedding!)
    ];

    if (embeddings.length === 0) return [];

    const projected = projectTo2D(embeddings);
    
    return [
      ...validAgents.map((a, i) => ({ ...a, ...projected[i], type: 'agent' as const })),
      ...validPosts.map((p, i) => ({ ...p, ...projected[validAgents.length + i], type: 'post' as const }))
    ];
  }, [agents, posts]);

  const centroid = useMemo(() => calculateCentroid(allItems), [allItems]);

  useEffect(() => {
    if (!svgRef.current || allItems.length === 0) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Create scales
    const padding = 50;
    const xScale = d3.scaleLinear()
      .domain([d3.min(allItems, d => d.x)! - 0.1, d3.max(allItems, d => d.x)! + 0.1])
      .range([padding, width - padding]);
      
    const yScale = d3.scaleLinear()
      .domain([d3.min(allItems, d => d.y)! - 0.1, d3.max(allItems, d => d.y)! + 0.1])
      .range([height - padding, padding]);

    // Create Container
    const container = svg.append("g");

    // Add Nebula Background
    const nebula = container.append("g").attr("class", "nebula");
    nebula.append("circle")
      .attr("cx", xScale(centroid.x))
      .attr("cy", yScale(centroid.y))
      .attr("r", 200)
      .attr("fill", "url(#nebula-gradient)")
      .attr("opacity", 0.3)
      .attr("class", "animate-pulse");

    // Add Gradients
    const defs = svg.append("defs");
    const grad = defs.append("radialGradient")
      .attr("id", "nebula-gradient");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "hsl(var(--primary))").attr("stop-opacity", 0.6);
    grad.append("stop").attr("offset", "100%").attr("stop-color", "transparent").attr("stop-opacity", 0);

    // Draw Connections (Posts to Agents)
    container.selectAll(".connection")
      .data(allItems.filter(d => d.type === 'post'))
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.x))
      .attr("y1", d => yScale(d.y))
      .attr("x2", d => {
        const agent = allItems.find(a => a.id === (d as any).agentId);
        return agent ? xScale(agent.x) : xScale(d.x);
      })
      .attr("y2", d => {
        const agent = allItems.find(a => a.id === (d as any).agentId);
        return agent ? yScale(agent.y) : yScale(d.y);
      })
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.15)
      .attr("stroke-dasharray", "2,2");

    // Draw Posts (Sparks)
    container.selectAll(".post")
      .data(allItems.filter(d => d.type === 'post'))
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 2)
      .attr("fill", "hsl(var(--secondary))")
      .attr("opacity", 0.6)
      .attr("class", "cursor-pointer hover:r-4 transition-all")
      .append("title")
      .text(d => (d as any).content);

    // Draw Agents (Stars)
    const agentNodes = container.selectAll(".agent")
      .data(allItems.filter(d => d.type === 'agent'))
      .enter()
      .append("g")
      .attr("class", "agent-node cursor-pointer");

    agentNodes.append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 12)
      .attr("fill", "black")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2);

    agentNodes.append("text")
      .attr("x", d => xScale(d.x))
      .attr("y", d => yScale(d.y) - 20)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(var(--primary))")
      .attr("font-size", "10px")
      .attr("font-family", "Space Grotesk")
      .attr("font-weight", "bold")
      .text(d => (d as any).name);

    // Add Centroid Marker (The Core)
    container.append("path")
      .attr("d", d3.symbol().type(d3.symbolCross).size(100)())
      .attr("transform", `translate(${xScale(centroid.x)}, ${yScale(centroid.y)})`)
      .attr("fill", "white")
      .attr("class", "animate-spin-slow");

  }, [allItems, centroid]);

  return (
    <div className={cn("ritual-frame bg-black/80 border-primary/20 overflow-hidden relative", className)}>
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <Activity className="w-4 h-4" />
          <h3 className="text-xs font-headline uppercase tracking-widest font-bold">Resonance Analysis</h3>
        </div>
        <span className="text-[9px] text-muted-foreground font-code uppercase">Semantic Vector Projection (PCA)</span>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 text-right">
        <div className="text-[9px] text-primary/40 font-code uppercase mb-1">COLLECTIVE CENTROID</div>
        <div className="text-[10px] text-primary font-mono">
          X: {centroid.x.toFixed(4)} | Y: {centroid.y.toFixed(4)}
        </div>
      </div>

      {allItems.length === 0 ? (
        <div className="w-full h-[600px] flex items-center justify-center">
          <div className="text-center animate-pulse">
            <Skull className="w-8 h-8 text-primary/20 mx-auto mb-4" />
            <p className="text-[10px] font-code text-muted-foreground uppercase tracking-widest">Awaiting Semantic Data...</p>
          </div>
        </div>
      ) : (
        <svg 
          ref={svgRef} 
          viewBox="0 0 800 600" 
          className="w-full h-full filter drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]"
        />
      )}
    </div>
  );
}
