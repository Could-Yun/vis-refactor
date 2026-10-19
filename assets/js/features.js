// features.js — 阅读进度 / 本章目录 / 全站搜索 / 可视化挂载
// 零依赖；D3 仅在需要它的可视化模块里按需加载。

const STORE = 'vis-progress';
const t = (k) => (window.__i18n ? window.__i18n.t(k) : k);

/* ============================ 进度存储 ============================ */
const Progress = {
  read() {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; }
  },
  write(o) {
    try { localStorage.setItem(STORE, JSON.stringify(o)); } catch { /* 隐私模式忽略 */ }
  },
  markSection(chapter, id) {
    const all = this.read();
    const set = new Set(all[chapter] || []);
    set.add(id);
    all[chapter] = [...set];
    all.__last = { chapter, id, at: Date.now() };
    this.write(all);
  },
  sectionsOf(chapter) { return new Set(this.read()[chapter] || []); },
  last() { return this.read().__last || null; },
};

/* ============================ 当前章号 ============================ */
function chapterId() {
  const m = location.pathname.match(/lesson-(\d+)/);
  return m ? m[1] : null;
}

/* ============================ 阅读进度 ============================
   注意：本站每章是「一次只显示一个 article.chapter」的分段式界面，
   不是长滚动页。所以进度 = 已访问小节数 / 总小节数，而不是滚动百分比。
   目录也不另建——.chapter-nav 本身就是可用目录，这里只给它加已读标记。 */
function wireProgress() {
  const ch = chapterId();
  const nav = document.querySelector('.chapter-nav');
  const arts = [...document.querySelectorAll('article.chapter[id]')];
  const bar = document.querySelector('.reading-progress > i');
  if (!ch || !nav || !arts.length) return null;

  const links = new Map(
    [...nav.querySelectorAll('a[data-chapter]')].map((a) => [a.dataset.chapter, a])
  );
  const total = arts.length;

  // 进度计数器放在目录标题「之后」，不能放进 h3 内部——
  // h3 带 data-i18n，i18n 的 applyLocale 会执行 el.textContent = v，
  // 任何塞进去的子元素都会在每次切换语言时被抹掉。
  const head = nav.querySelector('h3');
  let badge = null;
  if (head) {
    badge = document.createElement('span');
    badge.className = 'toc-count';
    head.insertAdjacentElement('afterend', badge);
  }

  const paint = () => {
    const done = Progress.sectionsOf(ch);
    links.forEach((a, id) => a.classList.toggle('done', done.has(id)));
    const pct = Math.round((done.size / total) * 100);
    if (bar) bar.style.width = pct + '%';
    if (badge) badge.textContent = done.size + '/' + total;
  };

  const markActive = () => {
    const act = arts.find((a) => a.classList.contains('active'));
    if (act) Progress.markSection(ch, act.id);
    paint();
  };

  markActive();
  // 小节切换由 lesson.js 改 class 完成，这里观察 class 变化
  const mo = new MutationObserver(markActive);
  arts.forEach((a) => mo.observe(a, { attributes: true, attributeFilter: ['class'] }));

  return { paint };
}

