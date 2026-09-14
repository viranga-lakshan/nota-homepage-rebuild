import { useEffect, useState, useRef, useCallback } from "react";

export interface ColorVariantsScrollState {
  progress: number;
  activeIndex: number;
  variantCount: number;
}

export function useColorVariantsScroll(variantCount: number = 5) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<ColorVariantsScrollState>({
    progress: 0,
    activeIndex: 0,
    variantCount,
  });

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollableDistance = containerRef.current.offsetHeight - windowHeight;

    if (totalScrollableDistance <= 0) return;

    // How far the top of the container has scrolled past the top of the viewport
    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollableDistance));

    // Calculate active slide index
    const segment = 1 / Math.max(1, variantCount - 1);
    const activeIndex = Math.min(
      variantCount - 1,
      Math.max(0, Math.round(rawProgress / segment))
    );

    setScrollState({
      progress: rawProgress,
      activeIndex,
      variantCount,
    });
  }, [variantCount]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  const scrollToVariant = useCallback(
    (index: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = rect.top + scrollTop;
      const totalScrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      const segment = 1 / Math.max(1, variantCount - 1);
      const targetScroll = containerTop + index * segment * totalScrollableDistance;

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    },
    [variantCount]
  );

  return {
    containerRef,
    progress: scrollState.progress,
    activeIndex: scrollState.activeIndex,
    scrollToVariant,
  };
}
