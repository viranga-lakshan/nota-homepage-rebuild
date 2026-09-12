"use client";

import { useEffect, useState } from "react";

/**
 * Tracks a media query, updating live as the viewport (or a preference like
 * prefers-reduced-motion) changes.
 *
 * Starts `false` on both server and the first client render — there is no
 * viewport during SSR, and matching the first client paint to the server
 * output avoids a hydration warning. The real value arrives a tick later
 * via the effect below, once `window` exists.
 *
 * This does not decide which of two DOM trees to render — that split is
 * CSS-driven (see CLAUDE.md §3 and sections/hero/hero.module.css), which
 * has no such "unknown until mounted" moment at all. This hook exists for
 * client-only side effects that must not fire on the wrong side of a
 * breakpoint - loading the hero's 75 scroll frames, for one, which a mobile
 * visitor must never fetch even though the desktop tree is only CSS-hidden.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
