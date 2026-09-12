/**
 * DTO → domain mappers.
 *
 * The only place that translates Strapi's response shape (dto.types.ts)
 * into the framework-free domain types (src/domain/). A component should
 * never see a Strapi DTO — see CLAUDE.md §5, "Strapi's response shape must
 * never reach a component."
 *
 * Stub until there is a DTO to map — see dto.types.ts.
 */

import type { StrapiDTO } from "./dto.types";

export function mapHomepage(dto: StrapiDTO): unknown {
  throw new Error(`mapHomepage: not implemented (received ${typeof dto}) — no Homepage content type yet`);
}
