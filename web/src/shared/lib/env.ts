/**
 * Environment variables, validated once at module load. Fails loudly and
 * lists every missing/invalid variable, rather than letting `undefined`
 * propagate into a fetch call somewhere downstream (CLAUDE.md §8).
 */

import { z } from "zod";

const serverSchema = z.object({
  STRAPI_URL: z.string().url(),
  STRAPI_TOKEN: z.string().min(1),
  REVALIDATE_SECRET: z.string().min(1),
});

const publicSchema = z.object({
  NEXT_PUBLIC_STRAPI_MEDIA_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

function parseOrThrow<T extends z.ZodRawShape>(schema: z.ZodObject<T>, source: Record<string, string | undefined>) {
  const result = schema.safeParse(source);

  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid or missing environment variables: ${missing}`);
  }

  return result.data;
}

const serverEnv = parseOrThrow(serverSchema, {
  STRAPI_URL: process.env.STRAPI_URL,
  STRAPI_TOKEN: process.env.STRAPI_TOKEN,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
});

const publicEnv = parseOrThrow(publicSchema, {
  NEXT_PUBLIC_STRAPI_MEDIA_URL: process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

// Server fields (STRAPI_URL/STRAPI_TOKEN/REVALIDATE_SECRET) carry a real
// secret or a private URL — only import `env` from Server Components,
// Route Handlers, or lib/cms/*. Never from a 'use client' module: Next only
// inlines NEXT_PUBLIC_* vars into the browser bundle, so a client import
// would fail this module's own validation at runtime instead of silently
// leaking a secret, but it would still break the page.
export const env = {
  ...serverEnv,
  ...publicEnv,
};
