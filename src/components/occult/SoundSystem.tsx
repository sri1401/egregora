"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type SoundType = "glitch" | "zap" | "hum" | "static";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSfx: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const sfxRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    glitch: null,
    zap: null,
    hum: null,
    static: null,
  });

  useEffect(() => {
    // Initialize Ambient
    ambientRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3");
    ambientRef.current.loop = true;
    ambientRef.current.volume = 0.15;

    // Initialize SFX
    sfxRefs.current.glitch = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    sfxRefs.current.zap = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
    sfxRefs.current.hum = new Audio("https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3");
    sfxRefs.current.static = new Audio("https://assets.mixkit.co/active_storage/sfx/2557/2557-preview.mp3");

    // Set volumes
    Object.values(sfxRefs.current).forEach(audio => {
      if (audio) audio.volume = 0.4;
    });

    return () => {
      ambientRef.current?.pause();
      Object.values(sfxRefs.current).forEach(audio => audio?.pause());
    };
  }, []);

  useEffect(() => {
    if (!ambientRef.current) return;
    
    if (isMuted || !hasInteracted) {
      ambientRef.current.pause();
    } else {
      ambientRef.current.play().catch(e => console.warn("Audio play blocked:", e));
    }
  }, [isMuted, hasInteracted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (!hasInteracted) setHasInteracted(true);
  };

  const playSfx = (type: SoundType) => {
    if (isMuted || !hasInteracted) return;
    const audio = sfxRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn("SFX play blocked:", e));
    }
  };

  // Handle first interaction to enable audio
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("click", handleFirstInteraction);
    };
    window.addEventListener("click", handleFirstInteraction);
    return () => window.removeEventListener("click", handleFirstInteraction);
  }, []);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSfx }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within SoundProvider");
  return context;
};
