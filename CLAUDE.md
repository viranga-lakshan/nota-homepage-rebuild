# CLAUDE.md

Project context for AI assistants working in this repository. Read this before doing anything.

---

## 1. What this project is

A rebuild of the **homepage only** of `https://nota.uprock.pro/` — a marketing site for NŌTA, a smart pen product. The rebuild is powered by a headless CMS and deployed to Railway.

This is a technical assignment for a **Senior Web Developer** role. It is assessed by human reviewers who will read the code, log into the CMS, and inspect the infrastructure. Output quality standards are therefore higher than a normal prototype: this must look and read like production work.

**Deadline: Wednesday 16 September 2026, 09:00 Sri Lanka time.**

### How it is scored

Four independent criteria. Strength in one does not compensate for weakness in another.

1. **Visual and interaction accuracy** — matching the reference at every screen size, including its scroll animations
2. **CMS content modelling and editing experience** — how good the CMS is *for a non-technical editor*
3. **Code quality and structure** — architecture with real, enforced boundaries
4. **Railway setup** — services, environment variables, networking

Criterion 2 is where most candidates lose. Treat the CMS editing experience as a product in its own right, not as a data store.

---

## 2. Hard requirements

These come directly from the brief. Violating any of them fails the submission.

- **No content may be hardcoded.** Every string, image, link, price, nav item and SEO field comes from the CMS. If you can grep a headline in the frontend source, it is a bug.
- **Content must be modelled for an editor** — discrete components and repeatable items. Not one large rich-text blob per section.
- **Publishing in the CMS must update the live site without a code deploy.**
- **Uploaded media must survive a redeploy.**
- **Forms must submit, validate input, and save entries to the CMS.**
- **A `noindex` tag must be present.** The design belongs to its original creators.
- **No reference HTML, CSS or JS may be copied.** Images may be reused. No site-cloning or export tools. All markup and styles are written from scratch.

---

## 3. The reference site's behaviour

The homepage is animation-heavy. Critically, most effects are **scroll-scrubbed** — tied directly to scroll position — rather than triggered-and-played. This drives the choice of animation library.

| Section | Behaviour |
|---|---|
| Hero | Pen image sequence scrubbed on scroll, drawn to `<canvas>`. Headline fixed lower-left. Sticky order card upper-right. |
| Specifications | Section pinned; pen scales up behind three cards while the heading holds position |
| Spec cards | Three columns entering at different vertical speeds (staggered parallax) |
| Manifesto | Large serif paragraph on dark background; text fills from grey to white as it scrolls through the viewport |
| Who it's for | Sticky label in the left column, content flowing in the right |
| Showcase | Product image expands to full-bleed via clip-path as you scroll, then contracts |
| Global | Smooth inertial scrolling |

**Implication:** GSAP ScrollTrigger (`pin` + `scrub`) is the correct tool. Framer Motion alone cannot cleanly do the pinning and scrubbing required here.

---

## 4. Stack

| Concern | Choice |
|---|---|
| Frontend | Next.js 15, App Router, TypeScript |
| Styling | CSS Modules with design tokens as CSS custom properties |
| Animation | GSAP 3 + ScrollTrigger, Lenis for smooth scroll |
| Forms | react-hook-form + zod |
| CMS | Strapi v5 (self-hosted, TypeScript) |
| Database | PostgreSQL — Docker locally, Railway Postgres in production |
| Media storage | Railway persistent volume mounted at the Strapi uploads path |
| Hosting | Railway — three services: `postgres`, `strapi`, `frontend` |
| Node | 20 LTS |

### Why these, in case you are asked to justify or change them

- **Next.js** — React Server Components keep the CMS API token server-side. ISR with on-demand revalidation is what makes "publish without deploy" work.
- **GSAP over Framer Motion** — the reference uses pinned, scrubbed timelines. ScrollTrigger is the mature tool for that.
- **CSS Modules over a utility framework** — this is a bespoke design, not a component-kit layout. Pinned and scrubbed sections have layout CSS that is easier to read and debug in a stylesheet than in long class strings.
- **Railway volume over Cloudinary** — the brief explicitly assesses Railway setup. A volume demonstrates understanding of container storage. Object storage is the right production answer and is noted as a future improvement, not used here.
- **Postgres locally via Docker** — matching the production engine avoids a class of bugs that only appear after deploy.
- **Strapi** — v5 uses `on` fragments for dynamic zone population — `populate: '*'` errors. Response format is flattened (no `data.attributes`) and `documentId` replaces `id`. Most tutorials online are v4 and will not work.

---

## 5. Architecture

Three layers. Dependencies point **inward only**.

