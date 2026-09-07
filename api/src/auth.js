// auth.js — protects POST/DELETE with a publisher token. GET routes never
// use this middleware, so listing news/research stays fully public.
//
// Tokens live in the PUBLISHER_TOKENS env var as a comma-separated list,
// e.g. PUBLISHER_TOKENS=frank-token-123,safi-token-456
// This lets you hand each publisher their own token and revoke one
// individually later (just remove it from the list and redeploy).

function getValidTokens() {
  return (process.env.PUBLISHER_TOKENS || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}

function requirePublisher(req, res, next) {
  const validTokens = getValidTokens();

  if (validTokens.length === 0) {
    // Fail safe: if no tokens are configured, refuse all writes rather
    // than silently allowing them.
    return res.status(500).json({
      error: 'Server misconfigured: no PUBLISHER_TOKENS set. Writes are disabled until this is configured.',
    });
  }

  const header = req.headers.authorization || '';
  const bearerMatch = header.match(/^Bearer\s+(.+)$/i);
  const token = bearerMatch ? bearerMatch[1].trim() : (req.headers['x-api-key'] || '').trim();

  if (!token || !validTokens.includes(token)) {
    return res.status(401).json({ error: 'Not authorised. Provide a valid publisher token.' });
  }

  next();
}

module.exports = { requirePublisher };
