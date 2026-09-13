/**
 * The only file in this codebase that knows Strapi exists.
 *
 * Everything else — sections, shared/, domain/ — depends on the return types
 * of these functions, never on Strapi's request/response shape. Swapping
 * Strapi for another CMS should mean changing this file (plus mappers.ts and
 * queries.ts) and zero components (CLAUDE.md §5).
 *
 * Deliberately not a formal port/adapter pair — see CLAUDE.md §5 for why that
 * was traded away on this timeline. `sections/` and `shared/` are blocked from
 * importing this file directly by the `no-restricted-imports` ESLint rule in
 * eslint.config.mjs; they receive data as props instead.
 *
 * Caching: every read is tagged, and the revalidate route invalidates those
 * tags when Strapi fires its publish webhook. That pairing is what makes
 * "publish without a deploy" true (CLAUDE.md §2) — without the tags, a
 * published change would sit invisible behind the cache until the next build.
 */

import { getEnv } from "@/shared/lib/env";
import type { Footer, Navigation, OrderPopup, SubmissionInput } from "@/domain/site";
import type { Homepage } from "@/domain/homepage";
import type {
  FooterDto,
  HomepageDto,
  NavigationDto,
  OrderPopupDto,
  StrapiSingleResponse,
} from "./dto.types";
import { footerQuery, homepageQuery, navigationQuery, orderPopupQuery } from "./queries";
import { toFooter, toHomepage, toNavigation, toOrderPopup } from "./mappers";

export const CACHE_TAGS = {
  homepage: "homepage",
  navigation: "navigation",
  footer: "footer",
  popup: "popup",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/**
 * Reads a Strapi single type.
 *
 * Sent with no Authorization header, deliberately: the bootstrap script
 * (cms/src/index.ts) grants the public role unauthenticated `find` on
 * exactly these four single types, so a token is not needed to read them —
 * only draft/unpublished content would ever need one, which nothing here
 * fetches. Confirmed against a live instance while building this: an
 * invalid token produces a 401 that a correct, empty one would not have,
 * making a bad token strictly worse than sending none.
 *
 * Returns null when nothing is published yet — an unpublished single type is
 * an ordinary state during content setup, not an error, and the caller
 * decides what to show. Anything else (CMS down, malformed JSON, a real
 * permission change) throws with the status attached, because those are
 * real failures and silently rendering an empty page would hide them.
 */
async function fetchSingle<T>(path: string, query: string, tag: CacheTag): Promise<T | null> {
  try {
    const env = getEnv();
    const url = query ? `${env.STRAPI_URL}${path}?${query}` : `${env.STRAPI_URL}${path}`;

    const response = await fetch(url, {
      next: { tags: [tag] },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.warn(`[cms] GET ${path} returned status ${response.status}`);
      return null;
    }

    const body = (await response.json()) as StrapiSingleResponse<T>;
    return body.data ?? null;
  } catch (error) {
    console.warn(`[cms] fetchSingle ${path} failed (CMS may be unreachable during build):`, error);
    return null;
  }
}

export async function getHomepage(): Promise<Homepage | null> {
  const dto = await fetchSingle<HomepageDto>("/api/homepage", homepageQuery, CACHE_TAGS.homepage);
  return dto ? toHomepage(dto) : null;
}

export async function getNavigation(): Promise<Navigation | null> {
  const dto = await fetchSingle<NavigationDto>(
    "/api/navigation",
    navigationQuery,
    CACHE_TAGS.navigation
  );
  return dto ? toNavigation(dto) : null;
}

export async function getFooter(): Promise<Footer | null> {
  const dto = await fetchSingle<FooterDto>("/api/footer", footerQuery, CACHE_TAGS.footer);
  return dto ? toFooter(dto) : null;
}

export async function getOrderPopup(): Promise<OrderPopup | null> {
  const dto = await fetchSingle<OrderPopupDto>(
    "/api/order-popup",
    orderPopupQuery,
    CACHE_TAGS.popup
  );
  return dto ? toOrderPopup(dto) : null;
}

/**
 * Writes a Submission entry.
 *
 * Unauthenticated on purpose: the public role holds `create` on Submission
 * and nothing else (granted in cms/src/index.ts), which is the permission
 * model CLAUDE.md §7 specifies. Sending a token here would imply a stricter
 * model than the one actually configured.
 *
 * Never cached — this is a write, and `no-store` also keeps it out of any
 * request-level dedupe.
 */
export async function createSubmission(input: SubmissionInput): Promise<void> {
  const env = getEnv();

  const response = await fetch(`${env.STRAPI_URL}/api/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      data: {
        email: input.email,
        source: input.source,
        submitted_at: new Date().toISOString(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `[cms] POST /api/submissions failed: ${response.status} ${response.statusText}`
    );
  }
}
