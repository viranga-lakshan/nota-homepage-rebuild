/**
 * The only file in this codebase that knows Strapi exists.
 *
 * Everything else — sections, shared/, domain/ — depends on the return
 * types of these functions, never on Strapi's request/response shape
 * directly. Swapping Strapi for another CMS should mean changing this file
 * (plus mappers.ts/queries.ts) and zero components (CLAUDE.md §5).
 *
 * Deliberately not a formal port/adapter pair — see CLAUDE.md §5 for why
 * that was traded away on this timeline. `sections/` and `shared/` are
 * blocked from importing this file directly by the `no-restricted-imports`
 * ESLint rule in eslint.config.mjs.
 *
 * Stub: the Homepage/Navigation/Footer/Submission content types don't
 * exist in Strapi yet (CLAUDE.md §7), so there is nothing real to fetch.
 */

import { env } from "@/shared/lib/env";

function strapiUrl(path: string): string {
  return `${env.STRAPI_URL}${path}`;
}

export async function getHomepage(): Promise<unknown> {
  throw new Error(`getHomepage: not implemented (would fetch ${strapiUrl("/api/homepage")})`);
}

export async function getNavigation(): Promise<unknown> {
  throw new Error("getNavigation: not implemented — no Navigation content type yet");
}

export async function getFooter(): Promise<unknown> {
  throw new Error("getFooter: not implemented — no Footer content type yet");
}

export async function createSubmission(data: unknown): Promise<unknown> {
  throw new Error(`createSubmission: not implemented (received ${typeof data}) — no Submission content type yet`);
}
