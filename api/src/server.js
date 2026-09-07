// server.js — entrypoint. Loads env vars, then starts the HTTP server.
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`FnB API listening on port ${PORT}`);
  if (!process.env.PUBLISHER_TOKENS) {
    console.warn('WARNING: PUBLISHER_TOKENS is not set — publishing (POST/DELETE) is disabled until you set it.');
  }
});
