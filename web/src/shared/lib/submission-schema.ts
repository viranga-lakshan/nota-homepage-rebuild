/**
 * The order popup's validation rules, in one place.
 *
 * Deliberately not defined inside the route handler: a Next route file may
 * only export HTTP method handlers and a handful of known config names, so
 * exporting a schema from there is a build error. It needs its own module
 * anyway — the client form validates with this same schema through
 * zodResolver, and one definition is the only way client and server checks
 * cannot drift apart.
 */

import { z } from "zod";

export const submissionSchema = z.object({
  email: z.email(),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;
