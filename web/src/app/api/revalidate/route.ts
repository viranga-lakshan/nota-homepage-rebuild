import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/shared/lib/env";

/**
 * Strapi webhook target — this is what makes "publish without a code
 * deploy" real (CLAUDE.md §2). Wire a Strapi webhook (fires on
 * publish/unpublish/update) to POST here with `?secret=REVALIDATE_SECRET`.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
