import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSubmission } from "@/lib/cms/client";

/**
 * Backs the contact form: validates, then writes a `Submission` entry in
 * Strapi (CLAUDE.md §2 — "forms must submit, validate input, and save
 * entries to the CMS"). react-hook-form + zodResolver on the client should
 * use this same schema so client and server validation never drift.
 *
 * Stub: createSubmission() throws until the Submission content type
 * exists (CLAUDE.md §7).
 */
const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Invalid submission", issues: result.error.issues },
      { status: 400 }
    );
  }

  try {
    await createSubmission(result.data);
  } catch {
    return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
  }

  return NextResponse.json({ success: true });
}
