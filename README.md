# NŌTA Homepage Rebuild

CMS-driven rebuild of the NŌTA homepage. See [CLAUDE.md](./CLAUDE.md) for the
full brief, architecture, and content model — this file is intentionally
short and will grow as the project does.

## Prerequisites

- Node.js 20 LTS (see `.nvmrc`)
- Docker (for local Postgres)

## Install

```
npm install --prefix cms
npm install --prefix web
```

## Run

```
npm run db:up    # start local Postgres
npm run dev      # run Strapi + Next.js together
```

Strapi admin: http://localhost:1337/admin
Frontend: http://localhost:3000

## Other scripts

| Script | Does |
|---|---|
| `npm run cms` | Strapi only |
| `npm run web` | Next.js only |
| `npm run db:down` | stop Postgres |
| `npm run db:reset` | wipe and restart Postgres (destroys local data) |

## Trade-offs

### Hero frame sequence lives in the repo, not the Media Library

The brief requires that no content be hardcoded. The hero's 75 WebP
animation frames are the one deliberate exception: they live in
`web/public/sequence/` rather than Strapi's Media Library.

Storing 75 individual frames in a CMS media library is impractical — it
would bury an editor in near-identical thumbnails and make swapping the
animation a 75-upload operation. Treating a scroll-scrubbed sequence as a
build asset is standard practice.

What *is* managed in Strapi is how the sequence is addressed:
`sections.hero.sequence_base_path` and `sections.hero.sequence_frame_count`.
An editor can repoint the animation or change its length without a code
change, and the mobile fallback image is a normal Media Library upload.

Being precise about the limit of that: pointing `sequence_base_path` at a
new folder only works if a developer has put frames there, so this is
configurability of the *reference*, not editor-owned replacement of the
asset. With more time these frames would be replaced by a single Lottie
JSON uploaded to Strapi, which would close the gap entirely — one file is
perfectly reasonable to hold in a media library.

### The NŌTA logo, mark, and mobile-menu burger icon are code, not content

The three brand-identity SVGs (`shared/ui/NotaLogo`, `shared/ui/NotaMark`,
and the 3×3 dot grid that opens the mobile menu) are hardcoded — the one
other deliberate exception to "nothing hardcoded" in this project, and a
narrower one than the hero frames above.

The reasoning is different from the frame-sequence case: this isn't about
Strapi's Media Library being impractical for the volume, it's that a
brand's own wordmark and mark aren't editorial content in the way a
headline or a product photo is. They sit in the same category as a
favicon — something a developer changes during a rebrand, not something a
content editor swaps week to week. Strapi's Navigation content type still
carries `logo_image`, `nota_mark`, and their `*_alt` fields from an earlier
pass (`feat/navigation-mobile-menu-assets`) — those are now dead, unused
by the frontend, kept rather than removed only to avoid touching a merged
schema for a field that costs nothing sitting unused. `logo_text` also
stays as the accessible name/fallback string, even though the rendered
mark is the SVG component, not that text.

`mobile_menu_image` (the product photo behind the mobile menu's order
pill) is the opposite case, and is a normal Media Library upload: it's a
product photograph, which is exactly the kind of asset an editor should
be able to replace.

### Two sections are built simpler than the reference actually animates

The "Who it's for" and "Inside the box" sections are built to
`CLAUDE.md`'s own description (a sticky label with flowing content and a
grey-to-white text fill; a title fill and a grid of items) rather than
the reference's actual mechanism, which turns out to be considerably
more elaborate — confirmed by fetching its live CSS, not assumed:

- **Who** uses a sticky "camera" viewport, `180vh`-tall scroll-pinned
  text and video tracks, a video animated with 3D `perspective`/
  `transform-origin` (not a plain autoplaying loop), a
  horizontally-clipped reveal for the persona list, and its own
  dedicated curtain transition on entry.
- **Inside the box** wipes between a background image and a hover-state
  image per item using a 25-row "blinds" grid, not a simple reveal.

Both are real, deliberately scoped-down simplifications, not oversights.
Reproducing either with confidence from static CSS alone — with no way
to actually watch the reference animate — was judged too high-risk for
the time available: getting a scroll-driven 3D transform or a 25-part
wipe subtly wrong is worse than not attempting it, and a wrong-but-
confident copy is harder to justify in review than a stated, honest
simplification. What's built keeps every piece of content from the CMS
and the interaction CLAUDE.md itself documents (a fill effect, a sticky
label, a flowing layout); what's cut is the specific choreography beyond
what could be verified.
