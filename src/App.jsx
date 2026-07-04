import React, { useEffect, useRef, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
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

  // 2. Refs
  const containerRef = useRef(null);
  const textWrapperRef = useRef(null);
  const maskWrapperRef = useRef(null);
  const marbleRef = useRef(null);

  // 3. GSAP Scroll Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const marble = marbleRef.current;
      const textWrapper = textWrapperRef.current;
      const maskWrapper = maskWrapperRef.current;

      if (!marble || !textWrapper || !maskWrapper) return;

      // Master Timeline pinned to the scroll position
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2500", // Takes 8-10 slow scrolls to complete the movement
          pin: true,
          scrub: 2,      // Strict tracking to the user scroll wheel
          invalidateOnRefresh: true,
        },
      });

      // Initial state configuration
      gsap.set(marble, {
        opacity: 0,
        xPercent: -50,
        yPercent: -50,
        x: "50vw",
        y: "100vh",
      });

      gsap.set(maskWrapper, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(textWrapper, { x: "20vw" }); // Text starts shifted right for Apple movement

      // Dynamic calculation helper for perfect alignment boundaries
      const getPositions = () => {
        const textRect = textWrapper.getBoundingClientRect();
        const marbleRect = marble.getBoundingClientRect();

        return {
          // X-position to sit perfectly left of 'E' at its initial right-shifted position
          startX: textRect.left + marbleRect.width / 2,
        };
      };

      // --- THE 3 SCROLL PHASES ---

      // PHASE 1: 0% - 40% -> Marble drops down, spins, and fades in completely
      tl.to(marble, {
        opacity: 1,
        y: "115vh",
        rotation: 720,
        ease: "none",
        duration: 0.4,
      })

      // PHASE 2: 40% - 60% -> Marble moves up to center screen, framing perfectly next to 'E'
      .to(marble, {
        y: "50vh",
        x: () => getPositions().startX,
        rotation: 1080,
        ease: "none",
        duration: 0.2,
      })

      // PHASE 3: 60% - 100% -> The text slides elegantly from Right to Left, 
      // while the mask expands and the marble tracks over the moving letters.
      .to(maskWrapper, {
        clipPath: "inset(0 0% 0 0)",
        ease: "none",
        duration: 0.4,
      }, "revealAndSlide")
      .to(textWrapper, {
        x: "-15vw", // Smooth elegant slide leftwards
        ease: "none",
        duration: 0.4,
      }, "revealAndSlide")
      .to(marble, {
        x: "75vw",  // Marble travels across the screen tracking the reveal
        rotation: 1800,
        ease: "none",
        duration: 0.4,
      }, "revealAndSlide");

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  // Handle window resize
  useLayoutEffect(() => {
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white relative text-black antialiased">
      
      {/* SECTION 1: HERO (About Me) */}
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

      {/* SECTION 2: THE REVEAL & MARBLE PARALLAX SECTION */}
      <section
        ref={containerRef}
        className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden select-none"
      >
        <div className="w-full flex items-center justify-start overflow-visible">
          
          {/* Mask Wrapper controlling clip-path reveal */}
          <div
            ref={maskWrapperRef}
            className="w-full flex items-center will-change-[clip-path]"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            {/* The Text Node moving right to left */}
            <h1
              ref={textWrapperRef}
              className="font-black tracking-tighter leading-[0.85] uppercase text-black whitespace-nowrap will-change-transform"
              style={{ fontSize: "min(35vw, 85vh)" }}
            >
              Ewon William
            </h1>
          </div>
          
        </div>

        {/* The 3D Floating Marble Element */}
        <img
          ref={marbleRef}
          src="/assets/marble.png"
          alt="3D Floating Marble"
          className="fixed top-0 left-0 w-[12vh] h-[12vh] object-contain pointer-events-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)] will-change-transform z-50"
        />
      </section>

      {/* SECTION 3: NEXT PAGE PLACEHOLDER */}
      <section className="w-full h-screen bg-gray-100 text-black flex items-center justify-center">
        <h2 className="text-3xl font-light tracking-widest uppercase">Portfolio Content</h2>
      </section>

    </div>
  );
}