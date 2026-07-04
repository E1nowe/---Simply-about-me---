import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [typedText, setTypedText] = useState("");
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const fullName = "EWON WILLIAM";

  // 1. Lenis Smooth Scrolling setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 2. GSAP True Character-Extraction Typewriter & Auto-Shift
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // An object to hold our proxy scroll position
      const textProgress = { charCount: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3500", 
          pin: true,
          scrub: 1, // Snaps hard to your physical wheel rotations
          invalidateOnRefresh: true,
        },
      });

      // Pure step-driven typing that updates React state explicitly
      tl.to(textProgress, {
        charCount: fullName.length,
        ease: `steps(${fullName.length})`,
        duration: 0.8,
        onUpdate: () => {
          const index = Math.floor(textProgress.charCount);
          setTypedText(fullName.substring(0, index));
        }
      })
      // Phase 2: If the text gets overly long, smoothly guide it slightly left 
      // so it balances beautifully on smaller desktop monitors
      .to(textRef.current, {
        x: () => {
          // Dynamic safety fallback: if text width exceeds screen size, shift it left
          if (textRef.current && textRef.current.offsetWidth > window.innerWidth * 0.8) {
            return "-18vw";
          }
          return "0vw";
        },
        ease: "none",
        duration: 0.2,
      }, "-=0.2"); // Overlap slightly with the end of typing

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white relative text-black antialiased">
      
      {/* SECTION 1: HERO */}
      <section className="h-screen flex flex-col justify-center items-center bg-gray-50 text-black relative">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-center">
          About me
        </h1>
        <div className="absolute bottom-12 w-[65pt] h-[65pt] rounded-full overflow-hidden bg-white border-[2px] border-black/10 flex items-center justify-center">
          <img 
            src="/assets/face.png" 
            alt="Smiling Face" 
            className="w-[80%] h-[80%] object-contain" 
          />
        </div>
      </section>

      {/* SECTION 2: GIANT TYPEWRITER SLIDE */}
      <section
        ref={containerRef}
        className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden select-none"
      >
        <div className="flex items-center justify-center w-full overflow-visible px-6">
          
          <h1
            ref={textRef}
            className="font-black tracking-tighter leading-[0.85] text-black uppercase will-change-transform inline-flex items-center justify-center whitespace-nowrap min-h-[40vh]"
            style={{ fontSize: "min(24vw, 75vh)" }} // Optimized sizing for perfect centering without cutting
          >
            {/* Render only the typed string segment */}
            {typedText}
            
            {/* Apple Terminal Cursor */}
            <span className="inline-block ml-2 w-[0.03em] h-[0.75em] bg-black animate-pulse self-center"></span>
          </h1>
          
        </div>
      </section>

      {/* SECTION 3: NEXT PAGE */}
      <section className="w-full h-screen bg-gray-100 text-black flex items-center justify-center">
        <h2 className="text-3xl font-light tracking-widest uppercase">Portfolio Content</h2>
      </section>

    </div>
  );
}