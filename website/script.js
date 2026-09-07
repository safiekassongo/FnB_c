/* nav */
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ---------------- Dynamic UI wiring (re-runnable) ----------------
   Content on most pages is injected by content-render.js after a
   fetch, so this can't just run once at load - it needs to be callable
   again each time new DOM is inserted. Each piece marks the elements it
   has already wired (data-fnb-*) so calling this repeatedly is safe and
   never double-attaches listeners. */
window.fnbInitDynamicUI = function () {
  /* scroll reveal */
  const revealTargets = document.querySelectorAll('.reveal:not([data-fnb-reveal])');
  if (revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => { el.setAttribute('data-fnb-reveal', '1'); io.observe(el); });
  }

  /* animated stat counters */
  const counters = document.querySelectorAll('[data-count]:not([data-fnb-counted])');
  if (counters.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        countIO.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = prefix + val.toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = prefix + target.toFixed(decimals) + suffix;
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => { el.setAttribute('data-fnb-counted', '1'); countIO.observe(el); });
  }

  /* before/after compare slider */
  document.querySelectorAll('.compare:not([data-fnb-wired])').forEach(comp => {
    comp.setAttribute('data-fnb-wired', '1');
    const afterWrap = comp.querySelector('.after-wrap');
    const afterImg = comp.querySelector('.after-wrap img');
    const handle = comp.querySelector('.handle');
    let dragging = false;

    function setPos(pct) {
      pct = Math.max(2, Math.min(98, pct));
      afterWrap.style.width = pct + '%';
      handle.style.left = pct + '%';
      afterImg.style.setProperty('--cw', (100 / (pct / 100)) + '%');
      afterImg.style.width = (100 / (pct / 100)) + '%';
    }
    function posFromEvent(e) {
      const rect = comp.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    }
    setPos(50);

    comp.addEventListener('mousedown', (e) => { dragging = true; setPos(posFromEvent(e)); });
    window.addEventListener('mousemove', (e) => { if (dragging) setPos(posFromEvent(e)); });
    window.addEventListener('mouseup', () => dragging = false);

    comp.addEventListener('touchstart', (e) => { dragging = true; setPos(posFromEvent(e)); }, { passive: true });
    comp.addEventListener('touchmove', (e) => { if (dragging) setPos(posFromEvent(e)); }, { passive: true });
    comp.addEventListener('touchend', () => dragging = false);
  });

  /* draggable horizontal gallery */
  document.querySelectorAll('.gallery:not([data-fnb-wired])').forEach(gallery => {
    gallery.setAttribute('data-fnb-wired', '1');
    let isDown = false, startX, scrollLeft;
    gallery.addEventListener('mousedown', (e) => {
      isDown = true;
      gallery.classList.add('dragging');
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; gallery.classList.remove('dragging'); });
    gallery.addEventListener('mouseleave', () => { isDown = false; gallery.classList.remove('dragging'); });
    gallery.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      gallery.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  });
};

// Run once immediately for any static content already on the page
// (e.g. the nav, or pages that haven't been converted to dynamic content).
window.fnbInitDynamicUI();

/* shared helpers */
function fnbEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : str;
  return div.innerHTML;
}
function fnbFormatDate(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso || '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) { return iso || ''; }
}
function fnbExcerpt(text, maxLen) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '\u2026';
}

