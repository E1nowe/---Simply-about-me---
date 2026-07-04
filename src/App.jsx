import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [typedText, setTypedText] = useState("");
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const fullName = "Ewon William";

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

  // 2. GSAP Dynamic Typewriter & Sliding Track Matrix
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !textRef.current) return;

      const textProgress = { charCount: 0 };

      // Initialize the text starting slightly offset right to comfortably frame "Ewon"
      gsap.set(textRef.current, { x: "20vw" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=5000", // Increased scroll track runway to guarantee space for the letters to unpack
          pin: true,
          scrub: 1.5,    // Crisp, immediate tracking to the scroll wheel
          invalidateOnRefresh: true,
        },
      });

      // Synchronize the typing count with a leftward layout pull
      tl.to(textProgress, {
        charCount: fullName.length,
        ease: `steps(${fullName.length})`,
        duration: 1,
        onUpdate: () => {
          const index = Math.floor(textProgress.charCount);
          setTypedText(fullName.substring(0, index + 1));
        }
      }, "sync")
      .to(textRef.current, {
        x: "-25vw", // Smoothly pulls the text leftward, bringing "am" safely onto the screen
        ease: "none",
        duration: 1,
      }, "sync");

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

      {/* SECTION 2: MASSIVE TYPEWRITER - SLIDING SYSTEM */}
      <section
        ref={containerRef}
        className="relative w-full h-screen flex items-center justify-start bg-white overflow-hidden select-none"
      >
        {/* Changed justify-center to justify-start to enable clean right-to-left overflow scrolling */}
        <div className="flex items-center justify-start w-full h-full pl-[10vw] overflow-visible">
          
          <h1
            ref={textRef}
            className="font-black tracking-tighter leading-[0.85] text-black uppercase will-change-transform inline-flex items-center whitespace-nowrap"
            style={{ fontSize: "min(35vw, 85vh)" }} 
          >
            <span>{typedText}</span>
            
            {/* Apple Terminal Cursor */}
            <div className="inline-block ml-3 w-[0.03em] h-[0.75em] bg-black animate-pulse self-center"></div>
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