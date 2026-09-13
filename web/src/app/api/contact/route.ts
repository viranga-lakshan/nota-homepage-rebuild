import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/lib/cms/client";
import { submissionSchema } from "@/shared/lib/submission-schema";

/**
 * Backs the order popup's email capture: validates, then writes a
 * `Submission` entry in Strapi (CLAUDE.md §2 — "forms must submit, validate
 * input, and save entries to the CMS").
 *
 * The client form validates with the same schema (shared/lib/submission-schema),
 * so client and server checks cannot drift. Validating again here is not
 * redundant: the browser check is a convenience, and anyone can POST straight
 * to this route without it.
 *
 * `source` is set server-side rather than taken from the request. It exists
 * to tell entries apart if more forms are added later, and a value the
 * caller controls would be worthless for that.
 */
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Expected a JSON body" }, { status: 400 });
  }

  const result = submissionSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid submission", issues: result.error.issues },
      { status: 400 }
    );
  }

  try {
    await createSubmission({ email: result.data.email, source: "homepage" });
  } catch (error) {
    // The address is the visitor's, so it stays out of the log line; the
    // status and message from Strapi are what actually aid diagnosis.
    console.error("[contact] Failed to create submission:", error);
    return NextResponse.json({ message: "Could not save your details" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
