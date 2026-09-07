// app.js — Express app setup, separate from server.js so it can be
// imported by tests without actually binding a port.
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const newsRoutes = require('./routes/news');
const researchRoutes = require('./routes/research');
const contentRoutes = require('./routes/content');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '200kb' }));

// CORS: restrict to the origins your site is actually served from.
// Set ALLOWED_ORIGINS="https://yoursite.com,https://www.yoursite.com"
// Leave unset only for local testing — it will allow any origin, which
// you do not want in production.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}));

// Basic abuse protection. Writes are limited more tightly than reads.
const readLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
// Contact form is public-write, so it gets its own, tighter limit to
// discourage spam floods from a single source.
const contactLimiter = rateLimit({ windowMs: 60 * 1000, max: 5 });

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/news', readLimiter, (req, res, next) => {
  if (req.method === 'POST' || req.method === 'DELETE') return writeLimiter(req, res, next);
  next();
}, newsRoutes);

app.use('/research', readLimiter, (req, res, next) => {
  if (req.method === 'POST' || req.method === 'DELETE') return writeLimiter(req, res, next);
  next();
}, researchRoutes);

app.use('/content', readLimiter, (req, res, next) => {
  if (req.method === 'PUT') return writeLimiter(req, res, next);
  next();
}, contentRoutes);

app.use('/contact', (req, res, next) => {
  if (req.method === 'POST') return contactLimiter(req, res, next);
  if (req.method === 'GET') return readLimiter(req, res, next);
  return writeLimiter(req, res, next);
}, contactRoutes);

app.use('/auth', readLimiter, authRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Central error handler — keeps stack traces out of responses.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
