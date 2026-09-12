/**
 * The homepage: its metadata, and the ordered list of sections that make it.
 */

import type { Image } from "./media";
import type { Section } from "./sections";

export interface Seo {
  title: string;
  description: string;
  ogImage: Image | null;
  /**
   * Whether to keep the page out of search engines. Defaults to true in the
   * CMS — the reference design belongs to its original creators, so this
   * rebuild must not be indexed (CLAUDE.md §2).
   */
  noIndex: boolean;
}

export interface Homepage {
  seo: Seo;
  /**
   * In the order the editor arranged them. The page renders this array
   * top to bottom and nothing else decides section order.
   */
  sections: Section[];
}
