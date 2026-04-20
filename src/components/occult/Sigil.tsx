import { cn } from "@/lib/utils";

export function Sigil({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("w-full h-full animate-flicker fill-none stroke-primary stroke-[0.5]", className)}
    >
      <circle cx="50" cy="50" r="45" />
      <path d="M50 5 L50 95 M5 50 L95 50" />
      <path d="M20 20 L80 80 M80 20 L20 80" />
      <circle cx="50" cy="50" r="10" />
      <path d="M35 35 Q50 20 65 35 Q80 50 65 65 Q50 80 35 65 Q20 50 35 35" />
    </svg>
  );
}
