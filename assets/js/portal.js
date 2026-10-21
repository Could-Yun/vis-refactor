// Portal learning records: reserved header, in-flow card progress and resume panel.
const STORE = 'vis-progress';
// 各章小节总数（与 article.chapter 数量一致，构建时核对过）
const TOTAL = { '01': 5, '02': 4, '03': 8, '04': 5, '05': 5 };
const t = (k) => (window.__i18n ? window.__i18n.t(k) : k);

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(STORE) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}

function ring(done, total) {
  const r = 16, c = 2 * Math.PI * r;
  const pct = total ? done / total : 0;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'card-progress');
  svg.setAttribute('viewBox', '0 0 40 40');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML =
    '<circle cx="20" cy="20" r="' + r + '" fill="none" stroke="#e2e8f0" stroke-width="3"/>' +
    '<circle cx="20" cy="20" r="' + r + '" fill="none" stroke="#4338ca" stroke-width="3"' +
    ' stroke-linecap="round" stroke-dasharray="' + c + '"' +
    ' stroke-dashoffset="' + (c * (1 - pct)) + '"' +
    ' transform="rotate(-90 20 20)"/>' +
    '<text x="20" y="24" text-anchor="middle">' + Math.round(pct * 100) + '%</text>';
  return svg;
}

function init() {
  const nav = document.querySelector('.nav');
  const links = document.createElement('div');
  links.className = 'nav-links';
  links.append(...nav.children);
  nav.append(links);
  const languageSwitch = document.querySelector('.lang-switch-floating');
  if (languageSwitch) {
    languageSwitch.classList.remove('lang-switch-floating');
    document.querySelector('.nav')?.append(languageSwitch);
  }
  const cards = [];
  document.querySelectorAll('a.card[href^="lesson-"]').forEach(card => {
    const ch = card.getAttribute('href').match(/lesson-(\d+)/)?.[1];
    if (!TOTAL[ch]) return;
    const top = document.createElement('div');
    top.className = 'card-topline';
    const status = card.querySelector('.card-status');
    status.removeAttribute('data-i18n');
    top.append(card.querySelector('.card-num'), status);
    card.prepend(top);
    const progress = document.createElement('div');
    progress.className = 'card-learning';
    card.querySelector('.card-cta').before(progress);
    cards.push({card, ch, status, progress});
  });

  const panel = document.createElement('div');
  panel.className = 'learning-overview';
  panel.setAttribute('role', 'region');
  panel.innerHTML = '<div class="learning-icon" aria-hidden="true">↗</div>' +
    '<div class="learning-copy"><div class="learning-eyebrow"></div>' +
    '<div class="learning-heading"></div><p class="learning-detail"></p>' +
    '<p class="learning-disclaimer"></p></div><a class="portal-resume"></a>';
  document.querySelector('#chapters .section-lead')?.after(panel);

  function paint() {
    const prog = read();
    const en = window.__i18n?.getLocale() === 'en-US';
    const text = (zh, eng) => en ? eng : zh;
    let visited = 0;
    cards.forEach(({ch, status, progress}) => {
      const total = TOTAL[ch];
      const expected = new Set(Array.from({length: total}, (_, i) => `ch-${Number(ch)}-${i+1}`));
      const raw = Array.isArray(prog[ch]) ? prog[ch] : [];
      const done = new Set(raw.filter(id => expected.has(id))).size;
      visited += done;
      status.textContent = done === 0 ? text('未开始', 'Not started') :
        done === total ? text('已浏览全部', 'All sections visited') : text('阅读中', 'In progress');
      status.dataset.state = done === 0 ? 'new' : done === total ? 'visited' : 'reading';
      progress.replaceChildren(ring(done, total));
      const copy = document.createElement('div');
      const label = document.createElement('span');
      label.className = 'card-learning-label';
      label.textContent = text('小节访问进度', 'Sections visited');
      const count = document.createElement('strong');
      count.textContent = `${done} / ${total}`;
      copy.append(label, count);
      progress.append(copy);
    });

    const last = prog.__last;
    const validLast = last && TOTAL[last.chapter] &&
      Array.from({length:TOTAL[last.chapter]},(_,i)=>`ch-${Number(last.chapter)}-${i+1}`).includes(last.id);
    panel.setAttribute('aria-label', text('学习记录与继续阅读', 'Learning records and resume'));
    panel.querySelector('.learning-eyebrow').textContent = text('学习记录', 'YOUR LEARNING');
    panel.querySelector('.learning-heading').textContent = validLast ?
      text('从上次停下的地方继续', 'Pick up where you left off') :
      text('从感兴趣的章节开始', 'Start with a chapter that interests you');
    panel.querySelector('.learning-disclaimer').textContent = text(
      `已访问 ${visited} / 27 个小节 · 记录仅保存在当前浏览器，不代表掌握程度。`,
      `${visited} / 27 sections visited · Saved in this browser; visits do not measure mastery.`);
    const detail = panel.querySelector('.learning-detail');
    const button = panel.querySelector('.portal-resume');
    if (validLast) {
      const chapter = t(`card-${last.chapter}.title`);
      const section = t(`sec-${last.chapter}-${last.id.split('-').pop()}.title`);
      detail.textContent = text('上次阅读：', 'Last visited: ') + chapter + ' · ' + section;
      button.textContent = text('继续上次阅读', 'Continue reading') + ' →';
      button.href = `lesson-${last.chapter}/#${last.id}`;
    } else {
      detail.textContent = text('阅读后会自动记录小节位置，下次回来可直接继续。',
        'Your section is saved as you read, so you can resume on your next visit.');
      button.textContent = text('开始学习', 'Start learning') + ' →';
      button.href = 'lesson-01/';
    }
  }
  paint();
  document.addEventListener('wbl:localechange', paint);
  window.addEventListener('pageshow', paint);
  window.addEventListener('storage', event => { if (event.key === STORE) paint(); });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
