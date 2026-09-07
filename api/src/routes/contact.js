// routes/contact.js
//
// The one resource in this API with the access pattern flipped: anyone
// can POST (submit an inquiry), but only publishers can GET (read the
// inbox) or DELETE. Every other resource here is public-read /
// publisher-write — this one is public-write / publisher-read.

const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requirePublisher } = require('../auth');
const { validateContact } = require('../validate');

const router = express.Router();

// POST /contact — public. Anyone can submit an inquiry.
router.post('/', (req, res) => {
  // Honeypot: a hidden field real users never fill in. Bots that
  // auto-fill every field will trip it. Silently pretend success so we
  // don't teach spam bots that this field matters.
  if (req.body && req.body.company) {
    return res.status(201).json({ ok: true });
  }

  const { ok, errors, clean } = validateContact(req.body);
  if (!ok) return res.status(400).json({ error: 'Invalid submission', details: errors });

  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO contact_messages (id, name, email, phone, topic, message, status)
    VALUES (@id, @name, @email, @phone, @topic, @message, 'new')
  `).run({ id, ...clean });

  res.status(201).json({ ok: true, id });
});

// GET /contact — publisher only. The inbox.
router.get('/', requirePublisher, (req, res) => {
  const rows = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  res.json(rows);
});

// PATCH /contact/:id — publisher only. Mark as read/archived etc.
router.patch('/:id', requirePublisher, (req, res) => {
  const status = (req.body && req.body.status || '').trim();
  const allowed = ['new', 'read', 'archived'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'status must be one of: ' + allowed.join(', ') });
  }
  const result = db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

// DELETE /contact/:id — publisher only.
router.delete('/:id', requirePublisher, (req, res) => {
  const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
