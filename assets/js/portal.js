// portal.js — 门户页：章节卡进度环 + 继续上次阅读
const STORE = 'vis-progress';
// 各章小节总数（与 article.chapter 数量一致，构建时核对过）
const TOTAL = { '01': 5, '02': 4, '03': 8, '04': 5, '05': 5 };
const t = (k) => (window.__i18n ? window.__i18n.t(k) : k);

function read() {
  try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; }
}

function ring(done, total) {
  const r = 14, c = 2 * Math.PI * r;
  const pct = total ? done / total : 0;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'card-progress');
  svg.setAttribute('viewBox', '0 0 34 34');
  svg.innerHTML =
    '<circle cx="17" cy="17" r="' + r + '" fill="none" stroke="#e2e8f0" stroke-width="3"/>' +
    '<circle cx="17" cy="17" r="' + r + '" fill="none" stroke="#4338ca" stroke-width="3"' +
    ' stroke-linecap="round" stroke-dasharray="' + c + '"' +
    ' stroke-dashoffset="' + (c * (1 - pct)) + '"' +
    ' transform="rotate(-90 17 17)"/>' +
    '<text x="17" y="21" text-anchor="middle">' + done + '/' + total + '</text>';
  return svg;
}

function init() {
  const prog = read();

  document.querySelectorAll('a.card[href^="lesson-"]').forEach((card) => {
    const m = card.getAttribute('href').match(/lesson-(\d+)/);
    if (!m) return;
    const ch = m[1];
    const total = TOTAL[ch];
    if (!total) return;
    const done = new Set(prog[ch] || []).size;
    if (done === 0) return;                 // 没读过就不显示环，避免满屏 0/5
    card.style.position = card.style.position || 'relative';
    card.appendChild(ring(Math.min(done, total), total));
  });

  // 继续上次阅读
  const last = prog.__last;
  if (last && last.chapter && last.id) {
    const lead = document.querySelector('#chapters .section-lead');
    if (lead) {
      const a = document.createElement('a');
      a.className = 'portal-resume';
      a.href = 'lesson-' + last.chapter + '/#' + last.id;
      const sync = () => { a.textContent = '▶ ' + t('ui.resume'); };
      sync();
      document.addEventListener('wbl:localechange', sync);
      lead.insertAdjacentElement('afterend', a);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
