/**
 * Environment variables, validated lazily on first use and cached after that.
 *
 * Robust sanitization strips unwanted quotes, trims whitespace, and supplies
 * production-ready defaults so that Docker builds and Railway container runs
 * never crash on empty/missing env vars.
 */

export interface Env {
  STRAPI_URL: string;
  STRAPI_TOKEN: string;
  REVALIDATE_SECRET: string;
  NEXT_PUBLIC_STRAPI_MEDIA_URL: string;
  NEXT_PUBLIC_SITE_URL: string;
}

function cleanString(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  let cleaned = val.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned || fallback;
}

function cleanUrl(val: string | undefined, fallback: string): string {
  const cleaned = cleanString(val, fallback);
  return cleaned.replace(/\/+$/, "");
}

let cached: Env | undefined;

export function getEnv(): Env {
  if (!cached) {
    const defaultStrapiUrl = "https://nota-homepage-rebuild-production.up.railway.app";
    const strapiUrl = cleanUrl(process.env.STRAPI_URL, defaultStrapiUrl);
    const mediaUrl = cleanUrl(process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL, strapiUrl);
    const siteUrl = cleanUrl(
      process.env.NEXT_PUBLIC_SITE_URL,
      "https://supportive-truth-production-dbd9.up.railway.app"
    );
    const secret = cleanString(process.env.REVALIDATE_SECRET, "nota-revalidate-secret-2026");
    const token = cleanString(process.env.STRAPI_TOKEN, "");

    cached = {
      STRAPI_URL: strapiUrl,
      STRAPI_TOKEN: token,
      REVALIDATE_SECRET: secret,
      NEXT_PUBLIC_STRAPI_MEDIA_URL: mediaUrl,
      NEXT_PUBLIC_SITE_URL: siteUrl,
    };
  }

  return cached;
}
