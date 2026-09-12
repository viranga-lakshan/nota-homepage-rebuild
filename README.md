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
