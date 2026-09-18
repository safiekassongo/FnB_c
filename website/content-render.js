// content-render.js
//
// Fetches each page's content from the API (GET /content/:page) and
// renders it into the page. Falls back to content-defaults.js if the API
// isn't configured or a request fails, so the site never shows broken or
// empty sections - it just prefers live data when available.
//
// This file is read-only. Editing page content happens in the separate
// admin app (admin/index.html), not here.

(function () {
  const cfg = window.FNB_CONFIG || { BASE_URL: '' };
  const apiConfigured = !!cfg.BASE_URL;

  async function fetchContent(page) {
    if (apiConfigured) {
      try {
        const res = await fetch(cfg.BASE_URL + '/content/' + encodeURIComponent(page));
        if (res.ok) {
          const json = await res.json();
          return { data: json.data, source: 'api' };
        }
      } catch (e) { /* fall through to defaults */ }
    }
    const defaults = window.FNB_DEFAULT_CONTENT || {};
    const fallback = defaults[page] || (page === 'home' ? defaults.global : undefined);
    return { data: fallback, source: 'default' };
  }

  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }

  function sourceBanner(source, page) {
    if (source === 'api') return '';
    const note = document.createElement('div');
    note.className = 'news-banner';
    note.style.marginBottom = '0';
    note.textContent = apiConfigured
      ? 'Showing fallback content - the API request for "' + page + '" didn\u2019t return data.'
      : 'Showing local preview content - set BASE_URL in site-config.js to load this page from your database.';
    return note;
  }

  /* ===================== Page renderers ===================== */

  async function renderGlobal() {
    const { data } = await fetchContent('global');
    if (!data) return;
    document.querySelectorAll('[data-global="phone"]').forEach(el => el.textContent = data.contact?.phone || '');
    document.querySelectorAll('[data-global="location"]').forEach(el => el.textContent = data.contact?.location || '');
    document.querySelectorAll('[data-global="tagline"]').forEach(el => el.textContent = data.brand?.tagline || '');
  }

  async function renderHome() {
    const root = document.getElementById('fnbHome');
    if (!root) return;
    const { data, source } = await fetchContent('home');
    if (!data) { root.innerHTML = '<div class="news-empty">No content set for this page yet.</div>'; return; }
    const d = data;

    root.innerHTML = `
      <section class="hero">
        <div class="wrap">
          <span class="eyebrow"><span class="dot"></span>${esc(d.hero.eyebrow)}</span>
          <h1>${esc(d.hero.title)}</h1>
          ${d.hero.subtitle ? `<p class="hero-subtitle">${esc(d.hero.subtitle)}</p>` : ''}
          <p class="hero-sub">${esc(d.hero.body)}</p>
          ${d.hero.badges ? `<div class="hero-badges">${d.hero.badges.map(b => `
            <span class="hero-badge"><svg class="ico" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${esc(b)}</span>
          `).join('')}</div>` : ''}
          <div class="hero-actions">
            <a class="btn-primary" href="${esc(d.hero.primaryCta.href)}">${esc(d.hero.primaryCta.label)}</a>
            <a class="btn-ghost" href="${esc(d.hero.secondaryCta.href)}">${esc(d.hero.secondaryCta.label)}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
        <div class="hero-photo reveal">
          <img src="${esc(d.hero.photo)}" alt="${esc(d.hero.title)}">
          <div class="hero-photo-cap"><span class="dot"></span>${esc(d.hero.photoCaption)}</div>
        </div>
      </section>

      <section class="stats">
        <div class="wrap">
          ${d.stats.map(s => `
            <div class="stat reveal"><div class="num" data-count="${esc(s.count)}"${s.suffix ? ` data-suffix="${esc(s.suffix)}"` : ''}${s.prefix ? ` data-prefix="${esc(s.prefix)}"` : ''}>0</div><div class="label">${esc(s.label)}</div></div>
          `).join('')}
        </div>
      </section>

      <section class="compare-section">
        <div class="wrap">
          <div class="section-head reveal">
            <span class="eyebrow"><span class="dot"></span>${esc(d.compare.eyebrow)}</span>
            <h2>${esc(d.compare.title)}</h2>
            <p>${esc(d.compare.body)}</p>
          </div>
          <div class="compare reveal">
            <img src="${esc(d.compare.before)}" alt="${esc(d.compare.beforeTag)}">
            <div class="after-wrap"><img src="${esc(d.compare.after)}" alt="${esc(d.compare.afterTag)}"></div>
            <span class="compare-tag left">${esc(d.compare.beforeTag)}</span>
            <span class="compare-tag right">${esc(d.compare.afterTag)}</span>
            <div class="handle"><div class="handle-grip">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 4L1 8L5 12M11 4L15 8L11 12" stroke="#0E2A47" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div></div>
          </div>
        </div>
      </section>

      <section class="stages">
        <div class="wrap">
          <div class="section-head reveal">
            <span class="eyebrow"><span class="dot"></span>${esc(d.trustIntro.eyebrow)}</span>
            <h2>${esc(d.trustIntro.title)}</h2>
            <p>${esc(d.trustIntro.body)} <a href="${esc(d.trustIntro.linkHref)}" style="color:var(--accent); border-bottom:1px solid var(--accent);">${esc(d.trustIntro.linkLabel)}</a></p>
          </div>
          ${d.stages.map(s => `
            <div class="stage-row reveal">
              <div class="stage-num"><b>${esc(s.num)}</b>${esc(s.label)}</div>
              <div class="stage-body"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>
              <div class="stage-photo"><img src="${esc(s.photo)}" alt="${esc(s.title)}"></div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="gallery-section">
        <div class="wrap">
          <div class="gallery-head reveal">
            <div class="section-head" style="margin-bottom:0;">
              <span class="eyebrow"><span class="dot"></span>${esc(d.gallery.eyebrow)}</span>
              <h2>${esc(d.gallery.title)}</h2>
            </div>
            <span class="gallery-hint">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 5L2 9L6 13M12 5L16 9L12 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Drag to explore
            </span>
          </div>
          <div class="gallery reveal">
            ${d.gallery.items.map(g => `<div class="gallery-item"><img src="${esc(g.image)}" alt="${esc(g.caption)}"><div class="cap">${esc(g.caption)}</div></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="final">
        <div class="final-photo"><img src="${esc(d.final.photo)}" alt="${esc(d.final.title)}"></div>
        <div class="wrap final-inner">
          <span class="eyebrow reveal">${esc(d.final.eyebrow)}</span>
          <h2 class="reveal">${esc(d.final.title)}</h2>
          <p class="reveal">${esc(d.final.body)}</p>
          <a class="btn-primary reveal" href="${esc(d.final.cta.href)}">${esc(d.final.cta.label)}</a>
        </div>
      </section>
    `;

    root.prepend(sourceBanner(source, 'home'));
    reInitDynamic();
  }

  async function renderRoadmap() {
    const root = document.getElementById('fnbRoadmap');
    if (!root) return;
    const { data, source } = await fetchContent('roadmap');
    if (!data) { root.innerHTML = '<div class="news-empty">No content set for this page yet.</div>'; return; }
    const d = data;

    root.innerHTML = `
      <section class="page-hero">
        <div class="wrap">
          <span class="eyebrow"><span class="dot"></span>${esc(d.hero.eyebrow)}</span>
          <h1>${esc(d.hero.title)}</h1>
          <p>${esc(d.hero.body)}</p>
        </div>
        <div class="page-hero-photo reveal"><img src="${esc(d.hero.photo)}" alt="${esc(d.hero.title)}"></div>
      </section>

      <section class="stages">
        <div class="wrap">
          ${d.stages.map(s => `
            <div class="stage-row reveal">
              <div class="stage-num"><b>${esc(s.num)}</b>${esc(s.label)}</div>
              <div class="stage-body">
                <h3>${esc(s.title)}</h3>
                <p>${esc(s.body)}</p>
                <div class="stage-tags"><span>${esc(s.tag)}</span></div>
              </div>
              <div class="stage-photo"><img src="${esc(s.photo)}" alt="${esc(s.title)}"></div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="final">
        <div class="final-photo"><img src="${esc(d.final.photo)}" alt="${esc(d.final.title)}"></div>
        <div class="wrap final-inner">
          <span class="eyebrow reveal">${esc(d.final.eyebrow)}</span>
          <h2 class="reveal">${esc(d.final.title)}</h2>
          <p class="reveal">${esc(d.final.body)}</p>
          <a class="btn-primary reveal" href="${esc(d.final.cta.href)}">${esc(d.final.cta.label)}</a>
        </div>
      </section>
    `;

    root.prepend(sourceBanner(source, 'roadmap'));
    reInitDynamic();
  }

  async function renderServices() {
    const root = document.getElementById('fnbServices');
    if (!root) return;
    const { data, source } = await fetchContent('services');
    if (!data) { root.innerHTML = '<div class="news-empty">No content set for this page yet.</div>'; return; }
    const d = data;

    root.innerHTML = `
      <section class="page-hero">
        <div class="wrap">
          <span class="eyebrow"><span class="dot"></span>${esc(d.hero.eyebrow)}</span>
          <h1>${esc(d.hero.title)}</h1>
          <p>${esc(d.hero.body)}</p>
        </div>
        <div class="page-hero-photo reveal"><img src="${esc(d.hero.photo)}" alt="${esc(d.hero.title)}"></div>
      </section>

      <section class="process">
        <div class="wrap">
          <div class="section-head reveal" style="margin-top:70px;">
            <span class="eyebrow"><span class="dot"></span>${esc(d.processIntro.eyebrow)}</span>
            <h2>${esc(d.processIntro.title)}</h2>
          </div>
        </div>
        <div class="wrap">
          <div class="process-grid reveal">
            ${d.process.map(p => `
              <div class="process-card">
                <div class="process-photo"><img src="${esc(p.photo)}" alt="${esc(p.title)}"></div>
                <div class="process-text"><div class="step">${esc(p.step)}</div><h4>${esc(p.title)}</h4><p>${esc(p.body)}</p></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="services">
        <div class="wrap">
          <div class="section-head reveal">
            <span class="eyebrow"><span class="dot"></span>${esc(d.pillarsIntro.eyebrow)}</span>
            <h2>${esc(d.pillarsIntro.title)}</h2>
          </div>
          <table class="svc reveal">
            <thead><tr><th>Pillar</th><th>Client outcome</th></tr></thead>
            <tbody>
              ${d.pillars.map(p => `<tr><td>${esc(p.pillar)}</td><td>${esc(p.outcome)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="vision">
        <div class="wrap">
          <div class="section-head reveal">
            <span class="eyebrow"><span class="dot"></span>${esc(d.trustIntro.eyebrow)}</span>
            <h2>${esc(d.trustIntro.title)}</h2>
            <p>${esc(d.trustIntro.body)}</p>
          </div>
          <div class="vision-list reveal">
            ${d.trustControls.map((t, i) => `
              <div class="vision-item"><div class="n mono">${String(i + 1).padStart(2, '0')}</div><div><h4>${esc(t.title)}</h4><p>${esc(t.body)}</p></div></div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="final">
        <div class="final-photo"><img src="${esc(d.final.photo)}" alt="${esc(d.final.title)}"></div>
        <div class="wrap final-inner">
          <span class="eyebrow reveal">${esc(d.final.eyebrow)}</span>
          <h2 class="reveal">${esc(d.final.title)}</h2>
          <p class="reveal">${esc(d.final.body)}</p>
          <a class="btn-primary reveal" href="${esc(d.final.cta.href)}">${esc(d.final.cta.label)}</a>
        </div>
      </section>
    `;

    root.prepend(sourceBanner(source, 'services'));
    reInitDynamic();
  }

  async function renderAbout() {
    const root = document.getElementById('fnbAbout');
    if (!root) return;
    const { data, source } = await fetchContent('about');
    if (!data) { root.innerHTML = '<div class="news-empty">No content set for this page yet.</div>'; return; }
    const d = data;

    root.innerHTML = `
      <section class="about" style="padding-top:70px; border-bottom:1px solid var(--line);">
        <div class="wrap">
          <div class="grid">
            <div class="about-photo reveal"><img src="${esc(d.intro.photo)}" alt="${esc(d.intro.title)}"></div>
            <div class="reveal">
              <span class="eyebrow"><span class="dot"></span>${esc(d.intro.eyebrow)}</span>
              <h2>${esc(d.intro.title)}</h2>
              ${d.intro.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
              <div class="credentials">
                <div class="who">${esc(d.founder.name)}</div>
                <div class="role">${esc(d.founder.role)}</div>
                <ul>
                  ${d.founder.credentials.map(c => `<li><span>${esc(c.label)}</span><span>${esc(c.value)}</span></li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <div class="quote-block reveal">
            <div class="qmark">&ldquo;</div>
            <div>
              <blockquote>${esc(d.quote.text)}</blockquote>
              <div class="attribution">
                <div class="team-avatar">${esc(d.quote.initials)}</div>
                <div><div class="name">${esc(d.quote.name)}</div><div class="role" style="margin:0;">${esc(d.quote.role)}</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="vision">
        <div class="wrap">
          <div class="section-head reveal">
            <span class="eyebrow"><span class="dot"></span>${esc(d.visionMission.eyebrow)}</span>
            <h2>${esc(d.visionMission.title)}</h2>
          </div>
          <div class="vision-list reveal">
            ${d.visionMission.items.map((v, i) => `<div class="vision-item"><div class="n mono">${String(i + 1).padStart(2, '0')}</div><div><h4>${esc(v.title)}</h4><p>${esc(v.body)}</p></div></div>`).join('')}
          </div>

          <div class="section-head reveal" style="margin-top:64px;">
            <span class="eyebrow"><span class="dot"></span>${esc(d.principlesIntro.eyebrow)}</span>
            <h2>${esc(d.principlesIntro.title)}</h2>
          </div>
          <div class="vision-list reveal">
            ${d.principles.map((p, i) => `<div class="vision-item"><div class="n mono">${String(i + 1).padStart(2, '0')}</div><div><h4>${esc(p.title)}</h4><p>${esc(p.body)}</p></div></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="vision">
        <div class="wrap">
          <div class="section-head reveal">
            <span class="eyebrow"><span class="dot"></span>${esc(d.governanceIntro.eyebrow)}</span>
            <h2>${esc(d.governanceIntro.title)}</h2>
            <p>${esc(d.governanceIntro.body)}</p>
          </div>
          <div class="vision-list reveal">
            ${d.governance.map((g, i) => `<div class="vision-item"><div class="n mono">${String(i + 1).padStart(2, '0')}</div><div><h4>${esc(g.title)}</h4><p>${esc(g.body)}</p></div></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="final">
        <div class="final-photo"><img src="${esc(d.final.photo)}" alt="${esc(d.final.title)}"></div>
        <div class="wrap final-inner">
          <span class="eyebrow reveal">${esc(d.final.eyebrow)}</span>
          <h2 class="reveal">${esc(d.final.title)}</h2>
          <p class="reveal">${esc(d.final.body)}</p>
          <a class="btn-primary reveal" href="${esc(d.final.cta.href)}">${esc(d.final.cta.label)}</a>
        </div>
      </section>
    `;

    root.prepend(sourceBanner(source, 'about'));
    reInitDynamic();
  }

  /** Re-runs the interactive behaviours (reveal, counters, compare slider,
   *  gallery drag) from script.js on freshly-injected DOM nodes. */
  function reInitDynamic() {
    if (typeof window.fnbInitDynamicUI === 'function') window.fnbInitDynamicUI();
  }

  renderGlobal();
  renderHome();
  renderRoadmap();
  renderServices();
  renderAbout();
})();