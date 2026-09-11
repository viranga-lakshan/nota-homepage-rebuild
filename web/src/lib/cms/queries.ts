/**
 * Centralised Strapi `populate` query strings.
 *
 * Strapi v5 dynamic zones use `on` fragments keyed by component name —
 * `populate: '*'` does not populate dynamic zone components at all
 * (CLAUDE.md §4). Kept in one file so a populate string is never duplicated
 * (and drifted) across call sites in client.ts.
 *
 * Stub until the Homepage content type exists — see dto.types.ts.
 */

export const HOMEPAGE_POPULATE = {} as const;
