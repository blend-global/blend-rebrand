"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

export default function Hero() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);

  const showControlsTemporarily = () => {
    setControlsVisible(true);

    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }

    hideControlsTimeout.current = setTimeout(() => {
      setControlsVisible(false);
    }, 1800);
  };

  useEffect(() => {
    hideControlsTimeout.current = setTimeout(() => {
      setControlsVisible(false);
    }, 1800);

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  const sendVideoCommand = (command: "playVideo" | "pauseVideo") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args: [],
      }),
      "https://www.youtube.com",
    );
  };

  const togglePlayback = () => {
    const nextPlaying = !isPlaying;

    sendVideoCommand(nextPlaying ? "playVideo" : "pauseVideo");
    setIsPlaying(nextPlaying);
    showControlsTemporarily();
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden bg-black"
      onPointerMove={showControlsTemporarily}
      onPointerDown={showControlsTemporarily}
    >
      <iframe
        ref={iframeRef}
        src="https://www.youtube.com/embed/1ZYbU82GVz4?autoplay=1&mute=1&loop=1&playlist=1ZYbU82GVz4&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1"
        title="Blend showreel"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.777777vh] min-w-full -translate-x-1/2 -translate-y-1/2"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      <div className="pointer-events-none absolute inset-0 bg-black/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/70" />

      <div className="pointer-events-none container-max relative z-10 flex min-h-[100svh] items-center justify-center text-center text-white">
        <Reveal>
          <h1 className="text-[2.35rem] font-bold leading-tight text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:text-[3.25rem] lg:text-[4.5rem]">
            Empowering Connections<br />
            <span className="bg-gradient-to-r from-green-300 via-[#78d1ff] to-pink-400 bg-clip-text text-transparent">
              Globally
            </span>
          </h1>
        </Reveal>
      </div>

      <button
        type="button"
        aria-label={isPlaying ? "Pause hero video" : "Play hero video"}
        className={`absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-[0_12px_34px_rgba(0,0,0,0.35)] ring-1 ring-white/20 backdrop-blur transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={togglePlayback}
        onFocus={showControlsTemporarily}
      >
        {isPlaying ? <Pause className="h-7 w-7" fill="currentColor" /> : <Play className="h-7 w-7" fill="currentColor" />}
      </button>
    </section>
  );
}
