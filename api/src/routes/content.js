// routes/content.js
//
// Whole-page content, stored as one JSON document per page. This is what
// lets every page (home, roadmap, services, about) pull its content from
// the database instead of being hardcoded HTML — the frontend fetches
// GET /content/:page on load and renders from the JSON it gets back.
//
// GET  /content/:page          public — anyone can view published content
// PUT  /content/:page          publisher only — replaces the page's JSON
// GET  /content                public — lists all known pages + their data
//                                (handy for a single-request site load)

const express = require('express');
const db = require('../db');
const { requirePublisher } = require('../auth');

const router = express.Router();

// Only these page keys are valid — prevents typos silently creating junk
// rows and gives you one place to see what's editable.
const ALLOWED_PAGES = ['global', 'home', 'roadmap', 'services', 'about'];

const MAX_BYTES = 500 * 1024; // 500KB per page document is generous headroom

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT page, data, updated_at FROM content').all();
  const out = {};
  for (const row of rows) {
    try { out[row.page] = JSON.parse(row.data); } catch { /* skip malformed */ }
  }
  res.json(out);
});

router.get('/:page', (req, res) => {
  const { page } = req.params;
  if (!ALLOWED_PAGES.includes(page)) return res.status(404).json({ error: 'Unknown page' });

  const row = db.prepare('SELECT data, updated_at FROM content WHERE page = ?').get(page);
  if (!row) return res.status(404).json({ error: 'No content set for this page yet' });

  try {
    res.json({ page, data: JSON.parse(row.data), updated_at: row.updated_at });
  } catch {
    res.status(500).json({ error: 'Stored content is corrupted' });
  }
});

router.put('/:page', requirePublisher, (req, res) => {
  const { page } = req.params;
  if (!ALLOWED_PAGES.includes(page)) {
    return res.status(404).json({ error: 'Unknown page. Allowed: ' + ALLOWED_PAGES.join(', ') });
  }

  const body = req.body;
  if (body === undefined || body === null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  const serialized = JSON.stringify(body);
  if (Buffer.byteLength(serialized, 'utf8') > MAX_BYTES) {
    return res.status(413).json({ error: 'Content too large (max 500KB per page)' });
  }

  db.prepare(`
    INSERT INTO content (page, data, updated_at)
    VALUES (@page, @data, datetime('now'))
    ON CONFLICT(page) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
  `).run({ page, data: serialized });

  res.json({ page, data: body });
});

module.exports = router;
