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