/* ---------------- News - public blog listing ---------------- */
(function () {
  const listEl = document.getElementById('newsList');
  if (!listEl) return; // not on the news page

  const cfg = window.FNB_CONFIG || { BASE_URL: '' };
  const apiConfigured = !!cfg.BASE_URL;
  const featuredEl = document.getElementById('newsFeatured');
  const bannerEl = document.getElementById('newsBanner');
  const countEl = document.getElementById('newsCount');
  const refreshBtn = document.getElementById('newsRefresh');

  if (bannerEl) {
    bannerEl.textContent = apiConfigured
      ? ''
      : 'No API configured yet - showing sample posts. Set BASE_URL in site-config.js to load real updates.';
    bannerEl.style.display = apiConfigured ? 'none' : 'block';
  }

  function cardHtml(item, big) {
    const href = 'news-post.html?id=' + encodeURIComponent(item.id);
    const excerpt = fnbExcerpt(item.body, big ? 220 : 110);
    if (big) {
      return `
        <a class="featured-story" href="${href}" data-id="${fnbEscapeHtml(item.id)}">
          ${item.image ? `<div class="featured-story-photo"><img src="${fnbEscapeHtml(item.image)}" alt="${fnbEscapeHtml(item.title)}" loading="lazy"></div>` : ''}
          <div class="featured-story-body">
            ${item.category ? `<span class="news-tag">${fnbEscapeHtml(item.category)}</span>` : ''}
            <h2>${fnbEscapeHtml(item.title)}</h2>
            <p>${fnbEscapeHtml(excerpt)}</p>
            <div class="news-card-foot">
              <span class="news-card-date mono">${fnbEscapeHtml(fnbFormatDate(item.date))}</span>
              <span class="read-more">Read more \u2192</span>
            </div>
          </div>
        </a>`;
    }
    return `
      <a class="news-card" href="${href}" data-id="${fnbEscapeHtml(item.id)}">
        ${item.image ? `<div class="news-card-photo"><img src="${fnbEscapeHtml(item.image)}" alt="${fnbEscapeHtml(item.title)}" loading="lazy"></div>` : ''}
        <div class="news-card-body">
          ${item.category ? `<span class="news-tag">${fnbEscapeHtml(item.category)}</span>` : ''}
          <h3>${fnbEscapeHtml(item.title)}</h3>
          <p>${fnbEscapeHtml(excerpt)}</p>
          <div class="news-card-foot">
            <span class="news-card-date mono">${fnbEscapeHtml(fnbFormatDate(item.date))}</span>
            <span class="read-more">Read more \u2192</span>
          </div>
        </div>
      </a>`;
  }

  function render(items) {
    if (!items.length) {
      if (featuredEl) featuredEl.innerHTML = '';
      listEl.innerHTML = '<div class="news-empty">No updates published yet.</div>';
      if (countEl) countEl.textContent = '0 posts';
      return;
    }
    items = items.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (countEl) countEl.textContent = items.length + (items.length === 1 ? ' post' : ' posts');
    const [first, ...rest] = items;
    if (featuredEl) featuredEl.innerHTML = cardHtml(first, true);
    listEl.innerHTML = rest.length
      ? rest.map(item => cardHtml(item, false)).join('')
      : '<div class="news-empty" style="grid-column:1/-1;">More updates will appear here as they\u2019re published.</div>';
  }

  async function load() {
    listEl.innerHTML = '<div class="news-loading">Loading posts\u2026</div>';
    try {
      if (!apiConfigured) {
        render((window.FNB_SAMPLE_NEWS || []));
        return;
      }
      const res = await fetch(cfg.BASE_URL + cfg.NEWS.list);
      if (!res.ok) throw new Error('Failed: ' + res.status);
      render(await res.json());
    } catch (e) {
      listEl.innerHTML = '<div class="news-empty">Couldn\u2019t load posts (' + fnbEscapeHtml(e.message) + ').</div>';
    }
  }

  if (refreshBtn) refreshBtn.addEventListener('click', load);
  load();
})();

/* ---------------- News - single post detail page ---------------- */
(function () {
  const root = document.getElementById('newsPost');
  if (!root) return; // not on the news-post page

  const cfg = window.FNB_CONFIG || { BASE_URL: '' };
  const apiConfigured = !!cfg.BASE_URL;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  async function load() {
    if (!id) { root.innerHTML = '<div class="news-empty">No post specified.</div>'; return; }
    root.innerHTML = '<div class="news-loading">Loading\u2026</div>';
    try {
      let item;
      if (!apiConfigured) {
        item = (window.FNB_SAMPLE_NEWS || []).find(p => p.id === id);
        if (!item) throw new Error('Not found in sample data');
      } else {
        const res = await fetch(cfg.BASE_URL + cfg.NEWS.item(id));
        if (res.status === 404) { root.innerHTML = '<div class="news-empty">This post could not be found. It may have been removed.</div>'; return; }
        if (!res.ok) throw new Error('Failed: ' + res.status);
        item = await res.json();
      }
      document.title = item.title + ' - FnB News';
      root.innerHTML = `
        <div class="post-head reveal">
          ${item.category ? `<span class="news-tag">${fnbEscapeHtml(item.category)}</span>` : ''}
          <h1>${fnbEscapeHtml(item.title)}</h1>
          <div class="post-meta mono">${fnbEscapeHtml(fnbFormatDate(item.date))}</div>
        </div>
        ${item.image ? `<div class="post-photo reveal"><img src="${fnbEscapeHtml(item.image)}" alt="${fnbEscapeHtml(item.title)}"></div>` : ''}
        <div class="post-body reveal">${fnbEscapeHtml(item.body).split(/\n{2,}/).map(p => `<p>${p}</p>`).join('')}</div>
        <a class="btn-ghost post-back" href="news.html">&larr; Back to all updates</a>
      `;
      window.fnbInitDynamicUI();
    } catch (e) {
      root.innerHTML = '<div class="news-empty">Couldn\u2019t load this post (' + fnbEscapeHtml(e.message) + ').</div>';
    }
  }
  load();
})();

