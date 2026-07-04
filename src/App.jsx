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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !textRef.current) return;

      const textProgress = { charCount: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3500",
          pin: true,
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });

      tl.to(textProgress, {
        charCount: 12.5,
        ease: `steps(13)`,
        duration: 1,
        onUpdate: () => {
          let index = Math.min(12, Math.round(textProgress.charCount));
          setTypedText(fullName.substring(0, index));
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white relative text-black antialiased overflow-x-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="h-screen flex flex-col justify-center items-center bg-gray-50 text-black relative overflow-hidden">
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

      {/* SECTION 2: PERFECTLY CENTERED TYPEWRITER */}
      <section
        ref={containerRef}
        className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden select-none"
      >
        {/* 
           Using justify-center explicitly.
           This guarantees the text grows strictly from the center of the screen.
           The 'm' will land perfectly on the right side of the screen, never cut off.
        */}
        <div className="flex items-center justify-center w-full h-full px-4">
          <h1
            ref={textRef}
            className="font-black tracking-tighter leading-[0.9] text-black inline-block text-center whitespace-nowrap will-change-transform"
            // Reduced to 40vh. Big, cinematic, but guarantees 100% of the name fits.
            style={{ fontSize: "min(20vw, 40vh)" }} 
          >
            {typedText}
            <div className="inline-block ml-2 min-w-[4px] h-[0.75em] bg-black animate-pulse align-middle"></div>
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