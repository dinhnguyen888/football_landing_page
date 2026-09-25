import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const ScrollEnhancer: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const location = useLocation();
  const lastScrollY = useRef<number>(0);

  // 1. Track scroll progress, direction & visibility of back-to-top button
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = height > 0 ? Math.min(100, Math.max(0, (currentY / height) * 100)) : 0;
          
          setScrollProgress(scrolled);
          setShowScrollTop(currentY > 260);

          // Update scroll direction attribute on documentElement (up / down)
          if (Math.abs(currentY - lastScrollY.current) > 5) {
            const direction = currentY > lastScrollY.current ? "down" : "up";
            document.documentElement.setAttribute("data-scroll-direction", direction);
            lastScrollY.current = currentY;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 2. Scroll-driven reveal IntersectionObserver + MutationObserver engine
  useEffect(() => {
    // When route changes, scroll smoothly to top
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    // Set up observer for elements that should animate into view
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          // If the element scrolled off the screen downward or upward, allow re-animating on scroll
          const rect = entry.boundingClientRect;
          if (rect.top > window.innerHeight + 150 || rect.bottom < -250) {
            entry.target.classList.remove("is-visible");
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px -15px 0px",
      threshold: [0.01, 0.08],
    });

    // Auto-discover elements to animate
    const setupElements = () => {
      const selectors = [
        ".reveal-on-scroll",
        ".reveal-left",
        ".reveal-right",
        ".reveal-zoom",
        ".portal-card",
        "main > section",
        ".tournament-card",
        ".card-hover-fx",
        "main > div > div",
      ];
      
      const elements = document.querySelectorAll(selectors.join(", "));
      elements.forEach((el) => {
        if (!el.classList.contains("reveal-on-scroll") &&
            !el.classList.contains("reveal-left") &&
            !el.classList.contains("reveal-right") &&
            !el.classList.contains("reveal-zoom")) {
          el.classList.add("reveal-on-scroll");
        }
        observer.observe(el);
      });
    };

    // Initial check
    const timer = setTimeout(setupElements, 100);

    // Watch for dynamic DOM changes (e.g. tabs change, filters, knockout views)
    let mutationTimer: NodeJS.Timeout;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(mutationTimer);
      mutationTimer = setTimeout(setupElements, 100);
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(mutationTimer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[3.5px] bg-gradient-to-r from-[#00e575] via-[#0ea5e9] to-[#f59e0b] z-[70] pointer-events-none transition-all duration-100 ease-out shadow-[0_0_12px_rgba(0,229,117,0.85)]"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Floating Back to Top Button with Circular Progress Ring */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Cuộn lên đầu trang"
        title="Cuộn lên đầu trang"
        className={`back-to-top-btn fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-75 translate-y-4 pointer-events-none"
        } hover:scale-110 active:scale-95 hover:border-emerald-400 group`}
      >
        {/* SVG Circular Progress Track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 p-1 pointer-events-none" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="2"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="url(#scrollGradient)"
            strokeWidth="2.5"
            strokeDasharray="94.25"
            strokeDashoffset={94.25 - (94.25 * scrollProgress) / 100}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
          <defs>
            <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e575" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Up Arrow Icon */}
        <i className="fa-solid fa-arrow-up text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 group-hover:-translate-y-0.5 transition-transform"></i>
      </button>
    </>
  );
};

export default ScrollEnhancer;
