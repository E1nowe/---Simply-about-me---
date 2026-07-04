import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // --- STATES & DATA ---
  const [activeTab, setActiveTab] = useState('university');
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);

  // --- REFS ---
  const nameTextRef = useRef(null);
  const nameSectionRef = useRef(null);
  const workSectionRef = useRef(null);
  const workCardsContainerRef = useRef(null);
  const clickAudioRef = useRef(null);
  const lastPlayedIndex = useRef(-1);

  const fullName = "Ewon William";

  // Work Experience Data
  const workData = [
    {
      role: "AI Engineer Intern",
      company: "Falcon Tag",
      date: "May 2025 - Aug 2025",
      details: [
        "Designed and deployed an AI-powered predictive maintenance system for pharmaceutical shipments, achieving 92% accuracy in early fault detection.",
        "Collected, cleaned, and preprocessed large-scale IoT datasets to ensure data quality and model reliability.",
        "Built and trained predictive models in Python (TensorFlow), improving equipment risk detection and operational reliability.",
        "Integrated predictive analytics into real-time dashboards, estimated reducing shipment delays by 28% and minimizing product loss by 15%.",
        "Collaborated with technical and operations teams to ensure solutions aligned with industry regulations and compliance standards."
      ]
    },
    {
      role: "Web Officer",
      company: "Brunel University - Catholic Society",
      date: "Aug 2025 - Present",
      details: [
        "Manage the society's digital presence across website and social media platforms, ensuring content is clear, engaging, and accessible.",
        "Design and publish event updates, initiatives, and educational material on the Catholic faith, making information visually appealing and easy to understand.",
        "Support the society's mission by strengthening online engagement and lift community awareness."
      ]
    },
    {
      role: "Tech Innovation Participant",
      company: "Vodafone Innovators Program",
      date: "2023",
      details: [
        "Contributed to IoT product development, analysing market needs and pricing strategies.",
        "Participated in a product launch simulation, learning end-to-end go-to-market processes.",
        "Gained exposure to corporate R&D workflows and emerging tech trends.",
        "Applied the Critical Path Method to optimize project timelines."
      ]
    }
  ];

  // Education Data
  const educationData = {
    university: {
      title: "BSc (Hons) Computer Science (AI)",
      date: "Sep 2024 - Jun 2028",
      school: "Brunel University of London",
      details: (
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold text-lg mb-1">Year 1 Modules:</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
              <li>CS1814 - Software Implementation</li>
              <li>CS1604 - Programming Applications</li>
              <li>CS1812 - Professional Reflection / Group Project</li>
              <li>CS1813 - Software Design</li>
              <li>CS1602 - Logic and Computation</li>
              <li>CS1603 - Introductory Programming</li>
              <li>CS1601 - Information Systems and Organisations</li>
              <li>CS1605 - Data and Information</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-1">Year 2 Modules:</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
              <li>Level 5 Group Project</li>
              <li>CS2601 - Software Development and Management</li>
              <li>Usability Engineering</li>
              <li>CS2604 - Algorithms and their Applications</li>
              <li>Networks and Operating Systems</li>
              <li>CS2603 - Fundamentals of Algorithms</li>
            </ul>
          </div>
        </div>
      )
    },
    college: {
      title: "A-Levels",
      date: "Sept 2022 - July 2024",
      school: "Sir George Monoux College",
      details: "Computer Science (A), Business Studies (B), Biology (C)."
    },
    school: {
      title: "8 GCSEs",
      date: "Sept 2018 - July 2022",
      school: "The Cumberland Community School",
      details: "Including Combined Science (A, A), Mathematics (B), Computer Science (B)."
    }
  };

  // --- 1. LENIS SMOOTH SCROLL ---
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

  // --- 2. GSAP TYPEWRITER (DIRECT DOM ANIMATION) ---
  useLayoutEffect(() => {
    if (!nameSectionRef.current || !nameTextRef.current) return;

    const ctx = gsap.context(() => {
      const textProgress = { charCount: 0 };

      gsap.to(textProgress, {
        charCount: fullName.length,
        ease: `steps(${fullName.length})`,
        scrollTrigger: {
          trigger: nameSectionRef.current,
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 1,
        },
        onUpdate: () => {
          const index = Math.ceil(textProgress.charCount);
          if (nameTextRef.current) {
            nameTextRef.current.textContent = fullName.substring(0, index);
          }
        }
      });
    }, nameSectionRef);

    return () => ctx.revert();
  }, []);

  // --- 3. GSAP PINNING & SLIDES FOR WORK EXPERIENCE ---
  useLayoutEffect(() => {
    if (!workSectionRef.current || !workCardsContainerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = workCardsContainerRef.current.children;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: workSectionRef.current,
          start: "top top",
          end: `+=${workData.length * 100}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(
              workData.length - 1,
              Math.floor(progress * workData.length)
            );
            
            setActiveWorkIndex(index);

            if (clickAudioRef.current && lastPlayedIndex.current !== index) {
              const audio = clickAudioRef.current;
              audio.currentTime = 0;
              audio.play().catch(() => {});
              lastPlayedIndex.current = index;
            }
          }
        }
      });

      for (let i = 1; i < cards.length; i++) {
        tl.to(cards[i], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power1.inOut"
        }, i - 0.5);
      }
    }, workSectionRef);

    return () => ctx.revert();
  }, [workData.length]);

  // --- 4. GSAP APPLE TRANSITION FOR EDUCATION ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const content = document.getElementById('edu-content');
      if (content) {
        gsap.fromTo(content, 
          { opacity: 0, y: 10 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    });

    return () => ctx.revert();
  }, [activeTab]);

  // Handle window resize cleanly
  useLayoutEffect(() => {
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white relative text-black antialiased overflow-x-hidden">
      
      {/* HIDDEN AUDIO ELEMENT */}
      <audio ref={clickAudioRef} src="/assets/click.mp3" preload="auto"></audio>

      {/* SECTION 1: HERO */}
      <section className="h-screen flex flex-col justify-center items-center bg-gray-50 text-black relative overflow-hidden">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-center">
          About me
        </h1>
        <div className="absolute bottom-12 w-[65pt] h-[65pt] rounded-full overflow-hidden bg-white border-[2px] border-black/10 flex items-center justify-center">
          <img src="/assets/face.png" alt="Smiling Face" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* SECTION 2: NAME TYPEWRITER */}
      <section ref={nameSectionRef} className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden select-none">
        <div className="flex items-center justify-center w-full h-full px-4">
          <h1 className="font-black tracking-tighter leading-[0.9] text-black inline-block text-center whitespace-nowrap will-change-transform" style={{ fontSize: "min(18vw, 28vh)" }}>
            <span ref={nameTextRef}></span>
            <div className="inline-block ml-2 min-w-[4px] h-[0.75em] bg-black animate-pulse align-middle"></div>
          </h1>
        </div>
      </section>

      {/* SECTION 3: SUMMARY */}
      <section className="w-full min-h-screen bg-black text-white flex items-center justify-center py-20 px-6">
        <div className="max-w-5xl w-full">
          <div className="border-l-4 border-white/50 pl-6 space-y-6">
            <div className="flex items-center space-x-2 mb-2 text-gray-400 font-mono text-sm">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-75">●</span>
              <span className="animate-pulse delay-150">●</span>
              <span className="ml-2 text-xs text-gray-500">Generating professional summary...</span>
            </div>
            <div className="space-y-4 text-lg md:text-xl font-light leading-relaxed text-gray-200">
              <p><span className="font-bold text-white">Computer Science undergraduate</span> with a strong foundation in data science, AI, and software development.</p>
              <p>Experienced in building solutions that align technical innovation with business strategy. Proficient in <span className="font-bold text-white">Java, Python, R, HTML, JavaScript, React, and SQL</span>.</p>
              <p>Designed an <span className="font-bold text-white">AI-powered predictive maintenance platform</span> (Python, TensorFlow, IoT) achieving 92% fault-detection accuracy.</p>
              <p className="border-t border-white/10 pt-4 mt-4 text-sm text-gray-400">Currently seeking opportunities to leverage AI, predictive analytics, and software engineering in real-world innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: APPLE EDUCATION */}
      <section className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-950/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="w-full max-w-6xl relative z-10">
          <h2 className="text-5xl md:text-7xl font-light tracking-tight text-center mb-16 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">Education</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-row md:flex-col justify-center md:justify-start gap-4 md:gap-2 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
              {['university', 'college', 'school'].map((key) => (
                <button key={key} onClick={() => setActiveTab(key)} className={`text-left px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === key ? 'bg-white/10 backdrop-blur-md text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                  <div className="font-semibold text-lg">{key === 'university' ? 'University' : key === 'college' ? 'College' : 'Secondary School'}</div>
                  <div className="text-xs opacity-60 mt-1">{key === 'university' ? 'Sep 2024 - Jun 2028' : key === 'college' ? 'Sept 2022 - July 2024' : 'Sept 2018 - July 2022'}</div>
                </button>
              ))}
            </div>
            <div id="edu-content" className="w-full md:w-2/3">
              <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] min-h-[300px] shadow-black/80">
                <div className="flex items-start justify-between mb-4">
                  <div><h3 className="text-3xl md:text-4xl font-medium text-white tracking-tight">{educationData[activeTab].title}</h3><p className="text-blue-400/90 text-lg mt-1">{educationData[activeTab].school}</p></div>
                  <span className="text-sm font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">{educationData[activeTab].date}</span>
                </div>
                <div className="h-px w-full bg-white/10 my-6"></div>
                <div className="text-gray-300 text-lg leading-relaxed">{educationData[activeTab].details}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WORK EXPERIENCE - FIXED HIGH-PERFORMANCE TIMELINE */}
      <section ref={workSectionRef} className="relative w-full h-screen bg-black text-white flex items-center justify-center overflow-hidden">
        {/* Deep Ambient Background Glow to Make Glassmorphism Pop */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none will-change-transform"></div>
        <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none will-change-transform"></div>

        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 h-full items-center justify-center relative">
          
          {/* Left Container */}
          <div ref={workCardsContainerRef} className="w-full md:w-3/4 relative h-[60vh] flex items-center justify-center">
            {workData.map((job, index) => (
              <div
                key={index}
                className={`absolute inset-0 p-8 md:p-12 rounded-3xl bg-neutral-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] flex flex-col justify-center transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) will-change-[transform,opacity] ${
                  activeWorkIndex === index 
                    ? 'opacity-100 scale-100 border-white/20 pointer-events-auto z-20 translate-y-0 shadow-blue-500/5' 
                    : index < activeWorkIndex 
                      ? 'opacity-0 scale-[0.97] pointer-events-none -translate-y-8 z-10' 
                      : 'opacity-0 scale-[0.97] pointer-events-none translate-y-8 z-10'
                }`}
              >
                <div className="mb-6">
                  <span className="text-xs uppercase font-mono tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 inline-block mb-3">
                    Experience Block
                  </span>
                  <h3 className="text-3xl md:text-5xl font-medium text-white tracking-tight">{job.role}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    <p className="text-blue-300/90 text-lg md:text-xl font-normal">{job.company}</p>
                    <span className="hidden md:inline text-neutral-600">•</span>
                    <p className="text-neutral-400 text-sm font-mono">{job.date}</p>
                  </div>
                </div>
                
                <div className="h-px w-full bg-white/5 mb-6"></div>

                <ul className="space-y-3.5 text-neutral-300 text-base md:text-lg leading-relaxed">
                  {job.details.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-400 mt-2 text-[8px] min-w-[8px] shadow-[0_0_8px_rgba(96,165,250,0.6)]">●</span>
                      <span className="hover:text-white transition-colors duration-200">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Container: Oval Tracker */}
          <div className="w-full md:w-1/4 flex flex-row md:flex-col justify-center items-center gap-4 md:gap-6 h-auto md:h-[60vh] relative z-30">
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-neutral-800 rounded-full overflow-hidden">
              {/* Dynamic Inner Fill Line tracking progress */}
              <div 
                className="w-full bg-white/40 transition-all duration-500 ease-out"
                style={{ height: `${((activeWorkIndex) / (workData.length - 1)) * 100}%` }}
              />
            </div>
            {workData.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-500 ease-out z-10 border will-change-[transform,background-color] ${
                  activeWorkIndex === index 
                    ? 'bg-white scale-125 border-white shadow-[0_0_20px_rgba(255,255,255,0.6)]' 
                    : 'bg-neutral-800 scale-90 opacity-80 border-transparent hover:border-neutral-600'
                }`}
              ></div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: NEXT PLACEHOLDER */}
      <section className="w-full h-screen bg-gray-900 text-white flex items-center justify-center">
        <h2 className="text-4xl font-light tracking-widest uppercase">Projects Timeline (Next)</h2>
      </section>

    </div>
  );
}