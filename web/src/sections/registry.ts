/**
 * The Section Registry — maps a domain `Section.type` to the React
 * component that renders it (CLAUDE.md §5).
 *
 * Keys off the domain type ("hero", "specs", …), not Strapi's raw
 * `__component` string ("sections.hero"). By the time a section reaches
 * this registry it has already gone through mappers.ts — which itself
 * drops any component this build does not recognise, returning null rather
 * than letting an unmapped shape through. What lands here is the narrower
 * failure mode: a section the mapper *does* recognise (it is a real
 * variant of the `Section` union) but that has no React component wired up
 * yet, which is the current state of six of the seven sections.
 *
 * An unknown type must render nothing and warn in development, never crash
 * the page: a section recognised by the domain model but not yet built is
 * a normal state mid-project, not a bug.
 */

import type { ComponentType } from "react";
import type { Section, SectionType } from "@/domain/sections";
import { Hero } from "./hero";
import { Specs } from "./specs";

type SectionProps<T extends Section> = { section: T };

export const sectionRegistry: {
  [K in SectionType]?: ComponentType<SectionProps<Extract<Section, { type: K }>>>;
} = {
  hero: Hero,
  specs: Specs,
};

export function resolveSection<T extends Section>(section: T): ComponentType<SectionProps<T>> | null {
  const Component = sectionRegistry[section.type] as ComponentType<SectionProps<T>> | undefined;

  if (!Component) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[sectionRegistry] No component registered for "${section.type}" — rendering nothing. ` +
          "Add it to sectionRegistry once its component exists."
      );
    }
    return null;
  }

  return Component;
}