/* ---------------- Research - public blog listing ---------------- */
(function () {
  const listEl = document.getElementById('researchList');
  if (!listEl) return; // not on the research page

  const cfg = window.FNB_CONFIG || { BASE_URL: '' };
  const apiConfigured = !!cfg.BASE_URL;
  const bannerEl = document.getElementById('researchBanner');
  const countEl = document.getElementById('researchCount');
  const refreshBtn = document.getElementById('researchRefresh');

  if (bannerEl) {
    bannerEl.textContent = apiConfigured
      ? ''
      : 'No API configured yet - showing sample findings. Set BASE_URL in site-config.js to load real reports.';
    bannerEl.style.display = apiConfigured ? 'none' : 'block';
  }

  function cardHtml(item) {
    const href = 'research-post.html?id=' + encodeURIComponent(item.id);
    return `
      <a class="dossier" href="${href}" data-id="${fnbEscapeHtml(item.id)}">
        <div class="dossier-body">
          <div class="ref mono">${fnbEscapeHtml(item.ref || 'REF')}</div>
          <h3>${fnbEscapeHtml(item.title)}</h3>
          <p>${fnbEscapeHtml(fnbExcerpt(item.body, 140))}</p>
          <div class="status"><span class="dot"></span>${fnbEscapeHtml(item.status || 'Published')}</div>
        </div>
      </a>`;
  }

  function render(items) {
    if (!items.length) {
      listEl.innerHTML = '<div class="news-empty">No reports published yet.</div>';
      if (countEl) countEl.textContent = '0 reports';
      return;
    }
    items = items.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (countEl) countEl.textContent = items.length + (items.length === 1 ? ' report' : ' reports');
    listEl.innerHTML = items.map(cardHtml).join('');
  }

  async function load() {
    listEl.innerHTML = '<div class="news-loading">Loading reports\u2026</div>';
    try {
      if (!apiConfigured) {
        render((window.FNB_SAMPLE_RESEARCH || []));
        return;
      }
      const res = await fetch(cfg.BASE_URL + cfg.RESEARCH.list);
      if (!res.ok) throw new Error('Failed: ' + res.status);
      render(await res.json());
    } catch (e) {
      listEl.innerHTML = '<div class="news-empty">Couldn\u2019t load reports (' + fnbEscapeHtml(e.message) + ').</div>';
    }
  }

  if (refreshBtn) refreshBtn.addEventListener('click', load);
  load();
})();

/* ---------------- Research - single finding detail page ---------------- */
(function () {
  const root = document.getElementById('researchPost');
  if (!root) return; // not on the research-post page

  const cfg = window.FNB_CONFIG || { BASE_URL: '' };
  const apiConfigured = !!cfg.BASE_URL;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  async function load() {
    if (!id) { root.innerHTML = '<div class="news-empty">No report specified.</div>'; return; }
    root.innerHTML = '<div class="news-loading">Loading\u2026</div>';
    try {
      let item;
      if (!apiConfigured) {
        item = (window.FNB_SAMPLE_RESEARCH || []).find(p => p.id === id);
        if (!item) throw new Error('Not found in sample data');
      } else {
        const res = await fetch(cfg.BASE_URL + cfg.RESEARCH.item(id));
        if (res.status === 404) { root.innerHTML = '<div class="news-empty">This report could not be found. It may have been removed.</div>'; return; }
        if (!res.ok) throw new Error('Failed: ' + res.status);
        item = await res.json();
      }
      document.title = item.title + ' - FnB Research';
      root.innerHTML = `
        <div class="post-head reveal">
          <span class="news-tag">${fnbEscapeHtml(item.ref || 'REF')}</span>
          <h1>${fnbEscapeHtml(item.title)}</h1>
          <div class="post-meta mono">${fnbEscapeHtml(fnbFormatDate(item.date))} &middot; ${fnbEscapeHtml(item.status || 'Published')}</div>
        </div>
        <div class="post-body reveal">${fnbEscapeHtml(item.body).split(/\n{2,}/).map(p => `<p>${p}</p>`).join('')}</div>
        <a class="btn-ghost post-back" href="research.html">&larr; Back to all research</a>
      `;
      window.fnbInitDynamicUI();
    } catch (e) {
      root.innerHTML = '<div class="news-empty">Couldn\u2019t load this report (' + fnbEscapeHtml(e.message) + ').</div>';
    }
  }
  load();
})();

/* ---------------- Contact page - public submission only ---------------- */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return; // not on the contact page

  const cfg = window.FNB_CONFIG || { BASE_URL: '' };
  const apiConfigured = !!cfg.BASE_URL;
  const statusEl = document.getElementById('contactStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.contact-submit');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const topic = form.topic.value;
    const message = form.message.value.trim();
    const company = form.company.value; // honeypot

    if (!name || !email || !message) {
      statusEl.textContent = 'Please fill in your name, email, and message.';
      statusEl.className = 'contact-status err';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    try {
      if (!apiConfigured) {
        await new Promise(r => setTimeout(r, 500));
        statusEl.textContent = 'No API configured yet (set BASE_URL in site-config.js) - this is a preview only, nothing was sent.';
        statusEl.className = 'contact-status err';
      } else {
        const res = await fetch(cfg.BASE_URL + cfg.CONTACT.submit, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, topic, message, company }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body.details && body.details.join(', ')) || body.error || ('Failed: ' + res.status));
        }
        statusEl.textContent = 'Message sent - we\u2019ll get back to you shortly.';
        statusEl.className = 'contact-status ok';
        form.reset();
      }
    } catch (err) {
      statusEl.textContent = 'Could not send (' + err.message + ').';
      statusEl.className = 'contact-status err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
})();
