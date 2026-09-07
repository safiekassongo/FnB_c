# FnB — Forward in Business

Everything for the FnB site in one place. Every page's content — not just
News and Research — is pulled from a database at load time.

```
fnb-complete/
├── website/     Static shell (HTML/CSS/JS) — content is fetched at runtime, not hardcoded
└── api/         Backend — Node.js/Express + SQLite, serves content + News + Research
```

## How this is structured

**Public pages are read-only.** `index.html`, `roadmap.html`, `services.html`,
and `about.html` each fetch their content from the API (`GET /content/:page`)
and render it — no publish/edit controls anywhere on them. `news.html` and
`research.html` are the same idea applied to blog-style posts: a public list
that links out to `news-post.html?id=…` / `research-post.html?id=…` for the
full write-up. `contact.html` has a public submission form and nothing else.

**Publishing happens in a separate app: `website/admin/`.** A publisher signs
in at `admin/login.html` (which checks the token against `GET /auth/verify`
before letting them in), then manages everything from one dashboard
(`admin/index.html`): publish/delete News and Research posts, edit the JSON
behind Home/Roadmap/Services/About, and read/triage the Contact inbox. No
token, no dashboard access — enforced by the API, not just hidden UI.

If the API isn't configured yet or is briefly unreachable, the site falls
back to `website/content-defaults.js` — a static copy of the same
content — so a page is never blank or broken, it just isn't reading from
the live database in that moment.

Editing any of that content — or publishing News/Research, or reading the
Contact inbox — happens exclusively in `website/admin/`, never on the
public pages themselves.

## website/

Plain HTML/CSS/JS, no build step — host it anywhere that serves static
files (Netlify, GitHub Pages, S3, your own server).

Pages: `index.html`, `roadmap.html`, `research.html`, `services.html`,
`about.html`, `news.html`, `news-post.html`, `research-post.html`,
`contact.html` — plus the separate publisher app in `website/admin/`
(`login.html` and `index.html`).

The one file that connects it all to your backend:

**`website/site-config.js`** — set `BASE_URL` to wherever you deploy the
API. Until it's set, public pages run off `content-defaults.js` /
`sample-posts.js` (local preview mode), and the admin app won't be usable
at all (it has nothing to authenticate against).

## api/

Node.js/Express + SQLite. Two kinds of resources, same access pattern —
public reads, publisher-only writes:

- **News** and **Research** — lists of posts (`GET/POST/DELETE`)
- **Content** — one JSON document per page (`GET/PUT`), which is what the
  website's Home/Roadmap/Services/About pages actually render from
- **Contact** — the one resource with access flipped: anyone can submit
  (`POST /contact`), only publishers can read the inbox
  (`GET/PATCH/DELETE`)

See `api/README.md` for the full endpoint list, environment variables,
and deployment instructions (Render/Railway/Fly, Docker, or a plain VPS).

Quick start:

```bash
cd api
npm install
cp .env.example .env         # set PUBLISHER_TOKENS at minimum
node scripts/seed-content.js # populate Home/Roadmap/Services/About with FnB's real content
npm start
```

## Connecting them

**New to deploying?** See `DEPLOY.md` for a click-by-click walkthrough
(Render + Netlify, no command line needed, ~10 minutes).

Short version:

1. Deploy `api/` somewhere (see `api/README.md`), and run the seed script
   once against that deployment's database.
2. Set `ALLOWED_ORIGINS` on the API to your deployed website's domain.
3. Set `BASE_URL` in `website/site-config.js` to the API's deployed URL.
4. Give each publisher one of the tokens from the API's `PUBLISHER_TOKENS`
   — they sign in at `website/admin/login.html` and manage everything
   (News, Research, page content, the Contact inbox) from the dashboard.

That's the only wiring between the two folders — everything else in each
one is self-contained.
# FnB_c
