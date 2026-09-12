/**
 * The Section Registry — maps a Strapi Dynamic Zone's `__component` string
 * to the React component that renders it (CLAUDE.md §5).
 *
 * An unknown `__component` must render nothing and warn in development,
 * never crash the page: an editor adding a component the frontend doesn't
 * know about should degrade gracefully. That's what makes the page
 * genuinely CMS-driven — an editor can reorder or remove sections without
 * a developer touching this file.
 *
 * One folder in this directory per `sections.*` component in the CMS, named
 * identically (CLAUDE.md §7 lists all seven). Keeping the names in step
 * matters: the registry key below is the CMS's `__component` string minus
 * its `sections.` prefix, so a folder named differently from its component
 * is a section that silently renders nothing.
 *
 * Empty until the first section component is built — filled in one entry
 * per section, not all at once.
 */

import type { ComponentType } from "react";

type SectionProps = Record<string, unknown>;

export const sectionRegistry: Record<string, ComponentType<SectionProps>> = {};

export function resolveSection(componentName: string): ComponentType<SectionProps> | null {
  const Component = sectionRegistry[componentName];

  if (!Component) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[sectionRegistry] Unknown component "${componentName}" — rendering nothing. ` +
          "Add it to sectionRegistry if this is a real section."
      );
    }
    return null;
  }

  return Component;
}
