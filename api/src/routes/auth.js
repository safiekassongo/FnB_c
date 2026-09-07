// routes/auth.js
//
// A single endpoint the admin app's login screen calls to check whether
// a token is actually valid before showing the dashboard — rather than
// blindly trusting whatever the user typed in (which is what the old
// inline "Publisher sign-in" boxes on public pages did).

const express = require('express');
const { requirePublisher } = require('../auth');

const router = express.Router();

// GET /auth/verify — requires a valid publisher token. Returns 200 if
// valid, 401 if not (via requirePublisher). No body needed.
router.get('/verify', requirePublisher, (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
