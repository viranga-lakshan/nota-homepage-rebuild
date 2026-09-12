/**
 * GSAP, registered once, client-side only.
 *
 * ScrollTrigger reads `document` the moment it registers, so registration
 * has to be guarded — this module can be imported from a Server Component's
 * tree without blowing up the render, even though nothing in it ever runs
 * there (nothing calls a GSAP API during SSR; components that animate are
 * 'use client' and only run this on the client).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
