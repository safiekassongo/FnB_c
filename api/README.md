# FnB API

Backend for the entire FnB website — every page's content, plus News and
Research. Same pattern everywhere: public reads, publisher-only writes.

```
GET    /news              public   -> [{ id, title, category, date, body, image, created_at }, ...]
POST   /news              publisher -> creates one, returns it (201)
DELETE /news/:id          publisher -> removes one (204)

GET    /research          public   -> [{ id, title, ref, status, date, body, created_at }, ...]
POST   /research          publisher -> creates one, returns it (201)
DELETE /research/:id      publisher -> removes one (204)

GET    /content           public   -> { home: {...}, roadmap: {...}, services: {...}, about: {...}, global: {...} }
GET    /content/:page     public   -> { page, data, updated_at }
PUT    /content/:page     publisher -> replaces that page's content, returns { page, data }

POST   /contact           public   -> submits an inquiry, returns { ok: true, id }
GET    /contact           publisher -> [{ id, name, email, phone, topic, message, status, created_at }, ...]
PATCH  /contact/:id       publisher -> updates status ('new' | 'read' | 'archived')
DELETE /contact/:id       publisher -> removes one (204)

GET    /health            public   -> { ok: true }
```

`:page` is one of `global`, `home`, `roadmap`, `services`, `about`.

### The one resource with access flipped: `/contact`

Every other resource here is public-read / publisher-write. Contact is the
opposite — **public-write / publisher-read** — because anyone should be
able to submit an inquiry, but only publishers should see the inbox.

It also has its own tighter rate limit (5/minute per source, vs 20/minute
for other writes) and a honeypot field (`company`) that real visitors
never see or fill in — submissions with it filled in are silently
accepted (so bots don't learn it matters) but never saved.

### What `/content` is for

Home, Roadmap, Services, and About no longer have their text/images
hardcoded into the website's HTML. Each page is one JSON document in the
`content` table, and the website fetches it on load (see
`website/content-render.js`). This is what makes "every page pulls from
the database" true, not just News and Research.

`global` holds site-wide bits used on every page — currently just contact
info (phone/location) shown in the footer.

Data is stored in a local SQLite file (via `better-sqlite3`) — no external
database service required. Swap it for Postgres/MySQL later by replacing
`src/db.js` and the route files; the HTTP contract above doesn't need to
change.

## How access control works

- `GET` routes have **no auth middleware** — anyone can read.
- `POST`/`DELETE`/`PUT` routes run through `requirePublisher` (`src/auth.js`),
  which checks the request's `Authorization: Bearer <token>` header
  against the `PUBLISHER_TOKENS` env var (comma-separated). Give each
  publisher their own token so you can revoke one individually later.
- If `PUBLISHER_TOKENS` is unset, writes are refused entirely (fails
  closed, not open).

This is what the website's `site-config.js` expects: it sends whatever
token a publisher types into the sign-in box (News/Research) or the
floating "Edit this page" button (Home/Roadmap/Services/About) as a
Bearer token. This API is what actually validates it.

## Seeding real content

The `content` table starts empty on a fresh database — `GET /content/home`
etc. will 404 until it's seeded. Populate it with FnB's actual page copy:

```bash
node scripts/seed-content.js
```

Safe to re-run any time; it overwrites each page's row with the same
baseline content. The website also ships a copy of this exact data in
`website/content-defaults.js` as an offline fallback, so pages never look
broken even before you've run the seed script or if the API is briefly
unreachable.

## Run it locally

```bash
npm install
cp .env.example .env
# edit .env — at minimum set PUBLISHER_TOKENS to something of your choosing
npm start
```

Generate a reasonable token:

```bash
node -e "console.log(require('crypto').randomUUID())"
```

Quick smoke test:

```bash
node scripts/seed-content.js   # populate Home/Roadmap/Services/About/global content
curl http://localhost:4000/health
curl http://localhost:4000/news
curl http://localhost:4000/content/home
curl -X POST http://localhost:4000/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title":"Hello","body":"First post","category":"Announcement","date":"2026-08-27"}'
```

## Deploying

Any host that runs a long-lived Node process works. Three easy options:

### Render / Railway / Fly.io (simplest)
1. Push this folder to a GitHub repo.
2. Create a new Web Service pointing at it. Build command `npm install`,
   start command `npm start`.
3. Set environment variables in the host's dashboard: `PUBLISHER_TOKENS`,
   `ALLOWED_ORIGINS` (your site's origin, e.g.
   `https://forwardinbusiness.co.tz`).
4. **Attach a persistent disk/volume** and set `DATABASE_PATH` to a path
   on it (e.g. `/data/fnb.db`). Without one, the SQLite file is wiped on
   every redeploy — most of these platforms have an "add a volume" option
   in the dashboard.

### Docker (any VPS)
```bash
docker build -t fnb-api .
docker volume create fnb_data
docker run -d \
  -p 4000:4000 \
  -v fnb_data:/app/data \
  -e PUBLISHER_TOKENS=your-token-here \
  -e ALLOWED_ORIGINS=https://forwardinbusiness.co.tz \
  fnb-api
```

### Plain VPS with pm2
```bash
npm install -g pm2
npm install
cp .env.example .env   # fill it in
pm2 start src/server.js --name fnb-api
pm2 save
```

## After deploying

Put the deployed URL into the site's `site-config.js`:

```js
window.FNB_CONFIG = {
  BASE_URL: 'https://your-deployed-api.example.com',
  AUTH: { type: 'bearer' },
  NEWS: { list: '/news', create: '/news', remove: (id) => `/news/${id}` },
  RESEARCH: { list: '/research', create: '/research', remove: (id) => `/research/${id}` },
};
```

Give each publisher one of the tokens from `PUBLISHER_TOKENS` to use in
the "Publisher sign-in" box on the News and Research pages.

## Notes / things to harden later if this grows

- Rate limiting is in-memory (`express-rate-limit` defaults) — fine for a
  single instance, won't share state across multiple instances. Swap to a
  Redis-backed store if you scale horizontally.
- No pagination on `GET /news` / `GET /research` — fine at dozens–hundreds
  of posts, worth adding `?limit=&offset=` if it grows much beyond that.
- Tokens are plain strings compared directly — fine for a small number of
  trusted publishers; move to hashed tokens or a proper auth provider
  (e.g. Auth0, Clerk) if the publisher list grows or turnover is frequent.
- CORS defaults to allow-all if `ALLOWED_ORIGINS` is unset — only convenient
  for local testing, set it explicitly in production.
