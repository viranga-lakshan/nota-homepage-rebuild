/**
 * Environment variables, validated lazily on first use and cached after
 * that. Fails loudly and lists every missing/invalid variable, rather than
 * letting `undefined` propagate into a fetch call somewhere downstream
 * (CLAUDE.md §8).
 *
 * Server fields (STRAPI_URL/STRAPI_TOKEN/REVALIDATE_SECRET) carry a real
 * secret or a private URL. STRAPI_TOKEN is optional since public endpoints
 * operate unauthenticated. Default values prevent build-time static generation
 * from crashing when secrets are not yet configured on Railway/Docker build.
 */

import { z } from "zod";

const serverSchema = z.object({
  STRAPI_URL: z.string().url().default("http://127.0.0.1:1337"),
  STRAPI_TOKEN: z.string().optional().default(""),
  REVALIDATE_SECRET: z.string().optional().default("local-dev-secret"),
});

const publicSchema = z.object({
  NEXT_PUBLIC_STRAPI_MEDIA_URL: z.string().url().optional().default("http://127.0.0.1:1337"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("http://localhost:3000"),
});

type Env = z.infer<typeof serverSchema> & z.infer<typeof publicSchema>;

function parseOrThrow<T extends z.ZodRawShape>(schema: z.ZodObject<T>, source: Record<string, string | undefined>) {
  const result = schema.safeParse(source);

  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid or missing environment variables: ${missing}`);
  }

  return result.data;
}

let cached: Env | undefined;

export function getEnv(): Env {
  if (!cached) {
    const serverEnv = parseOrThrow(serverSchema, {
      STRAPI_URL: process.env.STRAPI_URL,
      STRAPI_TOKEN: process.env.STRAPI_TOKEN,
      REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    });

    const publicEnv = parseOrThrow(publicSchema, {
      NEXT_PUBLIC_STRAPI_MEDIA_URL: process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });

    cached = { ...serverEnv, ...publicEnv };
  }

  return cached;
}
