import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // --- THEME STATE & TOGGLE ---
  const [isDark, setIsDark] = useState(true); // Default to Dark mode

  // 100% Working Theme Synchronization
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // --- STATES & DATA ---
  const [activeTab, setActiveTab] = useState('university');
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

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

  // Projects Data
  const projectsData = [
    {
      title: "AI Predictive Maintenance Platform",
      company: "FalconTag (Pharmaceutical Logistics)",
      description: "Developed an AI-powered platform to protect high-value pharmaceutical transport. Achieved 92% accuracy in fault detection using Python, TensorFlow, and IoT sensor data, reducing shipment delays by 28%."
    },
    {
      title: "SwiftBot Project",
      company: "Raspberry Pi Robotics",
      description: "Programmed a Raspberry Pi robot using Java (Eclipse IDE) with Agile methodologies. Designed system flowcharts and created visual prototypes in Canva, focusing on unit testing and white-box testing."
    },
    {
      title: "Oil and Gas Production Forecasting",
      company: "Statistical & ML Analysis",
      description: "Performed statistical analysis on rig data using SPSS and built machine learning models in Python (Scikit-learn) to forecast future oil production, translating complex data into actionable business insights."
    }
  ];

  // Hobbies Data
  const hobbiesData = [
    {
      title: "Technology & Gaming",
      description: "Passionate about exploring emerging frameworks and computational algorithms. Analyzes gameplay loops and AI patterns with a developer's perspective."
    },
    {
      title: "Sports",
      description: "Competitive local league cricketer, helping juniors develop teamwork. An active tournament chess player and college club member, sharpening analytical thinking."
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
            <h4 className="dark:text-white text-black font-semibold text-lg mb-1">Year 1 Modules:</h4>
            <ul className="list-disc list-inside dark:text-gray-300 text-gray-700 space-y-1 ml-2">
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
            <h4 className="dark:text-white text-black font-semibold text-lg mb-1">Year 2 Modules:</h4>
            <ul className="list-disc list-inside dark:text-gray-300 text-gray-700 space-y-1 ml-2">
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

  // --- 2. GSAP TYPEWRITER ---
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

  // --- 3. GSAP PINNING & CROSS-FADE TIMELINE FOR WORK ---
  useLayoutEffect(() => {
    if (!workSectionRef.current || !workCardsContainerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(workCardsContainerRef.current.children);
      
      cards.forEach((card, i) => {
        gsap.set(card, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 50,
          scale: i === 0 ? 1 : 0.97,
          pointerEvents: i === 0 ? 'auto' : 'none',
          visibility: i === 0 ? 'visible' : 'hidden'
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: workSectionRef.current,
          start: "top top",
          end: "+=3500",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            let index = 0;
            if (progress > 0.33 && progress <= 0.66) index = 1;
            if (progress > 0.66) index = 2;
            
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

      tl.to({}, { duration: 2 });

      if (cards[1]) {
        tl.to(cards[0], { opacity: 0, y: -50, scale: 0.97, visibility: 'hidden', pointerEvents: 'none', duration: 1, ease: "power2.inOut" }, "transition1")
          .to(cards[1], { opacity: 1, y: 0, scale: 1, visibility: 'visible', pointerEvents: 'auto', duration: 1, ease: "power2.inOut" }, "transition1")
          .to({}, { duration: 2 });
      }

      if (cards[2]) {
        tl.to(cards[1], { opacity: 0, y: -50, scale: 0.97, visibility: 'hidden', pointerEvents: 'none', duration: 1, ease: "power2.inOut" }, "transition2")
          .to(cards[2], { opacity: 1, y: 0, scale: 1, visibility: 'visible', pointerEvents: 'auto', duration: 1, ease: "power2.inOut" }, "transition2")
          .to({}, { duration: 2 });
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
          { opacity: 0, y: 15, scale: 0.98 }, 
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
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

  // --- 5. HANDLERS FOR PROJECT SLIDER ---
  const nextProject = () => {
    if (activeProjectIndex < projectsData.length - 1) {
      setActiveProjectIndex(activeProjectIndex + 1);
    } else {
      setActiveProjectIndex(0);
    }
  };

  const prevProject = () => {
    if (activeProjectIndex > 0) {
      setActiveProjectIndex(activeProjectIndex - 1);
    } else {
      setActiveProjectIndex(projectsData.length - 1);
    }
  };

  return (
    // ROOT CONTAINER with explicit full-height colors to guarantee it works even on refresh
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white antialiased overflow-x-hidden relative">
      
      {/* FIXED THEME TOGGLE BUTTON - Top Right */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-[999] p-3 rounded-full bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 text-black dark:text-white hover:scale-110 shadow-lg"
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        )}
      </button>

      {/* HIDDEN AUDIO ELEMENT */}
      <audio ref={clickAudioRef} src="/assets/click.mp3" preload="auto"></audio>

      {/* SECTION 1: HERO */}
      <section className="h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-neutral-900 text-black dark:text-white relative overflow-hidden">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-center">
          About me
        </h1>
        <div className="absolute bottom-12 w-[65pt] h-[65pt] rounded-full overflow-hidden bg-white dark:bg-black border-[2px] border-black/10 dark:border-white/10 flex items-center justify-center">
          <img src="/assets/face.png" alt="Smiling Face" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* SECTION 2: NAME TYPEWRITER */}
      <section ref={nameSectionRef} className="relative w-full h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden select-none">
        <div className="flex items-center justify-center w-full h-full px-4">
          <h1 className="font-black tracking-tighter leading-[0.9] text-black dark:text-white inline-block text-center whitespace-nowrap will-change-transform" style={{ fontSize: "min(18vw, 28vh)" }}>
            <span ref={nameTextRef}></span>
            <div className="inline-block ml-2 min-w-[4px] h-[0.75em] bg-black dark:bg-white animate-pulse align-middle"></div>
          </h1>
        </div>
      </section>

      {/* SECTION 3: SUMMARY */}
      <section className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center py-20 px-6">
        <div className="max-w-5xl w-full">
          <div className="border-l-4 border-black/30 dark:border-white/50 pl-6 space-y-6">
            <div className="flex items-center space-x-2 mb-2 text-black/50 dark:text-gray-400 font-mono text-sm">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-75">●</span>
              <span className="animate-pulse delay-150">●</span>
              <span className="ml-2 text-xs text-black/30 dark:text-gray-500">Generating professional summary...</span>
            </div>
            <div className="space-y-4 text-lg md:text-xl font-light leading-relaxed text-black/70 dark:text-gray-200">
              <p><span className="font-bold text-black dark:text-white">Computer Science undergraduate</span> with a strong foundation in data science, AI, and software development.</p>
              <p>Experienced in building solutions that align technical innovation with business strategy. Proficient in <span className="font-bold text-black dark:text-white">Java, Python, R, HTML, JavaScript, React, and SQL</span>.</p>
              <p>Designed an <span className="font-bold text-black dark:text-white">AI-powered predictive maintenance platform</span> (Python, TensorFlow, IoT) achieving 92% fault-detection accuracy.</p>
              <p className="border-t border-black/10 dark:border-white/10 pt-4 mt-4 text-sm text-black/40 dark:text-gray-400">Currently seeking opportunities to leverage AI, predictive analytics, and software engineering in real-world innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: APPLE EDUCATION */}
      <section className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-6xl relative z-10">
          <h2 className="text-5xl md:text-7xl font-light tracking-tight text-center mb-16 bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-400 dark:from-white dark:via-gray-200 dark:to-gray-500">
            Education
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="flex flex-row md:flex-col justify-center md:justify-start gap-3 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 pb-6 md:pb-0 md:pr-8">
              {['university', 'college', 'school'].map((key) => (
                <button 
                  key={key} 
                  onClick={() => setActiveTab(key)} 
                  className={`text-left px-5 py-4 rounded-2xl transition-all duration-300 border ${
                    activeTab === key 
                      ? 'bg-black/5 dark:bg-neutral-900/80 backdrop-blur-xl border-black/20 dark:border-white/25 text-black dark:text-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] scale-[1.02]' 
                      : 'border-transparent text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/5 dark:hover:border-white/5'
                  }`}
                >
                  <div className="font-semibold text-lg tracking-tight">
                    {key === 'university' ? 'University' : key === 'college' ? 'College' : 'Secondary School'}
                  </div>
                  <div className="text-xs font-mono opacity-60 mt-1">
                    {key === 'university' ? 'Sep 2024 - Jun 2028' : key === 'college' ? 'Sept 2022 - July 2024' : 'Sept 2018 - July 2022'}
                  </div>
                </button>
              ))}
            </div>

            <div id="edu-content" className="w-full md:w-2/3">
              <div className="bg-black/5 dark:bg-neutral-900/60 hover:bg-black/10 dark:hover:bg-neutral-900/70 transition-colors duration-500 backdrop-blur-3xl border border-black/10 dark:border-white/15 rounded-3xl p-8 md:p-12 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.1),inset_0_1px_1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_10px_50px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.2)] min-h-[320px] relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 relative z-10">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-medium text-black dark:text-white tracking-tight leading-tight">
                      {educationData[activeTab].title}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-lg mt-1 font-normal">
                      {educationData[activeTab].school}
                    </p>
                  </div>
                  <span className="self-start sm:self-auto text-xs font-mono text-black/60 dark:text-gray-300 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-inner">
                    {educationData[activeTab].date}
                  </span>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-black/20 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent my-6"></div>
                <div className="text-black/70 dark:text-gray-300 text-lg leading-relaxed relative z-10 font-light">
                  {educationData[activeTab].details}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: WORK EXPERIENCE */}
      <section ref={workSectionRef} className="relative w-full h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none will-change-transform"></div>
        <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none will-change-transform"></div>

        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 h-full items-center justify-center relative">
          
          <div ref={workCardsContainerRef} className="w-full md:w-3/4 relative h-[70vh] md:h-[60vh] max-h-[650px] min-h-[480px] flex items-center justify-center">
            {workData.map((job, index) => (
              <div
                key={index}
                className="absolute inset-0 p-6 md:p-12 rounded-3xl bg-black/5 dark:bg-neutral-900/70 backdrop-blur-3xl border border-black/10 dark:border-white/15 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_50px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.2)] flex flex-col justify-start md:justify-center overflow-y-auto style-scrollbar will-change-[transform,opacity]"
              >
                <div className="mb-4 md:mb-6 flex-shrink-0">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block mb-2 md:mb-3 shadow-[inset_0_1px_1px_rgba(96,165,250,0.2)]">
                    Experience Block 0{index + 1}
                  </span>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-medium text-black dark:text-white tracking-tight leading-tight">
                    {job.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5">
                    <p className="text-blue-600 dark:text-blue-300 text-base md:text-xl font-normal">{job.company}</p>
                    <span className="hidden md:inline text-black/30 dark:text-neutral-600">•</span>
                    <p className="text-black/50 dark:text-neutral-400 text-xs font-mono">{job.date}</p>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-black/20 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent mb-4 md:mb-6 flex-shrink-0"></div>
                <ul className="space-y-3 text-black/70 dark:text-neutral-300 text-sm md:text-base lg:text-lgb font-light">
                  {job.details.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-blue-400 mt-2 text-[5px] min-w-[5px] h-[5px] rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] flex-shrink-0"></span>
                      <span className="hover:text-black dark:hover:text-white transition-colors duration-200">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="w-full md:w-1/4 flex flex-row md:flex-col justify-center items-center gap-4 md:gap-6 h-auto md:h-[60vh] relative z-30">
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-black/20 dark:bg-neutral-800/80 rounded-full overflow-hidden">
              <div 
                className="w-full bg-gradient-to-b from-blue-500 to-white transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ height: `${(activeWorkIndex / (workData.length - 1)) * 100}%` }}
              />
            </div>
            {workData.map((_, index) => (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ease-out z-10 border will-change-[transform,background-color] ${
                  activeWorkIndex === index 
                    ? 'bg-white scale-125 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' 
                    : 'bg-black/30 dark:bg-neutral-800 scale-90 opacity-60 border-transparent'
                }`}
              ></div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: PROJECTS SLIDER */}
      <section className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-5xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-center mb-12 bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-400 dark:from-white dark:to-gray-500">
            Projects Journey
          </h2>

          <div className="relative w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-2xl group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-[80%] w-[2px] bg-black/10 dark:bg-white/10 rounded-full z-20 hidden md:block">
              <div 
                className="w-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)] rounded-full transition-all duration-500 ease-out"
                style={{ height: `${((activeProjectIndex + 1) / projectsData.length) * 100}%` }}
              ></div>
            </div>

            <div className="w-full h-full relative flex items-center justify-center px-6 md:px-16">
              {projectsData.map((project, index) => {
                const offset = index - activeProjectIndex;
                return (
                  <div
                    key={index}
                    className={`absolute p-6 md:p-10 w-[90%] md:w-full transition-all duration-500 ease-in-out ${
                      offset === 0 
                        ? 'opacity-100 translate-x-0 scale-100 z-10' 
                        : offset < 0 
                          ? 'opacity-0 -translate-x-12 scale-95 z-0' 
                          : 'opacity-0 translate-x-12 scale-95 z-0'
                    }`}
                  >
                    <div className="mb-4">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block mb-3 shadow-[inset_0_1px_1px_rgba(96,165,250,0.2)]">
                        Project 0{index + 1}
                      </span>
                      <h3 className="text-2xl md:text-4xl font-medium text-black dark:text-white tracking-tight leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-300 text-base md:text-xl mt-1 font-normal">{project.company}</p>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-black/20 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent my-4"></div>
                    <p className="text-black/70 dark:text-gray-300 text-base md:text-lg leading-relaxed font-light">
                      {project.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={prevProject}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center z-30 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={nextProject}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center z-30 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            {projectsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveProjectIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeProjectIndex === index 
                    ? 'w-8 bg-black dark:bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]' 
                    : 'w-2 bg-black/30 dark:bg-white/30 hover:bg-black/50 dark:hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: HOBBIES SLIDE CARD */}
      <section className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center py-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-center mb-16 bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-400 dark:from-white dark:to-gray-500">
            Interests & Hobbies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hobbiesData.map((hobby, index) => (
              <div 
                key={index}
                className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-500 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl group hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">
                    {index === 0 ? '💻' : '♟'}
                  </div>
                  <h3 className="text-2xl font-medium text-black dark:text-white tracking-tight">{hobby.title}</h3>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-black/20 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent mb-4"></div>
                <p className="text-black/70 dark:text-gray-300 text-lg leading-relaxed font-light">
                  {hobby.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FOOTER VIDEO */}
      <section className="w-full h-screen bg-white dark:bg-black relative overflow-hidden flex items-center justify-center">
        <video 
          src="/assets/footer-video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 z-10"></div>
        <div className="relative z-20 text-center px-6">
          <h2 className="text-3xl md:text-5xl font-light tracking-widest text-black dark:text-white">
            Let's Connect
          </h2>
          <p className="text-black/60 dark:text-gray-400 mt-4 text-sm md:text-base tracking-wide">
            ewonwilliam.d@gmail.com
          </p>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .style-scrollbar::-webkit-scrollbar { display: none; }
        .style-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  );
}