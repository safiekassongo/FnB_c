// admin.js - the publisher dashboard. Everything here assumes a valid
// token is already in sessionStorage (login.html verified it via
// /auth/verify before redirecting here). Any 401/403 response from the
// API bounces back to login.html - the token may have been revoked.

(function () {
  const TOKEN_KEY = 'fnb_publisher_token';
  const cfg = window.FNB_CONFIG || { BASE_URL: '' };

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  }
  function clearTokenAndRedirect() {
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.href = 'login.html';
  }

  // Guard: no token at all -> straight back to login, no API call needed.
  if (!getToken()) {
    window.location.href = 'login.html';
    return;
  }
  if (!cfg.BASE_URL) {
    document.querySelector('.admin-main').innerHTML =
      '<div class="admin-empty">No API configured - set BASE_URL in site-config.js, then reload.</div>';
    return;
  }

  function authHeaders(json) {
    const token = getToken();
    const headers = {};
    if (json) headers['Content-Type'] = 'application/json';
    if (cfg.AUTH && cfg.AUTH.type === 'header') headers[cfg.AUTH.headerName || 'x-api-key'] = token;
    else headers['Authorization'] = 'Bearer ' + token;
    return headers;
  }

  async function api(method, path, body) {
    const res = await fetch(cfg.BASE_URL + path, {
      method,
      headers: authHeaders(!!body),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 || res.status === 403) {
      clearTokenAndRedirect();
      throw new Error('Not authorised');
    }
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data.details && data.details.join(', ')) || data.error || ('Request failed: ' + res.status));
    return data;
  }

  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }
  function formatDate(iso) {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso || '';
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return iso || ''; }
  }

  document.getElementById('whoami').textContent = 'Signed in \u00b7 publisher';

  /* ---------------- Sidebar / tab switching ---------------- */
  const navButtons = document.querySelectorAll('.admin-nav button[data-panel]');
  const panels = {
    news: document.getElementById('panel-news'),
    research: document.getElementById('panel-research'),
    pages: document.getElementById('panel-pages'),
    inbox: document.getElementById('panel-inbox'),
  };
  function showPanel(name) {
    Object.keys(panels).forEach(k => panels[k].classList.toggle('active', k === name));
    navButtons.forEach(b => b.classList.toggle('active', b.dataset.panel === name));
    document.getElementById('adminNav').classList.remove('open');
    if (name === 'inbox') loadInbox();
    if (name === 'pages') loadPageEditor(document.getElementById('pageSelect').value);
  }
  navButtons.forEach(btn => btn.addEventListener('click', () => showPanel(btn.dataset.panel)));

  const mobileToggle = document.getElementById('mobileNavToggle');
  if (mobileToggle) mobileToggle.addEventListener('click', () => document.getElementById('adminNav').classList.toggle('open'));

  document.getElementById('logoutBtn').addEventListener('click', clearTokenAndRedirect);

  /* ================= NEWS ================= */
  const newsForm = document.getElementById('newsForm');
  const newsFormStatus = document.getElementById('newsFormStatus');
  const newsAdminList = document.getElementById('newsAdminList');

  async function loadNewsAdmin() {
    newsAdminList.innerHTML = '<div class="admin-loading">Loading\u2026</div>';
    try {
      const items = await api('GET', '/news');
      document.getElementById('countNews').textContent = items.length;
      document.getElementById('newsListCount').textContent = items.length;
      if (!items.length) { newsAdminList.innerHTML = '<div class="admin-empty">No posts yet.</div>'; return; }
      items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      newsAdminList.innerHTML = `
        <table class="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Date</th><th></th></tr></thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td class="title-cell">${esc(item.title)}</td>
                <td><span class="admin-tag">${esc(item.category || '-')}</span></td>
                <td class="muted">${esc(formatDate(item.date))}</td>
                <td>
                  <div class="admin-row-actions">
                    <a href="../news-post.html?id=${encodeURIComponent(item.id)}" target="_blank">View</a>
                    <button class="danger" data-id="${esc(item.id)}">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      newsAdminList.querySelectorAll('button.danger').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this post? This cannot be undone.')) return;
          btn.disabled = true;
          try { await api('DELETE', '/news/' + encodeURIComponent(btn.dataset.id)); await loadNewsAdmin(); }
          catch (e) { alert(e.message); btn.disabled = false; }
        });
      });
    } catch (e) {
      newsAdminList.innerHTML = '<div class="admin-empty">Couldn\u2019t load posts (' + esc(e.message) + ').</div>';
    }
  }

  newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = newsForm.querySelector('button[type="submit"]');
    const payload = {
      title: newsForm.title.value.trim(),
      category: newsForm.category.value,
      date: newsForm.date.value || new Date().toISOString().slice(0, 10),
      body: newsForm.body.value.trim(),
      image: newsForm.image.value.trim(),
    };
    if (!payload.title || !payload.body) {
      newsFormStatus.textContent = 'Title and summary are required.';
      newsFormStatus.className = 'admin-status err';
      return;
    }
    btn.disabled = true; btn.textContent = 'Publishing\u2026';
    try {
      await api('POST', '/news', payload);
      newsFormStatus.textContent = 'Published.';
      newsFormStatus.className = 'admin-status ok';
      newsForm.reset();
      await loadNewsAdmin();
    } catch (e) {
      newsFormStatus.textContent = e.message;
      newsFormStatus.className = 'admin-status err';
    } finally {
      btn.disabled = false; btn.textContent = 'Publish update';
    }
  });

  /* ================= RESEARCH ================= */
  const researchForm = document.getElementById('researchForm');
  const researchFormStatus = document.getElementById('researchFormStatus');
  const researchAdminList = document.getElementById('researchAdminList');

  async function loadResearchAdmin() {
    researchAdminList.innerHTML = '<div class="admin-loading">Loading\u2026</div>';
    try {
      const items = await api('GET', '/research');
      document.getElementById('countResearch').textContent = items.length;
      document.getElementById('researchListCount').textContent = items.length;
      if (!items.length) { researchAdminList.innerHTML = '<div class="admin-empty">No reports yet.</div>'; return; }
      items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      researchAdminList.innerHTML = `
        <table class="admin-table">
          <thead><tr><th>Title</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td class="title-cell">${esc(item.title)}<div class="muted">${esc(item.ref || '')}</div></td>
                <td><span class="admin-tag">${esc(item.status || 'Published')}</span></td>
                <td class="muted">${esc(formatDate(item.date))}</td>
                <td>
                  <div class="admin-row-actions">
                    <a href="../research-post.html?id=${encodeURIComponent(item.id)}" target="_blank">View</a>
                    <button class="danger" data-id="${esc(item.id)}">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      researchAdminList.querySelectorAll('button.danger').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this report? This cannot be undone.')) return;
          btn.disabled = true;
          try { await api('DELETE', '/research/' + encodeURIComponent(btn.dataset.id)); await loadResearchAdmin(); }
          catch (e) { alert(e.message); btn.disabled = false; }
        });
      });
    } catch (e) {
      researchAdminList.innerHTML = '<div class="admin-empty">Couldn\u2019t load reports (' + esc(e.message) + ').</div>';
    }
  }

  researchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = researchForm.querySelector('button[type="submit"]');
    const payload = {
      title: researchForm.title.value.trim(),
      ref: researchForm.ref.value.trim(),
      status: researchForm.status.value,
      date: researchForm.date.value || new Date().toISOString().slice(0, 10),
      body: researchForm.body.value.trim(),
    };
    if (!payload.title || !payload.body) {
      researchFormStatus.textContent = 'Title and summary are required.';
      researchFormStatus.className = 'admin-status err';
      return;
    }
    btn.disabled = true; btn.textContent = 'Publishing\u2026';
    try {
      await api('POST', '/research', payload);
      researchFormStatus.textContent = 'Published.';
      researchFormStatus.className = 'admin-status ok';
      researchForm.reset();
      await loadResearchAdmin();
    } catch (e) {
      researchFormStatus.textContent = e.message;
      researchFormStatus.className = 'admin-status err';
    } finally {
      btn.disabled = false; btn.textContent = 'Publish report';
    }
  });

  /* ================= PAGE CONTENT ================= */
  const pageSelect = document.getElementById('pageSelect');
  const pageEditorWrap = document.getElementById('pageEditorWrap');
  const pageEditorTitle = document.getElementById('pageEditorTitle');
  const PAGE_LABELS = { home: 'Home', roadmap: 'Roadmap', services: 'Services', about: 'About', global: 'Global (footer contact info)' };

  async function loadPageEditor(page) {
    pageEditorTitle.textContent = 'Edit - ' + PAGE_LABELS[page];
    pageEditorWrap.innerHTML = '<div class="admin-loading">Loading\u2026</div>';
    try {
      const res = await api('GET', '/content/' + encodeURIComponent(page));
      pageEditorWrap.innerHTML = `
        <textarea class="admin-json-editor" id="pageJsonEditor">${esc(JSON.stringify(res.data, null, 2))}</textarea>
        <div style="margin-top:14px; display:flex; gap:10px; align-items:center;">
          <button class="admin-btn" id="pageSaveBtn">Save changes</button>
          <span id="pageSaveStatus" class="admin-status" style="margin:0;"></span>
        </div>
      `;
      document.getElementById('pageSaveBtn').addEventListener('click', async () => {
        const statusEl = document.getElementById('pageSaveStatus');
        const textarea = document.getElementById('pageJsonEditor');
        let parsed;
        try { parsed = JSON.parse(textarea.value); }
        catch (e) { statusEl.textContent = 'Invalid JSON: ' + e.message; statusEl.className = 'admin-status err'; return; }
        statusEl.textContent = 'Saving\u2026'; statusEl.className = 'admin-status';
        try {
          await api('PUT', '/content/' + encodeURIComponent(page), parsed);
          statusEl.textContent = 'Saved - live on the site now.';
          statusEl.className = 'admin-status ok';
        } catch (e) {
          statusEl.textContent = e.message;
          statusEl.className = 'admin-status err';
        }
      });
    } catch (e) {
      pageEditorWrap.innerHTML = '<div class="admin-empty">Couldn\u2019t load this page\u2019s content (' + esc(e.message) + '). It may not have been seeded yet.</div>';
    }
  }
  pageSelect.addEventListener('change', () => loadPageEditor(pageSelect.value));

  /* ================= INBOX ================= */
  const inboxAdminList = document.getElementById('inboxAdminList');

  async function loadInbox() {
    inboxAdminList.innerHTML = '<div class="admin-loading">Loading\u2026</div>';
    try {
      const items = await api('GET', '/contact');
      document.getElementById('countInbox').textContent = items.filter(i => i.status === 'new').length || items.length;
      if (!items.length) { inboxAdminList.innerHTML = '<div class="admin-empty">No messages yet.</div>'; return; }
      items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      inboxAdminList.innerHTML = items.map(item => `
        <div style="border-top:1px solid var(--line); padding:18px 0;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px; flex-wrap:wrap;">
            <div>
              <strong>${esc(item.name)}</strong> ${item.topic ? '&middot; ' + esc(item.topic) : ''}
              <div class="muted" style="font-size:12.5px; color:var(--blue);">${esc(item.email)}${item.phone ? ' &middot; ' + esc(item.phone) : ''}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="admin-tag ${item.status === 'new' ? 'new' : ''}">${esc(item.status)}</span>
              <span class="muted">${esc(formatDate(item.created_at))}</span>
            </div>
          </div>
          <p style="font-size:14px; color:var(--ink-soft); margin:10px 0 0;">${esc(item.message)}</p>
          <div class="admin-row-actions" style="margin-top:10px;">
            ${item.status !== 'read' ? `<button data-action="read" data-id="${esc(item.id)}">Mark read</button>` : ''}
            ${item.status !== 'archived' ? `<button data-action="archive" data-id="${esc(item.id)}">Archive</button>` : ''}
            <button class="danger" data-action="delete" data-id="${esc(item.id)}">Delete</button>
          </div>
        </div>
      `).join('');

      inboxAdminList.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id, action = btn.dataset.action;
          btn.disabled = true;
          try {
            if (action === 'delete') {
              if (!confirm('Delete this message?')) { btn.disabled = false; return; }
              await api('DELETE', '/contact/' + encodeURIComponent(id));
            } else {
              await api('PATCH', '/contact/' + encodeURIComponent(id), { status: action === 'read' ? 'read' : 'archived' });
            }
            await loadInbox();
          } catch (e) {
            alert(e.message);
            btn.disabled = false;
          }
        });
      });
    } catch (e) {
      inboxAdminList.innerHTML = '<div class="admin-empty">Couldn\u2019t load messages (' + esc(e.message) + ').</div>';
    }
  }
  document.getElementById('inboxRefreshBtn').addEventListener('click', loadInbox);

  /* ---------------- Initial load ---------------- */
  loadNewsAdmin();
  loadResearchAdmin();
  api('GET', '/contact').then(items => {
    document.getElementById('countInbox').textContent = items.filter(i => i.status === 'new').length;
  }).catch(() => {});
})();
