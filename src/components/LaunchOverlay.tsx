"use client";

import { useEffect, useState } from "react";

export default function LaunchOverlay() {
  const [mounted, setMounted] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasLaunched = sessionStorage.getItem("connplex_launched");
    if (!hasLaunched) {
      setVisible(true);
    }
  }, []);

  const playLaunchSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Play a grand theatrical C major add 9 chord
      const freqs = [130.81, 196.00, 261.63, 329.63, 392.00, 587.33]; // C3, G3, C4, E4, G4, D5

      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Alternate waveforms for richer timbre
        osc.type = index % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now);

        // Add a gentle vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 4.5 + index * 0.5;
        lfoGain.gain.value = 1.5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);

        // Gain envelope: soft attack, long release
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.15 + index * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        // Lowpass sweep to mimic theatrical acoustics
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + 2.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.0);
      });
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const handleCut = () => {
    if (isCut) return;
    setIsCut(true);
    playLaunchSound();
    sessionStorage.setItem("connplex_launched", "true");

    // Remove the overlay from DOM after animations complete (2 seconds)
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        overflow: "hidden",
        display: "flex",
        userSelect: "none",
        pointerEvents: isCut ? "none" : "auto",
        transition: "opacity 0.8s ease-in-out",
        opacity: isCut ? 0.99 : 1,
      }}
    >
      {/* Left Curtain */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "50%",
          background: "radial-gradient(circle at center left, #9c1010 0%, #3a0000 100%)",
          transform: isCut ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 1.8s cubic-bezier(0.77, 0, 0.175, 1)",
          boxShadow: "10px 0 30px rgba(0,0,0,0.6)",
          zIndex: 10,
        }}
      >
        {/* Curtain pleat overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.45) 0px, rgba(0, 0, 0, 0.15) 30px, rgba(255, 255, 255, 0.08) 60px, rgba(0, 0, 0, 0.25) 90px, rgba(0, 0, 0, 0.45) 120px)",
            opacity: 0.8,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Right Curtain */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "50%",
          background: "radial-gradient(circle at center right, #9c1010 0%, #3a0000 100%)",
          transform: isCut ? "translateX(100%)" : "translateX(0)",
          transition: "transform 1.8s cubic-bezier(0.77, 0, 0.175, 1)",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.6)",
          zIndex: 10,
        }}
      >
        {/* Curtain pleat overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.45) 0px, rgba(0, 0, 0, 0.15) 30px, rgba(255, 255, 255, 0.08) 60px, rgba(0, 0, 0, 0.25) 90px, rgba(0, 0, 0, 0.45) 120px)",
            opacity: 0.8,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Left Ribbon */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          height: "18px",
          width: "50%",
          background: "linear-gradient(180deg, #ffd700 0%, #d4af37 40%, #b8860b 100%)",
          transform: isCut ? "rotate(25deg) translateY(120px) translateX(-50px)" : "translateY(-50%)",
          transformOrigin: "left center",
          opacity: isCut ? 0 : 1,
          transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease-out",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          zIndex: 20,
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderTop: "1px solid rgba(255,255,255,0.25)", borderBottom: "1px solid rgba(255,255,255,0.25)" }} />
      </div>

      {/* Right Ribbon */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          height: "18px",
          width: "50%",
          background: "linear-gradient(180deg, #ffd700 0%, #d4af37 40%, #b8860b 100%)",
          transform: isCut ? "rotate(-25deg) translateY(120px) translateX(50px)" : "translateY(-50%)",
          transformOrigin: "right center",
          opacity: isCut ? 0 : 1,
          transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease-out",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          zIndex: 20,
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderTop: "1px solid rgba(255,255,255,0.25)", borderBottom: "1px solid rgba(255,255,255,0.25)" }} />
      </div>

      {/* Ribbon Knot / Center Interactive Seal */}
      <div
        onClick={handleCut}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: isCut ? "translate(-50%, -50%) scale(0)" : "translate(-50%, -50%) scale(1)",
          opacity: isCut ? 0 : 1,
          transition: "transform 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97), opacity 0.5s ease-out",
          zIndex: 30,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2rem",
        }}
      >
        {/* Glow behind */}
        <div
          style={{
            position: "absolute",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.45) 0%, transparent 70%)",
            animation: "pulseGlow 2s infinite ease-in-out",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* Large golden circular button */}
        <div
          className="group"
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffe66d 0%, #d4af37 60%, #996515 100%)",
            border: "4px solid #fff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(212,175,55,0.5), inset 0 2px 5px rgba(255,255,255,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.6)";
          }}
        >
          {/* Scissors Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              width: "42px",
              height: "42px",
              transform: "rotate(-45deg)",
              filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))",
            }}
          >
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
        </div>

        {/* Text Ribbon */}
        <div
          style={{
            background: "rgba(0,0,0,0.85)",
            border: "1.5px solid #d4af37",
            borderRadius: "4px",
            padding: "0.5rem 1.25rem",
            color: "#ffd700",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          Click to Cut Ribbon & Enter
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulseGlow {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.9; }
          100% { transform: scale(0.9); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
