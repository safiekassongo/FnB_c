// ---------------------------------------------------------------
// FnB - API configuration
//
// Shared by the public website AND the admin app (admin/index.html).
// Point this at your own backend. Fill in BASE_URL - that's the
// only thing you should need to touch for a standard setup.
//
// ARCHITECTURE
//   - Public pages (index/roadmap/services/about/news/research/contact)
//     are read-only. They only ever call GET endpoints - no login box,
//     no publish/edit controls anywhere on them.
//   - All publishing (news, research, page content, contact inbox)
//     happens in the separate admin app at admin/index.html, which is
//     not linked from the main navigation. Publishers go there directly
//     and sign in with a token.
//
// SECURITY MODEL (important):
//   - GET endpoints are PUBLIC - no auth required.
//   - POST / PUT / PATCH / DELETE endpoints REQUIRE a valid publisher
//     token, checked on your server via the Authorization header. This
//     file only sends whatever token the admin app has on hand - it is
//     your API's job to accept or reject it. The admin app's login
//     screen calls GET /auth/verify to confirm a token is valid before
//     showing the dashboard, rather than assuming it works.
//
// REST contract (see api/README.md for the full list):
//   GET    /news, /research            public, list
//   GET    /news/:id, /research/:id    public, single item (blog detail page)
//   POST   /news, /research            publisher, create
//   DELETE /news/:id, /research/:id    publisher, remove
//   GET    /content/:page              public
//   PUT    /content/:page              publisher
//   POST   /contact                    public
//   GET/PATCH/DELETE /contact...       publisher
//   GET    /auth/verify                publisher (used by admin login)
// ---------------------------------------------------------------

window.FNB_CONFIG = {
  // Your API's base URL, no trailing slash. Leave empty ('') to run
  // in local preview mode - public pages fall back to bundled sample
  // content, and the admin app will show a clear "not connected" state.
  BASE_URL: 'http://localhost:4000',

  // How the publisher's token is sent on write requests.
  //   'bearer' -> sends 'Authorization: Bearer <token>'
  //   'header' -> sends a custom header, e.g. { 'x-api-key': '<token>' }
  AUTH: {
    type: 'bearer',
    headerName: 'x-api-key', // used only when type === 'header'
  },

  NEWS: {
    list: '/news',
    item: (id) => `/news/${encodeURIComponent(id)}`,
    create: '/news',
    remove: (id) => `/news/${encodeURIComponent(id)}`,
  },

  RESEARCH: {
    list: '/research',
    item: (id) => `/research/${encodeURIComponent(id)}`,
    create: '/research',
    remove: (id) => `/research/${encodeURIComponent(id)}`,
  },

  CONTACT: {
    submit: '/contact',
    list: '/contact',
    update: (id) => `/contact/${encodeURIComponent(id)}`,
    remove: (id) => `/contact/${encodeURIComponent(id)}`,
  },

  CONTENT: {
    get: (page) => `/content/${encodeURIComponent(page)}`,
    put: (page) => `/content/${encodeURIComponent(page)}`,
  },

  AUTH_VERIFY: '/auth/verify',
};