```
PRESENTATION   shared/ui (primitives)  +  sections/ (page sections)
      │
COMPOSITION    Section Registry — maps CMS component names to React components
      │
DATA / DOMAIN  Ports & Adapters — CMS client behind an interface, DTO→domain mappers
```

### Presentation

Atomic Design *principles*, not Atomic Design *folders*. Two tiers only:

- `src/shared/ui/` — design-system primitives. No business logic, no CMS knowledge.
- `src/sections/` — one folder per homepage section, each mapping 1:1 to a CMS component. Self-contained: markup, styles, animation hook, local types.

The atoms/molecules/organisms taxonomy is deliberately **not** used. Its boundaries are ambiguous and the debate it generates costs more than it returns on a single landing page.

### Composition — the Section Registry

The CMS returns an ordered array of section components (a Strapi Dynamic Zone). A registry object maps each `__component` string to a React component, and a renderer walks the array.

An unknown component name must render `null` and log a warning in development — **never crash the page**. An editor adding a component the frontend does not know about should degrade gracefully.

This is the feature that makes the page genuinely CMS-driven: an editor can reorder or remove sections without a developer.

### Data — Ports & Adapters

Strapi's response shape must never reach a component.

- `src/lib/cms/client.ts` — the **only** file that knows Strapi exists (fetches `Homepage` / `Navigation` / `Footer`, creates `Submission` entries)
- `src/lib/cms/mappers.ts` — DTO to domain model
- `src/lib/cms/queries.ts` — populate strings, centralised
- `src/domain/` — framework-free types

Test of correctness: swapping Strapi for another CMS should change one file and zero components.

**Deliberately simplified vs. a textbook ports-and-adapters setup:** no formal `port.ts` interface, and no custom ESLint path-boundary plugin. A five-day solo build with exactly one CMS, forever, doesn't earn back the half-day that machinery costs. The isolation guarantee — nothing outside `lib/cms/client.ts` knows Strapi's response shape — comes from file organisation and code review discipline, documented here as a **convention, not a lint-enforced rule**. This is a stated trade-off, not an oversight: it costs some of criterion 3's "enforced boundaries" credit in exchange for time spent on higher-risk work (the hero frame sequence, confirming the content model). If time allows later, the cheapest way to claw some of that back is a single built-in `no-restricted-imports` ESLint rule forbidding `sections/` and `shared/` from importing `lib/cms/client.ts` directly — much less setup than the custom multi-zone plugin config this replaces.

---

## 6. Repository layout

```
nota-homepage-rebuild/
├── CLAUDE.md
├── docker-compose.yml          Postgres for local development
├── package.json                workspace scripts only
├── cms/                        Strapi v5
│   ├── src/api/                content types — COMMITTED
│   ├── src/components/         components   — COMMITTED
│   ├── config/
│   └── public/uploads/         media — GITIGNORED
└── web/                        Next.js 15
    └── src/
        ├── app/
        ├── sections/
        ├── shared/{ui,hooks,lib}
        ├── lib/{cms,animation,seo}
        ├── domain/
        └── styles/
```

**Important distinction:** Strapi schemas are *code* and travel through git. Strapi *content* lives in the database and does not. The Content-Type Builder is disabled when `NODE_ENV=production`, so all content modelling happens locally and is deployed by pushing schema files.

---

## 7. Content model

**This section now describes what is actually built** (`cms/src/components/`, `cms/src/api/`), not a plan. Earlier revisions — a 7-section guess from a 25-second recording, then a 9-section list from an automated page fetch — were both wrong about section boundaries; a manual pass over the reference showed several of them are one scroll-driven section rather than separate ones (the manifesto and audience list share a section; "Works with" is the heading of the paper sequence, not a section of its own).

One Strapi **Single Type** (`Homepage`) holding a **Dynamic Zone** of section components, plus reusable shared components.

**Section components** (7), in reference order:

1. `sections.hero` — headline (two lines), Lottie animation URL, mobile fallback image, order button (label + product + price)
2. `sections.specs` — eyebrow, heading, pen image, exactly 3 `shared.spec-group`
3. `sections.who` — manifesto statement, intro, sticky label, repeatable `shared.persona`, looping video
4. `sections.paper` — two-part heading ("Works with" / "smart paper"), 2–6 `shared.paper-slide`
5. `sections.inside-box` — heading, description, 1–6 `shared.box-item`
6. `sections.details` — 1–8 `shared.detail-card` (photo or video + optional label pill)
7. `sections.color-variants` — 1–8 `shared.color-variant`, carousel-ordered

**Shared components** (9): `shared.seo`, `shared.nav-item`, `shared.spec-item`, `shared.spec-group`, `shared.persona`, `shared.paper-slide`, `shared.box-item`, `shared.color-variant`, `shared.detail-card`

