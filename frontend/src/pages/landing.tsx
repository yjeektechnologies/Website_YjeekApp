import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { CorpStrip } from "@/components/corp-strip";
import { FloatingSupport } from "@/components/floating-support";
import { PageIntro } from "@/components/page-intro";
import { SlideContext } from "@/context/SlideContext";
import {
  HeroSlide,
  CategoriesSlide,
  HowItWorksSlide,
  FeaturesSlide,
  AppDownloadSlide,
  PartnersSlide,
  TestimonialsSlide,
  ComingSoonSlide,
} from "@/components/carousel-slides";

const SLIDES_MASTER = [
  { id: "hero",        Component: HeroSlide,         label: "Home" },
  { id: "categories",  Component: CategoriesSlide,   label: "Deliver" },
  { id: "how",         Component: HowItWorksSlide,   label: "How" },
  { id: "features",    Component: FeaturesSlide,     label: "Features" },
  { id: "appDownload", Component: AppDownloadSlide,  label: "App" },
  { id: "partners",    Component: PartnersSlide,     label: "Partners" },
  { id: "reviews",     Component: TestimonialsSlide, label: "Reviews" },
  { id: "comingSoon",  Component: ComingSoonSlide,   label: "Soon" },
];

interface SlideConfig {
  id: string;
  label: string;
  visible: boolean;
  durationSeconds: number;
}

const DEFAULT_SLIDE_CONFIG: SlideConfig[] = SLIDES_MASTER.map((s) => ({
  id: s.id, label: s.label, visible: true, durationSeconds: 10,
}));

// Module-level flag: survives SPA navigation but resets on hard page refresh.
// This means the splash plays once per hard load, never on back-navigation.
let introPlayedThisLoad = false;

