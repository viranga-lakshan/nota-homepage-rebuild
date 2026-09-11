/**
 * Raw shapes as Strapi v5 returns them over HTTP.
 *
 * These types describe the wire format only — flattened attributes,
 * `documentId` instead of `id` (see CLAUDE.md §4). Nothing outside
 * `lib/cms/` should import from this file; `mappers.ts` converts these into
 * the framework-free domain types under `src/domain/`.
 *
 * Left as a stub until the content types themselves exist in Strapi
 * (CLAUDE.md §7) — filling this in before the schema is finalised would
 * mean writing it twice.
 */

export type StrapiDTO = unknown;
