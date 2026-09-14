/**
 * The seven homepage sections, as domain models.
 *
 * Each one corresponds to a `sections.*` component in the CMS, but the
 * correspondence stops at the shape of the data. Two deliberate differences:
 *
 * 1. Fields are camelCase here and snake_case in Strapi. The snake_case
 *    naming is a CMS-side convention; it should not leak into React props.
 * 2. The discriminant is `type: "hero"`, not `__component: "sections.hero"`.
 *    The `sections.` prefix is Strapi's namespacing, not information the
 *    frontend needs, so the mapper strips it.
 *
 * Both differences mean the mapper has to do real work — which is the point.
 * If these types were identical to Strapi's response, the boundary would be
 * decorative and swapping the CMS would touch every component.
 */

import type { Image, Video } from "./media";

export interface SpecItem {
  label: string;
}

export interface SpecGroup {
  title: string;
  items: SpecItem[];
}

export interface Persona {
  title: string;
  body: string;
}

export interface PaperSlide {
  headline: string;
  image: Image;
  calloutTitle: string;
  calloutBody: string;
}

export interface BoxItem {
  title: string;
  description: string;
  image: Image;
}

export interface ColorVariant {
  name: string;
  tagline: string;
  image: Image;
}

export interface DetailCard {
  label?: string | null;
  image?: Image | null;
  video?: Video | null;
}

export interface HeroSection {
  type: "hero";
  headlineLine1: string;
  headlineLine2: string;
  /** Folder the scroll-scrubbed frames are served from, e.g. "/sequence/". */
  sequenceBasePath: string;
  /** How many frames live in that folder. The scrubber needs both. */
  sequenceFrameCount: number;
  /** Shown instead of the frame sequence on mobile (CLAUDE.md §8). */
  mobileFallback: Image;
  orderLabel: string;
  productName: string;
  price: string;
}

export interface SpecsSection {
  type: "specs";
  eyebrow: string;
  heading: string;
  penImage: Image;
  /** Always exactly three — the CMS enforces min 3 / max 3. */
  groups: SpecGroup[];
}

export interface WhoSection {
  type: "who";
  manifesto: string;
  intro: string;
  whoLabel: string;
  personas: Persona[];
  video: Video;
}

export interface PaperSection {
  type: "paper";
  headingLight: string;
  headingBold: string;
  slides: PaperSlide[];
}

export interface InsideBoxSection {
  type: "inside-box";
  heading: string;
  descriptionText: string;
  items: BoxItem[];
}

export interface DetailsSection {
  type: "details";
  cards: DetailCard[];
}

export interface ColorVariantsSection {
  type: "color-variants";
  colors: ColorVariant[];
}

export type Section =
  | HeroSection
  | SpecsSection
  | WhoSection
  | PaperSection
  | InsideBoxSection
  | DetailsSection
  | ColorVariantsSection;

export type SectionType = Section["type"];
