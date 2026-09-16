# NŌTA Homepage Rebuild

A CMS-driven rebuild of the [NŌTA](https://nota.uprock.pro/) homepage, built for the
Surge Global Senior Web Developer assignment.

Every piece of content on the page — copy, images, links, pricing, navigation and SEO
meta — is managed in Strapi. Publishing a change updates the live site with no code
deploy.

| | |
|---|---|
| **Live site** | https://supportive-truth-production-dbd9.up.railway.app |
| **Strapi admin** | https://nota-homepage-rebuild-production.up.railway.app/admin |
| **Hosting** | Railway — three services (Postgres, Strapi, Next.js) |

> The site carries a site-wide `noindex` tag. The design belongs to its original
> creators; this rebuild exists only for assessment.

---

## Contents

1. [Stack and why](#1-stack-and-why)
2. [Running locally](#2-running-locally)
3. [Content model](#3-content-model)
4. [Code architecture](#4-code-architecture)
5. [Infrastructure](#5-infrastructure)
6. [Trade-offs](#6-trade-offs)
7. [What I would improve with more time](#7-what-i-would-improve-with-more-time)
8. [AI tools used](#8-ai-tools-used)

---

## 1. Stack and why

| Concern | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript strict |
| Styling | CSS Modules + design tokens as CSS custom properties |
| Animation | GSAP 3 + ScrollTrigger, Lenis for smooth scrolling |
| Forms | react-hook-form + Zod |
| CMS | Strapi v5 (self-hosted, TypeScript) |
| Database | PostgreSQL — Docker locally, Railway Postgres in production |
| Media storage | Railway persistent volume mounted at Strapi's uploads path |
| Hosting | Railway |
| Node | 20 LTS |

### Next.js

Two requirements in the brief drove this choice.

**"Nothing hardcoded"** means the CMS is the source of truth, and its credentials must
never reach the browser. React Server Components fetch content on the server, so the
Strapi URL and token stay server-side by construction rather than by discipline.

**"Publishing updates the live site without a code deploy"** is exactly what Next.js's
tagged cache plus on-demand revalidation is designed for. Every CMS read is tagged; a
Strapi webhook clears those tags on publish. The page is statically fast but never
stale.

Next.js also provides `next/image` — responsive sizing and modern formats for a
heavily image-led design — and route handlers for the form endpoint, without adding a
separate server.

### GSAP + ScrollTrigger over Framer Motion

The reference is not a site with entrance animations; it is a site where scroll
position *is* the animation timeline. Sections pin in place while their contents move,
the hero scrubs a 75-frame image sequence, and curtains climb in a staggered sequence.

ScrollTrigger's `pin` and `scrub` are the mature tools for precisely that. Framer
Motion can animate on scroll, but reproducing pinned, scrubbed, reversible timelines
with it means rebuilding what ScrollTrigger already does well.

### CSS Modules over a utility framework

This is a bespoke design, not a component-kit layout. The hard parts are pinned,
sticky, scroll-driven sections where a rule's *context* matters as much as its value —
easier to read, diff and debug in a stylesheet than in a long class string. Design
tokens live as CSS custom properties in `web/src/styles/tokens.css`, so spacing,
colour and type scale are defined once.

### Strapi v5

Required by the brief. Worth noting for anyone reading the code: v5 flattens the
response (no `data.attributes`), replaces `id` with `documentId`, and requires `on`
fragments to populate a Dynamic Zone — `populate: '*'` throws rather than degrading.
Most Strapi material online targets v4 and does not apply.

---

## 2. Running locally

### Prerequisites

- Node.js 20 LTS (see `.nvmrc`)
- Docker (for local Postgres)

### Install

```bash
npm install --prefix cms
npm install --prefix web
```

### Environment

Copy both example files and fill them in:

```bash
cp cms/.env.example cms/.env
cp web/.env.example web/.env.local
```

`cms/.env` needs Strapi's secrets: `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`,
`TRANSFER_TOKEN_SALT`, `JWT_SECRET` and `ENCRYPTION_KEY`. Any sufficiently random
strings work locally — generate one per variable with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

The database defaults in `cms/.env.example` already match the Docker Compose service,
so they need no edits.

### Run

```bash
npm run db:up    # start local Postgres
npm run dev      # run Strapi and Next.js together
```

- Strapi admin — http://localhost:1337/admin (create the first admin user on first run)
- Frontend — http://localhost:3000

A fresh database contains no content. Create the Homepage single type in Strapi, add
sections to its Dynamic Zone, and publish.

### Other scripts

| Script | Does |
|---|---|
| `npm run cms` | Strapi only |
| `npm run web` | Next.js only |
| `npm run db:down` | Stop Postgres |
| `npm run db:reset` | Wipe and restart Postgres (destroys local data) |

### Repository layout

```
nota-homepage-rebuild/
├── docker-compose.yml       Local Postgres
├── package.json             Workspace scripts only
├── cms/                     Strapi v5
│   ├── src/api/             Content types — committed
│   ├── src/components/      Components — committed
│   └── public/uploads/      Media — gitignored, volume-backed in production
└── web/                     Next.js 15
    └── src/{app,sections,shared,lib,domain,styles}
```

`cms/` and `web/` are separate npm projects rather than npm workspaces — they deploy
as two independent Railway services, and keeping their dependency trees separate keeps
each build small.

**Schemas are code; content is data.** Strapi's Content-Type Builder is disabled when
`NODE_ENV=production`, so all modelling is done locally and shipped by pushing schema
files. Content itself lives in the database and does not travel through git.

---

## 3. Content model

The guiding principle: model for the **editor**, not for the database. Discrete
components and repeatable items — never one large rich-text field standing in for a
designed section.

### Shape

One **Homepage** single type holds a **Dynamic Zone** of section components. Adding,
removing or reordering a section in that zone changes the live page, in that order,
with no developer involved.

```
Homepage (single type, Draft & Publish on)
├── seo         → shared.seo
└── sections    → Dynamic Zone, 7 available section components
```

### Section components

| Component | Contents |
|---|---|
| `sections.hero` | Two-line headline, scroll sequence base path + frame count, mobile fallback image, order button (label, product, price) |
| `sections.specs` | Eyebrow, heading, pen image, exactly 3 × `shared.spec-group` |
| `sections.who` | Manifesto statement, intro, sticky label, repeatable `shared.persona`, looping video |
| `sections.paper` | Two-part heading, 2–6 × `shared.paper-slide` |
| `sections.inside-box` | Heading, description, 1–6 × `shared.box-item` |
| `sections.details` | 1–8 × `shared.detail-card`, plus one looping background video |
| `sections.color-variants` | 1–8 × `shared.color-variant`, carousel-ordered |

### Shared components

`shared.seo`, `shared.nav-item`, `shared.spec-group`, `shared.spec-item`,
`shared.persona`, `shared.paper-slide`, `shared.box-item`, `shared.detail-card`,
`shared.color-variant`, `shared.credit-link`

### Other content types

| Type | Kind | Purpose |
|---|---|---|
| `Navigation` | Single | Wordmark, links, order button, mobile menu image |
| `Footer` | Single | Description, credit, copyright, year, nav links, credit links, made-in logo |
| `Order Popup` | Single | Copy for the email capture dialog |
| `Submission` | Collection | Email addresses captured by the form |

### Editor experience

These were treated as features of the deliverable, not afterthoughts:

- **Every string field has `required` and a sensible `maxLength`** — an editor should
  not be able to break the layout by pasting an essay into a headline.
- **Alt text is required on all media.** Strapi cannot make Media Library alt text
  mandatory, so every media field is paired with its own required `*_alt` string
  field. That is how the rule is actually enforced rather than merely intended.
- **Every component has a distinct icon and a readable display name**, so the Dynamic
  Zone picker reads as a list of page sections rather than a list of slugs.
- **Field descriptions are written for a non-technical editor** — what the field does
  on the page, not what type it is.
- **Draft & Publish is enabled on `Homepage`** and deliberately off everywhere else.
  Navigation and footer are structural; a half-published navigation is not a state
  worth supporting.
- **`noIndex` defaults to `true`** on the SEO component.
- **API permissions are granted in code**, not clicked in the admin
  (`cms/src/index.ts`). Strapi stores permissions in the database, so on a fresh
  deploy they would otherwise have to be reapplied by hand and could drift silently
  between environments. The rule that matters: the public may **create** a Submission
  and nothing else — it can never read submissions back.

### Forms

The order popup captures an email address. It validates in the browser with
react-hook-form and Zod, posts to a Next.js route handler, and is validated **again**
on the server with the same schema before Strapi is written to. The shared schema
(`web/src/shared/lib/submission-schema.ts`) means the client and server checks cannot
drift, and the server check is not redundant — anyone can POST directly to the route.

`source` is set server-side rather than read from the request body: it exists to tell
entries apart if more forms are added later, and a value the caller controls would be
worthless for that.

---

## 4. Code architecture

Three layers, with dependencies pointing inward only.

```
PRESENTATION   shared/ui (primitives)  +  sections/ (page sections)
      │
COMPOSITION    Section Registry — maps CMS component names to React components
      │
DATA / DOMAIN  CMS client behind a boundary, DTO → domain mappers
```

### Presentation

Atomic Design *principles*, two tiers, no atoms/molecules/organisms folders:

- `src/shared/ui/` — design-system primitives. No business logic, no CMS knowledge.
- `src/sections/` — one folder per homepage section, each mapping 1:1 to a CMS
  component and each self-contained: markup, CSS module, animation hook, local types.

### The Section Registry

The CMS returns an ordered array of section components. A registry object maps each
`__component` string to a React component, and a renderer walks the array in order.

An unknown component name renders `null` and logs a warning in development — it never
crashes the page. If an editor adds a section the frontend does not yet know about,
the rest of the page still renders.

This is what makes the page genuinely CMS-driven rather than CMS-decorated.

### Data boundary

Strapi's response shape must never reach a component.

| File | Responsibility |
|---|---|
| `src/lib/cms/client.ts` | The only file that knows Strapi exists |
| `src/lib/cms/queries.ts` | Populate queries, centralised |
| `src/lib/cms/mappers.ts` | DTO → domain model |
| `src/domain/` | Framework-free types |

Test of correctness: swapping Strapi for another CMS should change those files and
zero components.

This is **enforced, not merely documented**. `eslint.config.mjs` uses
`no-restricted-imports` to fail the build if `sections/` or `shared/` imports the CMS
client directly, or if `domain/` imports from `lib/`, `sections/` or `shared/` — the
dependency direction that would quietly undo the whole arrangement.

### Animation conventions

- Every GSAP timeline is created inside `gsap.context()` and reverted on unmount.
  React StrictMode double-mounts in development; without this you get duplicated pin
  spacers and a silently broken layout.
- Every animation is gated on `prefers-reduced-motion`. When reduced, the final state
  renders — nothing animates.
- The hero frame sequence does not load on mobile; a static CMS-managed fallback image
  is used instead. Shipping megabytes of frames over mobile data is a correctness
  failure, not a missed optimisation.

---

## 5. Infrastructure

Three Railway services, deployed from `main`.

```
┌────────────┐      ┌───────────────┐      ┌──────────────┐
│  Postgres  │◄─────│    Strapi     │◄─────│   Next.js    │
│  (managed) │      │   + volume    │      │  (frontend)  │
└────────────┘      └───────────────┘      └──────────────┘
                            ▲                      │
                            └─── publish webhook ──┘
```

| Service | Root dir | Notes |
|---|---|---|
| `postgres` | — | Railway managed Postgres |
| `strapi` | `cms/` | Nixpacks build, persistent volume at the uploads path |
| `frontend` | `web/` | Nixpacks build, Next.js server |

Both application services carry a `railway.json` declaring the Nixpacks builder, the
start command, and an on-failure restart policy with a retry ceiling.

### Media survives redeploys

Railway containers are ephemeral — a new deploy replaces the filesystem. Strapi's
local upload provider writes to `cms/public/uploads`, so a **persistent volume is
mounted there**. Without it, every editor upload would vanish on the next deploy.

### Database connection

Strapi reads Railway's Postgres credentials by **service reference**, not by copied
values, so a rotated password does not break the deployment. Railway's managed
Postgres presents a certificate that Node's default trust store will not validate, so
the connection enables SSL with `rejectUnauthorized: false` rather than failing
outright.

### Variables, and what stays private

`STRAPI_URL` is server-side only — read by React Server Components and never shipped
to the browser. `NEXT_PUBLIC_STRAPI_MEDIA_URL` is deliberately separate and
deliberately public: images are fetched by the visitor's browser directly from Strapi,
so that one address has to be publicly reachable. `CORS_ORIGINS` on Strapi is pinned
to the frontend's origin.

### Publish without a deploy

1. An editor presses **Publish** in Strapi.
2. Strapi fires a webhook at `POST /api/revalidate?secret=…` on the frontend.
3. The route verifies the shared secret, then revalidates the page.
4. The next visitor is served the new content.

The secret is not decoration: without it, the endpoint is an open invitation to clear
the cache in a loop.

---

## 6. Trade-offs

### The hero frame sequence lives in the repo, not the Media Library

The brief requires that no content be hardcoded. The hero's 75 WebP animation frames
are the one deliberate exception: they live in `web/public/sequence/` rather than
Strapi's Media Library.

Storing 75 individual frames in a media library is impractical — it would bury an
editor in near-identical thumbnails and make swapping the animation a 75-upload
operation. Treating a scroll-scrubbed sequence as a build asset is standard practice.

What *is* managed in Strapi is how the sequence is addressed:
`sections.hero.sequence_base_path` and `sections.hero.sequence_frame_count`. An editor
can repoint the animation or change its length without a code change, and the mobile
fallback image is a normal Media Library upload.

Being precise about the limit of that: pointing `sequence_base_path` at a new folder
only works if a developer has put frames there, so this is configurability of the
*reference*, not editor-owned replacement of the asset. With more time these frames
would be replaced by a single Lottie JSON uploaded to Strapi, which would close the
gap entirely — one file is perfectly reasonable to hold in a media library.

### The NŌTA logo, mark, and mobile-menu burger icon are code, not content

The three brand-identity SVGs (`shared/ui/NotaLogo`, `shared/ui/NotaMark`, and the
3×3 dot grid that opens the mobile menu) are hardcoded — the other deliberate
exception, and a narrower one than the hero frames.

The reasoning differs from the frame-sequence case: this is not about the Media
Library being impractical for the volume, it is that a brand's own wordmark and mark
are not editorial content in the way a headline or a product photo is. They sit in the
same category as a favicon — something a developer changes during a rebrand, not
something a content editor swaps week to week. `logo_text` remains in the Navigation
type as the accessible name.

`mobile_menu_image` — the product photo behind the mobile menu's order pill — is the
opposite case, and is a normal Media Library upload: it is a product photograph, which
is exactly the kind of asset an editor should be able to replace.

### Railway volume over object storage

Object storage (S3, Cloudinary) is the correct production answer: it survives the loss
of any single machine, scales independently, and puts a CDN in front of media.

A volume was chosen deliberately, because the brief assesses **Railway setup** and a
mounted volume demonstrates understanding of container storage — the reason uploads
would otherwise disappear. It satisfies the "media survives a redeploy" requirement
with infrastructure rather than a third-party service. The limitation is stated rather
than hidden: it is machine-bound, and object storage is the first thing I would change
for real production traffic.

### Ports and adapters, simplified

A textbook implementation would define a formal `port.ts` interface with the CMS
client as one adapter behind it. This project does not: with exactly one CMS and a
fixed timeline, the indirection would cost more than it returns.

The isolation guarantee that actually matters — nothing outside `lib/cms/` knows
Strapi's response shape — is enforced by the ESLint import boundaries described above.
That preserves the property the interface would have protected, without the ceremony.

---

## 7. What I would improve with more time

**Move media to object storage.** Swap Strapi's local upload provider for S3 or
Cloudinary. Removes the volume's single-machine limitation and puts media behind a CDN.

**Automated tests.** There are none, and that is the largest gap in this submission.
The highest-value targets are the DTO → domain mappers (pure functions, trivial to
test, and the exact place a CMS schema change breaks the site silently) and a
Playwright smoke test asserting that every section renders and the form round-trips
into Strapi.

**Visual regression testing for the animations.** The scroll-driven sections are the
most fragile part of the build and the hardest to verify by eye. Screenshot comparison
at fixed scroll offsets would catch regressions a type checker cannot see.

**Granular cache invalidation.** The revalidate webhook currently refreshes the whole
homepage. Reading the model name from the webhook payload and clearing only that cache
tag would be more precise, and would matter considerably more on a site with many
pages.

**Scripted Content Manager view configuration.** Strapi stores admin field ordering
and editor-facing descriptions in the database, not in schema files, so they do not
travel through git and must be set per environment. Scripting this against the
configuration store would make the editor experience fully reproducible on a fresh
deploy, as the API permissions already are.

**A staging environment.** Railway environments would allow schema and content changes
to be rehearsed before they reach production.

**A Lighthouse budget in CI.** Performance and accessibility targets are currently
verified manually; they should fail a pull request instead.

---

## 8. AI tools used

AI was used throughout, as an accelerator under review — not as an author. Every line
in this repository was read, understood and, where necessary, corrected before being
committed. The git history (165 commits across short-lived feature branches, merged by
pull request) reflects that working method.

### Claude (Claude Code)

Used as a pair-programming assistant in the terminal and IDE, primarily for:

- **Reverse-engineering the reference's scroll behaviour.** The reference's animation
  configuration was inspected to recover exact keyframe windows, stagger steps and
  easing curves for the pinned sections, rather than eyeballing approximations. Where
  an exact value could not be recovered, it is marked as an approximation in the code
  comments rather than presented as fact.
- **Scaffolding sections** — component, CSS module and animation hook — against the
  existing conventions, then reviewing and adjusting the result.
- **Debugging layout and animation problems**, including a case where `overflow-x:
  hidden` on `html`/`body` was silently disabling every `position: sticky` descendant,
  and a ScrollTrigger pin-spacer measurement issue that required moving from
  ScrollTrigger pinning to CSS sticky cameras.
- **Strapi v5 specifics**, particularly Dynamic Zone population, where most available
  documentation targets v4 and does not work.
- **Drafting documentation**, including this README, from the actual state of the
  repository.

### Antigravity

Used as an agentic coding environment for broader, multi-file implementation passes —
building sections out from the content model, wiring components to CMS data, and
iterating on responsive behaviour across breakpoints.

### How the output was verified

AI-generated code was treated as a first draft, not a result:

- TypeScript strict mode and ESLint — including the architecture boundary rules — run
  on every change. No lint rule was disabled to make code pass.
- Scroll-driven sections were verified in a real browser at multiple viewport widths
  and against `prefers-reduced-motion`, not assumed correct from the diff.
- Animation values taken from the reference were checked against its actual
  configuration rather than accepted as plausible-looking numbers.
- Every change went through a pull request and was reviewed before merge.