/* ============================ 全站搜索 ============================ */
const Search = {
  idx: null,
  loading: null,

  base() {
    // 章节页在子目录，门户在根
    return /lesson-\d+|\/demos/.test(location.pathname) ? '../' : './';
  },

  async load() {
    if (this.idx) return this.idx;
    if (!this.loading) {
      this.loading = fetch(this.base() + 'search-index.json')
        .then((r) => {
          if (!r.ok) throw new Error('index ' + r.status);
          return r.json();
        })
        .then((j) => (this.idx = j))
        .catch((e) => { this.loading = null; console.warn('[search] 索引加载失败', e); return null; });
    }
    return this.loading;
  },

  // 中文无空格：二元组切分；英文按词
  grams(s) {
    const out = [];
    const low = s.toLowerCase();
    (low.match(/[a-z0-9_.+#-]{2,}/g) || []).forEach((w) => out.push(w));
    const cjk = low.replace(/[^一-鿿]/g, ' ');
    for (const run of cjk.split(/\s+/)) {
      if (run.length === 1) out.push(run);
      for (let i = 0; i + 1 < run.length; i++) out.push(run.slice(i, i + 2));
    }
    return out;
  },

  query(q) {
    if (!this.idx || !q.trim()) return [];
    const loc = (window.__i18n && window.__i18n.getLocale()) === 'en-US' ? 'en' : 'zh';
    const gs = this.grams(q);
    if (!gs.length) return [];
    const score = new Map();
    gs.forEach((g) => {
      const posting = this.idx.inv[g];
      if (!posting) return;
      const w = 1 / Math.log(2 + posting.length);     // 常见 gram 权重低
      posting.forEach((di) => score.set(di, (score.get(di) || 0) + w));
    });
    const out = [...score.entries()]
      .map(([di, sc]) => ({ d: this.idx.docs[di], sc }))
      .filter((x) => x.d && (x.d.l === loc || x.d.l === 'both'))
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 30);
    return out;
  },
};

function highlight(text, q) {
  const terms = [...new Set(q.toLowerCase().split(/\s+/).filter(Boolean))];
  let html = text.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  terms.forEach((term) => {
    if (term.length < 1) return;
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    html = html.replace(re, (m) => '<mark>' + m + '</mark>');
  });
  return html;
}

function buildSearchUI() {
  const ov = document.createElement('div');
  ov.className = 'search-overlay';
  ov.innerHTML =
    '<div class="search-box" role="dialog" aria-modal="true">' +
    '<input type="search" autocomplete="off" />' +
    '<div class="search-meta"><span class="sm-hint"></span><span class="sm-count"></span></div>' +
    '<ul class="search-results"></ul></div>';
  document.body.appendChild(ov);

  const input = ov.querySelector('input');
  const list = ov.querySelector('.search-results');
  const hint = ov.querySelector('.sm-hint');
  const count = ov.querySelector('.sm-count');
  let sel = -1;

  const sync = () => {
    input.placeholder = t('ui.search.placeholder');
    hint.textContent = t('ui.search.hint');
  };
  sync();
  document.addEventListener('wbl:localechange', sync);

  const open = async () => {
    ov.setAttribute('open', '');
    input.value = '';
    list.innerHTML = '';
    count.textContent = '';
    input.focus();
    await Search.load();
    // A reader may type while a remote index is still downloading.
    // Re-run the query when loading finishes instead of leaving stale zero results.
    render();
  };
  const close = () => ov.removeAttribute('open');

  const render = () => {
    const q = input.value;
    const res = Search.query(q);
    sel = -1;
    if (!q.trim()) { list.innerHTML = ''; count.textContent = ''; return; }
    if (!res.length) {
      list.innerHTML = '<li class="search-empty">' + t('ui.search.empty') + '</li>';
      count.textContent = '0 ' + t('ui.search.count');
      return;
    }
    count.textContent = res.length + ' ' + t('ui.search.count');
    list.innerHTML = res.map((x) =>
      '<li><a href="' + Search.base() + x.d.u + '">' +
      '<span class="sr-crumb">' + x.d.c + '</span>' +
      '<span class="sr-title">' + highlight(x.d.t, q) + '</span>' +
      (x.d.s ? '<span class="sr-snip">' + highlight(x.d.s, q) + '</span>' : '') +
      '</a></li>').join('');
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    const items = [...list.querySelectorAll('li')].filter((li) => !li.classList.contains('search-empty'));
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      items[sel]?.classList.remove('sel');
      sel = e.key === 'ArrowDown'
        ? (sel + 1) % items.length
        : (sel - 1 + items.length) % items.length;
      items[sel].classList.add('sel');
      items[sel].scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter') {
      const a = (items[sel] || items[0])?.querySelector('a');
      if (a) location.href = a.getAttribute('href');
    }
  });

  ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  document.querySelectorAll('.search-open').forEach((b) => b.addEventListener('click', open));
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) {
      e.preventDefault(); open();
    }
  });
}

/* ============================ 可视化按需挂载 ============================ */
const VIZ = {
  mackinlay: () => import('./charts/mackinlay.js?v=20261019'),
  'knowledge-map': () => import('./charts/knowledge-map.js?v=20261019'),
  'chart-chooser': () => import('./charts/chart-chooser.js'),
  'color-compare': () => import('./charts/color-compare.js'),
};

function mountViz() {
  const mounts = [...document.querySelectorAll('.viz-mount[data-viz]')];
  if (!mounts.length) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      obs.unobserve(en.target);
      const name = en.target.dataset.viz;
      const loader = VIZ[name];
      if (!loader) return;
      loader()
        .then((m) => m.render(en.target))
        .catch((e) => {
          console.error('[viz] ' + name + ' 渲染失败', e);
          en.target.innerHTML = '<p class="viz-note">可视化加载失败：' + name + '</p>';
        });
    });
  }, { rootMargin: '200px' });
  mounts.forEach((m) => io.observe(m));
}

/* ============================ 启动 ============================ */
function init() {
  const prog = wireProgress();
  buildSearchUI();
  mountViz();
  window.__features = { Progress, Search, chapterId, repaint: prog && prog.paint };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
