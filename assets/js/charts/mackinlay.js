// mackinlay.js — Mackinlay 视觉通道排序（新增可视化 ②）
// 替代原 lesson-02/img/01-mackinlay-ranking.png（444 KB 静态图）。
// 零依赖：纯 SVG + CSS 过渡，切换数据类型时通道按有效性重排。
// 排序依据：Mackinlay 1986《Automating the Design of Graphical Presentations》
// 对 Bertin 通道按三类数据的表达有效性排名。

const CHANNELS = [
  { id: 'pos', zh: '位置', en: 'Position' },
  { id: 'len', zh: '长度', en: 'Length' },
  { id: 'ang', zh: '角度', en: 'Angle' },
  { id: 'slo', zh: '斜率', en: 'Slope' },
  { id: 'area', zh: '面积', en: 'Area' },
  { id: 'vol', zh: '体积', en: 'Volume' },
  { id: 'den', zh: '明度', en: 'Lightness' },
  { id: 'sat', zh: '饱和度', en: 'Saturation' },
  { id: 'hue', zh: '色调', en: 'Hue' },
  { id: 'tex', zh: '纹理', en: 'Texture' },
  { id: 'con', zh: '连接', en: 'Connection' },
  { id: 'cnt', zh: '包含', en: 'Containment' },
  { id: 'shp', zh: '形状', en: 'Shape' },
];

// 每类数据下的通道排名（1 = 最有效）
const RANK = {
  Q: ['pos', 'len', 'ang', 'slo', 'area', 'vol', 'den', 'sat', 'hue', 'tex', 'con', 'cnt', 'shp'],
  O: ['pos', 'den', 'sat', 'hue', 'tex', 'con', 'cnt', 'len', 'ang', 'slo', 'area', 'vol', 'shp'],
  N: ['pos', 'hue', 'tex', 'con', 'cnt', 'den', 'sat', 'shp', 'len', 'ang', 'slo', 'area', 'vol'],
};

const TYPES = [
  { k: 'Q', zh: '定量 Quantitative', en: 'Quantitative' },
  { k: 'O', zh: '有序 Ordinal', en: 'Ordinal' },
  { k: 'N', zh: '名义 Nominal', en: 'Nominal' },
];

const WHY = {
  Q: {
    zh: '定量数据能被「读出数值」，所以依赖可精确比较的几何量：位置最准，其次长度、角度、面积；颜色类通道只能看出大概多少，排在后面；形状完全无法表达数量。',
    en: 'Quantitative data must be read as magnitudes, so it relies on geometry that can be compared precisely: position first, then length, angle, area. Colour channels only convey rough magnitude; shape conveys none.',
  },
  O: {
    zh: '有序数据只需保持「谁大谁小」。明度天然有序（深→浅），所以紧跟位置；长度、面积虽然精确，但容易让人误读成具体倍数，反而排在明度之后。',
    en: 'Ordinal data only needs rank order. Lightness is intrinsically ordered (dark→light), so it ranks right after position; length and area are precise but invite false ratio readings, so they fall below lightness.',
  },
  N: {
    zh: '名义数据没有顺序，关键是「能分得开且不暗示大小」。色调、纹理、连接、包含都只做区分不做排序，所以靠前；长度、面积会制造不存在的大小关系，排到最后。',
    en: 'Nominal data has no order; the channel must separate categories without implying magnitude. Hue, texture, connection and containment only distinguish, so they rank high; length and area would invent a nonexistent ordering, so they rank last.',
  },
};

const ROW_H = 26;
const PAD_L = 92;
const NS = 'http://www.w3.org/2000/svg';

export function render(mount) {
  const isEn = () => (window.__i18n && window.__i18n.getLocale()) === 'en-US';
  const nameOf = (c) => (isEn() ? c.en : c.zh);

  mount.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'viz-head';
  const title = document.createElement('span');
  title.className = 'viz-title';
  const ctl = document.createElement('div');
  ctl.className = 'viz-ctl';
  head.appendChild(title);
  head.appendChild(ctl);
  mount.appendChild(head);

  const W = 560;
  const H = CHANNELS.length * ROW_H + 18;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('width', '100%');
  mount.appendChild(svg);

  const note = document.createElement('p');
  note.className = 'viz-note';
  mount.appendChild(note);

  // 每个通道一行：标签 + 条
  const rows = new Map();
  CHANNELS.forEach((c) => {
    const g = document.createElementNS(NS, 'g');
    g.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';

    const lab = document.createElementNS(NS, 'text');
    lab.setAttribute('x', PAD_L - 8);
    lab.setAttribute('y', 14);
    lab.setAttribute('text-anchor', 'end');
    lab.setAttribute('font-size', '12');
    lab.setAttribute('fill', '#334155');

    const bar = document.createElementNS(NS, 'rect');
    bar.setAttribute('x', PAD_L);
    bar.setAttribute('y', 4);
    bar.setAttribute('height', 14);
    bar.setAttribute('rx', 3);
    bar.style.transition = 'width .5s cubic-bezier(.4,0,.2,1), fill .5s';

    const num = document.createElementNS(NS, 'text');
    num.setAttribute('y', 15);
    num.setAttribute('font-size', '11');
    num.setAttribute('fill', '#64748b');
    num.style.transition = 'x .5s cubic-bezier(.4,0,.2,1)';

    g.appendChild(lab); g.appendChild(bar); g.appendChild(num);
    svg.appendChild(g);
    rows.set(c.id, { g, lab, bar, num, c });
  });

  let cur = 'Q';

  function paint() {
    const order = RANK[cur];
    const n = order.length;
    title.textContent = isEn() ? 'Mackinlay Channel Ranking' : 'Mackinlay 视觉通道排序';
    note.textContent = isEn() ? WHY[cur].en : WHY[cur].zh;

    order.forEach((cid, i) => {
      const r = rows.get(cid);
      if (!r) return;
      const w = Math.round(((n - i) / n) * (W - PAD_L - 36));
      // 排名越高越饱和
      const light = 42 + (i / n) * 36;
      r.g.setAttribute('transform', 'translate(0,' + (i * ROW_H + 6) + ')');
      r.lab.textContent = nameOf(r.c);
      r.bar.setAttribute('width', w);
      r.bar.setAttribute('fill', 'hsl(231 70% ' + light + '%)');
      r.num.setAttribute('x', PAD_L + w + 6);
      r.num.textContent = '#' + (i + 1);
    });

    [...ctl.children].forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.k === cur)));
  }

  TYPES.forEach((tp) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.k = tp.k;
    b.addEventListener('click', () => { cur = tp.k; paint(); });
    ctl.appendChild(b);
  });

  function syncLabels() {
    TYPES.forEach((tp, i) => { ctl.children[i].textContent = isEn() ? tp.en : tp.zh; });
    paint();
  }

  syncLabels();
  document.addEventListener('wbl:localechange', syncLabels);
}
