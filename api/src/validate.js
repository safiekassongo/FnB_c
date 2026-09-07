// validate.js — small, dependency-free input validation.

const MAX_TITLE = 140;
const MAX_BODY = 2000;
const MAX_SHORT = 60;
const MAX_URL = 1000;

function isNonEmptyString(v, max) {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

function isValidDate(v) {
  if (typeof v !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(new Date(v).getTime());
}

function isValidUrl(v) {
  if (v === undefined || v === null || v === '') return true; // optional field
  if (typeof v !== 'string' || v.length > MAX_URL) return false;
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Validates a news post payload. Returns { ok, errors, clean } */
function validateNews(body) {
  const errors = [];
  const { title, category, date, body: content, image } = body || {};

  if (!isNonEmptyString(title, MAX_TITLE)) errors.push(`title is required (max ${MAX_TITLE} chars)`);
  if (category !== undefined && !isNonEmptyString(category, MAX_SHORT)) errors.push('category must be a short string');
  if (!isNonEmptyString(content, MAX_BODY)) errors.push(`body is required (max ${MAX_BODY} chars)`);
  if (date !== undefined && date !== '' && !isValidDate(date)) errors.push('date must be YYYY-MM-DD');
  if (!isValidUrl(image)) errors.push('image must be a valid http(s) URL');

  return {
    ok: errors.length === 0,
    errors,
    clean: {
      title: (title || '').trim(),
      category: (category || '').trim(),
      date: isValidDate(date) ? date : new Date().toISOString().slice(0, 10),
      body: (content || '').trim(),
      image: (image || '').trim(),
    },
  };
}

/** Validates a research report payload. Returns { ok, errors, clean } */
function validateResearch(body) {
  const errors = [];
  const { title, ref, status, date, body: content } = body || {};

  if (!isNonEmptyString(title, MAX_TITLE)) errors.push(`title is required (max ${MAX_TITLE} chars)`);
  if (ref !== undefined && !isNonEmptyString(ref, MAX_SHORT)) errors.push('ref must be a short string');
  if (status !== undefined && !isNonEmptyString(status, MAX_SHORT)) errors.push('status must be a short string');
  if (!isNonEmptyString(content, MAX_BODY)) errors.push(`body is required (max ${MAX_BODY} chars)`);
  if (date !== undefined && date !== '' && !isValidDate(date)) errors.push('date must be YYYY-MM-DD');

  return {
    ok: errors.length === 0,
    errors,
    clean: {
      title: (title || '').trim(),
      ref: (ref || '').trim(),
      status: (status || 'Published').trim(),
      date: isValidDate(date) ? date : new Date().toISOString().slice(0, 10),
      body: (content || '').trim(),
    },
  };
}

/** Validates a contact form submission. Returns { ok, errors, clean } */
function validateContact(body) {
  const errors = [];
  const { name, email, phone, topic, message } = body || {};
  const MAX_NAME = 120;
  const MAX_EMAIL = 200;
  const MAX_PHONE = 40;
  const MAX_TOPIC = 60;
  const MAX_MESSAGE = 3000;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!isNonEmptyString(name, MAX_NAME)) errors.push(`name is required (max ${MAX_NAME} chars)`);
  if (!isNonEmptyString(email, MAX_EMAIL) || !emailRe.test((email || '').trim())) errors.push('a valid email is required');
  if (phone !== undefined && phone !== '' && !isNonEmptyString(phone, MAX_PHONE)) errors.push('phone is too long');
  if (topic !== undefined && topic !== '' && !isNonEmptyString(topic, MAX_TOPIC)) errors.push('topic is too long');
  if (!isNonEmptyString(message, MAX_MESSAGE)) errors.push(`message is required (max ${MAX_MESSAGE} chars)`);

  return {
    ok: errors.length === 0,
    errors,
    clean: {
      name: (name || '').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      topic: (topic || '').trim(),
      message: (message || '').trim(),
    },
  };
}

module.exports = { validateNews, validateResearch, validateContact };