**Other types:** `Navigation` (single — wordmark, links, order button), `Footer` (single — description, credit, copyright, links), `Order Popup` (single — the email capture dialog's copy), `Submission` (collection — captured email addresses)

**Conventions worth knowing before editing a schema:**
- Field names are `snake_case`, except `shared.seo`, whose fields carry the standard names of the meta tags they map to (`metaTitle`, `metaDescription`, `ogImage`, `noIndex`).
- Strapi cannot make Media Library alt text mandatory, so every media field is paired with its own required `*_alt` string field. That is how the "alt text required on all media" rule below is actually enforced.
- `description` in a `schema.json` attribute documents the field for developers reading the repo; it does **not** surface to editors. Editor-facing field descriptions live in Content Manager view configuration, which is database state — see the caveat below.
- A **stale** `cms/types/generated/` breaks `strapi build` (it contradicts the new schemas); an **absent** one does not (typing falls back to permissive). It is gitignored, so Railway's fresh clone is fine. After changing a schema locally, run `npx strapi ts:generate-types` or start `develop` before trusting a build failure.

### Editor-experience rules

The reviewers will log in and click around. These are graded, not optional:

- Every string field has `required` and a sensible `maxLength` — an editor should not be able to break the layout ✅ done in schema
- Alt text is required on all media ✅ done, via paired `*_alt` fields (see conventions above)
- Every component has a distinct icon and a readable `displayName` so the Dynamic Zone picker makes sense ✅ done in schema
- Draft & Publish is enabled on `Homepage` ✅ done, and deliberately off everywhere else
- `noIndex` on the SEO component defaults to `true` ✅ done in schema
- Public role has `create` on `Submission` only — never `find` ✅ done in code, `cms/src/index.ts` `bootstrap()`, so it survives a fresh database instead of needing to be re-clicked per environment. Verified: `GET /api/submissions` → 403, `POST` → 201.
- The Content Manager view is configured, not left at defaults ⬜ **outstanding** — this is database state, not a schema file, so it cannot travel through git as written. It has to be done in the admin UI of each environment (or scripted against the content-manager configuration store). Until it is done, editors see default field ordering and no field descriptions.

---

## 8. Conventions

### Git

- `main` is production. Railway deploys from it. Never commit to it directly, never force-push it.
- One short-lived feature branch per task, merged via pull request, squash-merged.
- Branch names: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/` + lowercase hyphenated description.
- Commits follow Conventional Commits: `feat(hero): add canvas frame sequence scrubber`.
- Small, frequent commits. The git history is part of the submission and will be read.

### Code

- TypeScript strict mode. No `any` — use `unknown` and narrow.
- Server Components by default; `'use client'` only where interactivity or DOM access requires it.
- Named exports, except Next.js files that require a default.
- Co-locate: a section's component, styles, hook and types live in its own folder.
- Environment variables are validated with zod at boot and fail loudly.

### Animation

- Every GSAP timeline is created inside `gsap.context()` and reverted on unmount. React StrictMode double-mounts in development; without this you get duplicated pin spacers and silently broken layout.
- Every animation is gated on `prefers-reduced-motion`. When reduced, render the final state — do not animate.
- The hero frame sequence is not loaded on mobile. A static fallback image is used instead. Shipping megabytes of frames over mobile data is a correctness failure, not a missed optimisation.

### Accessibility and performance

- Visible keyboard focus everywhere
- Semantic landmarks and heading order
- Targets: Lighthouse performance ≥ 90, accessibility 100
- No console errors on load

---

## 9. Rules for AI assistants in this repo

1. **Ask before restructuring.** Proposing a different architecture is welcome; silently implementing one is not.
2. **Never commit or push.** Stage nothing. The developer reviews every diff.
3. **Never write real secrets into any file ending `.example`.**
4. **Never hardcode copy, images, links or prices** in the frontend. If content is needed, it comes from the CMS or is added to the CMS.
5. **Do not disable a lint rule to make code pass.** Fix the code.
6. **Do not add dependencies without saying so and why.**
7. **Flag uncertainty.** If a version, API or config is uncertain, say so rather than guessing confidently.
8. **Prefer small diffs.** One concern per change.
9. Anything generated here will have to be explained line by line in a live interview. Favour clear, conventional code over clever code.

---

## 10. Current status

**Phase:** repository created, cloned, not yet scaffolded.

**Next step:** scaffold the monorepo — Docker Postgres, Strapi in `cms/`, Next.js in `web/`, folder structure, env validation, lint boundaries. No UI work yet.

Update this section as the project progresses.