const slideVariants = {
  enter: (dir: number) => ({
    rotateX: dir > 0 ? 32 : -32,
    y: dir > 0 ? "7%" : "-7%",
    scale: 0.84,
    opacity: 0,
    filter: "blur(10px)",
  }),
  center: {
    rotateX: 0,
    y: "0%",
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.34, 1.1, 0.64, 1] as [number, number, number, number],
    },
  },
  exit: (dir: number) => ({
    rotateX: dir > 0 ? -32 : 32,
    y: dir > 0 ? "-7%" : "7%",
    scale: 0.84,
    opacity: 0,
    filter: "blur(10px)",
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

export default function LandingPage() {
  // Reads the module-level flag — true on SPA back-navigation, false on fresh load
  const [introComplete, setIntroComplete] = useState(() => introPlayedThisLoad);
  // Initialise directly from sessionStorage so carousel is already on the right
  // slide when the splash completes — no flash of the hero slide first.
  const [currentSlide, setCurrentSlide] = useState(() => {
    const target = sessionStorage.getItem("gotoSlide");
    if (target !== null) {
      const masterIndex = parseInt(target, 10);
      if (!isNaN(masterIndex) && masterIndex >= 0 && masterIndex < SLIDES_MASTER.length) {
        sessionStorage.removeItem("gotoSlide");
        return masterIndex; // SLIDES_MASTER indices == visible indices before config loads
      }
    }
    return 0;
  });
  const [direction, setDirection] = useState(1);
  const [slideConfig, setSlideConfig] = useState<SlideConfig[]>(DEFAULT_SLIDE_CONFIG);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const isAnimating = useRef(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const SLIDES = useMemo(
    () => SLIDES_MASTER.filter((s) => {
      const cfg = slideConfig.find((c) => c.id === s.id);
      return cfg ? cfg.visible !== false : true;
    }),
    [slideConfig]
  );

  useEffect(() => {
    fetch("/api/carousel-config")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.slides)) setSlideConfig(d.slides); })
      .catch(() => {});
  }, []);

  // Prevent mobile pull-to-refresh from reloading the page while the carousel is active
  useEffect(() => {
    const prev = document.body.style.overscrollBehavior;
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overscrollBehavior = prev;
      document.documentElement.style.overscrollBehavior = prev;
    };
  }, []);

  const pauseAutoplay = useCallback(() => {
    setAutoplayPaused(true);
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setAutoplayPaused(false), 30000);
  }, []);

  const goToSlide = useCallback(
    (index: number, fromUser = false) => {
      if (isAnimating.current) return;
      const clamped = Math.max(0, Math.min(index, SLIDES.length - 1));
      if (clamped === currentSlide) return;
      isAnimating.current = true;
      setDirection(clamped > currentSlide ? 1 : -1);
      setCurrentSlide(clamped);
      if (fromUser) pauseAutoplay();
      setTimeout(() => { isAnimating.current = false; }, 820);
    },
    [currentSlide, SLIDES.length, pauseAutoplay]
  );

  const next = useCallback((fromUser = false) => {
    if (isAnimating.current) return;
    const nxt = (currentSlide + 1) % SLIDES.length;
    isAnimating.current = true;
    setDirection(1);
    setCurrentSlide(nxt);
    if (fromUser) pauseAutoplay();
    setTimeout(() => { isAnimating.current = false; }, 820);
  }, [currentSlide, SLIDES.length, pauseAutoplay]);

  const prev = useCallback((fromUser = false) => {
    if (isAnimating.current) return;
    const prv = (currentSlide - 1 + SLIDES.length) % SLIDES.length;
    isAnimating.current = true;
    setDirection(-1);
    setCurrentSlide(prv);
    if (fromUser) pauseAutoplay();
    setTimeout(() => { isAnimating.current = false; }, 820);
  }, [currentSlide, SLIDES.length, pauseAutoplay]);

  useEffect(() => {
    if (autoplayPaused || !introComplete || SLIDES.length === 0) return;
    clearTimeout(autoplayTimerRef.current);
    const cfg = slideConfig.find((c) => c.id === SLIDES[currentSlide]?.id);
    const dur = (cfg?.durationSeconds ?? 10) * 1000;
    autoplayTimerRef.current = setTimeout(() => {
      const nxt = (currentSlide + 1) % SLIDES.length;
      isAnimating.current = true;
      setDirection(1);
      setCurrentSlide(nxt);
      setTimeout(() => { isAnimating.current = false; }, 820);
    }, dur);
    return () => clearTimeout(autoplayTimerRef.current);
  }, [currentSlide, autoplayPaused, introComplete, slideConfig, SLIDES]);

  useEffect(() => {
    const lastTime = { current: 0 };
    const handle = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastTime.current < 950) return;
      if (Math.abs(e.deltaY) < 20) return;
      lastTime.current = now;
      if (e.deltaY > 0) next(true);
      else prev(true);
    };
    window.addEventListener("wheel", handle, { passive: true });
    return () => window.removeEventListener("wheel", handle);
  }, [next, prev]);

  // Native touch swipe for mobile — vertical only
  useEffect(() => {
    let startY = 0;
    let startX = 0;
    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };
    const lastTime = { current: 0 };
    const onEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTime.current < 700) return;
      const dy = startY - e.changedTouches[0].clientY;
      const dx = startX - e.changedTouches[0].clientX;
      // Only trigger on vertical swipes; ignore horizontal swipes on mobile
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
        lastTime.current = now;
        if (dy > 0) next(true); else prev(true);
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") next(true);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") prev(true);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [next, prev]);

  const { Component: SlideComponent } = SLIDES[currentSlide] ?? SLIDES_MASTER[0];

  const contextGoToSlide = useCallback(
    (masterIndex: number) => {
      const masterSlide = SLIDES_MASTER[masterIndex];
      if (!masterSlide) return;
      const visibleIndex = SLIDES.findIndex((s) => s.id === masterSlide.id);
      if (visibleIndex === -1) return;
      goToSlide(visibleIndex, true);
    },
    [SLIDES, goToSlide]
  );

  return (
    <SlideContext.Provider
      value={{ currentSlide, goToSlide: contextGoToSlide, totalSlides: SLIDES.length }}
    >
      {!introComplete && (
        <PageIntro onComplete={() => { introPlayedThisLoad = true; setIntroComplete(true); }} />
      )}

      <div
        className="fixed inset-0 flex flex-col overflow-hidden"
        style={{ background: "#0A1810" }}
      >
        <Navbar />

        <div
          className="flex-1 relative overflow-hidden"
          style={{ perspective: "1600px", perspectiveOrigin: "50% 50%" }}
        >
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(76,175,80,0.04) 1px, transparent 1px), linear-gradient(to right, rgba(76,175,80,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
            <div className="w-[700px] h-[400px] bg-[#4CAF50]/5 blur-[180px] rounded-full" />
          </div>

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-10"
              style={{ transformStyle: "preserve-3d" }}
              drag
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_: unknown, info: PanInfo) => {
                const absX = Math.abs(info.offset.x);
                const absY = Math.abs(info.offset.y);
                // Vertical only on mobile; both axes on desktop
                const isMobile = window.innerWidth < 1024;
                if (!isMobile && absX > absY) {
                  if (absX > 45) { if (info.offset.x < 0) next(true); else prev(true); }
                } else {
                  if (absY > 55) { if (info.offset.y < 0) next(true); else prev(true); }
                }
              }}
            >
              <SlideComponent />
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots — right side (desktop only) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2.5">
            {SLIDES.map((slide, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i, true)}
                title={slide.label}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-2 h-8 bg-[#4CAF50] shadow-[0_0_8px_rgba(76,175,80,0.8)]"
                    : "w-2 h-2 bg-white/18 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Prev arrow hint (desktop only) */}
          {currentSlide > 0 && (
            <button
              onClick={() => prev(true)}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-30 text-white/18 hover:text-white/60 transition-colors hidden md:block"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          {/* Next arrow hint (desktop only) */}
          {currentSlide < SLIDES.length - 1 && (
            <button
              onClick={() => next(true)}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 text-white/18 hover:text-white/60 transition-colors hidden md:block"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}

          {/* Mobile swipe hint dots — bottom center */}
          <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i, true)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-5 h-1.5 bg-[#4CAF50]"
                    : "w-1.5 h-1.5 bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>

        <CorpStrip />
      </div>

      <FloatingSupport />
    </SlideContext.Provider>
  );
}
