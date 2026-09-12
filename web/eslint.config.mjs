import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Next.js 15's eslint-config-next still ships legacy eslintrc-format shared
// configs (an `extends` key, not a flat-config array), so it needs this
// compat bridge rather than being spread directly. (create-next-app@latest
// currently scaffolds for Next 16, which changed this — see CLAUDE.md §4,
// this project is pinned to Next 15.)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },

  // --- Architecture boundaries (CLAUDE.md §5) -----------------------------
  // Built-in no-restricted-imports, not a custom plugin — see CLAUDE.md §5
  // for why the full ports-and-adapters enforcement was traded away on this
  // timeline. This is the cheap partial replacement: it still catches the
  // one import that would actually break the isolation guarantee.

  {
    files: ["src/sections/**/*.{ts,tsx}", "src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/cms/client",
              message:
                "sections/ and shared/ must not know Strapi exists — they receive data as props. " +
                "If you need a new field, add it to the mapper/domain type and pass it down instead.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/*", "@/sections/*", "@/shared/*"],
              message:
                "src/domain must stay framework-free and dependency-free. " +
                "If domain/ needs something from lib/sections/shared, the dependency points the wrong way.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
