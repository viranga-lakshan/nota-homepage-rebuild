/**
 * Populate queries, centralised.
 *
 * Strapi returns nothing nested unless you ask for it explicitly, and the
 * shorthand most tutorials use — `populate: '*'` — does not work on a
 * Dynamic Zone in v5: it errors rather than degrading, because Strapi cannot
 * know which component's relations you mean. v5 wants an `on` map keyed by
 * component UID, with each component's own populate spec (CLAUDE.md §4).
 *
 * Practical consequence: every time a section gains a media field or a
 * nested component, its entry below has to gain it too, or the field simply
 * arrives undefined with no error anywhere. That failure is silent, which is
 * why these queries live in one file instead of being inlined at call sites.
 */

import qs from "qs";

/**
 * Nested components need their own populate, one level at a time. A
 * repeatable component holding a media field (paper slides, box items,
 * colour variants, detail cards) is two levels deep and needs both.
 */
const HOMEPAGE_POPULATE = {
  seo: {
    populate: ["ogImage"],
  },
  sections: {
    on: {
      "sections.hero": {
        populate: ["mobile_fallback"],
      },
      "sections.specs": {
        populate: {
          pen_image: true,
          groups: { populate: ["items"] },
        },
      },
      "sections.who": {
        populate: ["personas", "video"],
      },
      "sections.paper": {
        populate: {
          slides: { populate: ["image"] },
        },
      },
      "sections.inside-box": {
        populate: {
          items: { populate: ["image"] },
        },
      },
      "sections.details": {
        populate: {
          cards: { populate: ["image", "video"] },
          video: true,
        },
      },
      "sections.color-variants": {
        populate: {
          colors: { populate: ["image"] },
        },
      },
    },
  },
} as const;

const NAVIGATION_POPULATE = {
  items: true,
  mobile_menu_image: true,
} as const;

const FOOTER_POPULATE = {
  nav_links: true,
} as const;

function stringify(populate: unknown): string {
  // encodeValuesOnly keeps the bracket syntax Strapi's query parser expects;
  // without it the brackets are percent-encoded and the filter is ignored.
  return qs.stringify({ populate }, { encodeValuesOnly: true });
}

export const homepageQuery = stringify(HOMEPAGE_POPULATE);
export const navigationQuery = stringify(NAVIGATION_POPULATE);
export const footerQuery = stringify(FOOTER_POPULATE);

/** Order Popup is flat — five strings, nothing to populate. */
export const orderPopupQuery = "";
