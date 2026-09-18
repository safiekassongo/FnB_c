// routes/research.js
const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requirePublisher } = require('../auth');
const { validateResearch } = require('../validate');

const router = express.Router();

// GET /research — public, no auth. Anyone can view published findings.
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM research ORDER BY date DESC, created_at DESC').all();
  res.json(rows);
});

// GET /research/:id — public. Powers the individual post detail page.
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM research WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// POST /research — publisher only.
router.post('/', requirePublisher, (req, res) => {
  const { ok, errors, clean } = validateResearch(req.body);
  if (!ok) return res.status(400).json({ error: 'Invalid payload', details: errors });

  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO research (id, title, ref, status, date, body)
    VALUES (@id, @title, @ref, @status, @date, @body)
  `).run({ id, ...clean });

  const created = db.prepare('SELECT * FROM research WHERE id = ?').get(id);
  res.status(201).json(created);
});

// DELETE /research/:id — publisher only.
router.delete('/:id', requirePublisher, (req, res) => {
  const result = db.prepare('DELETE FROM research WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
