// knowledge-map.js — 课程知识地图（新增可视化 ①）
// 解决原站缺陷：门户页 SVG 数为 0，五章之间没有任何总览。
// D3 按需从 CDN 以 ESM 方式载入并锁版本（不进仓库，契合「服务器空间有限」）。

const D3_URL = '../../vendor/d3-local.js';

// 章节节点
const CHAPTERS = [
  { id: 'c1', ch: '01', zh: '1 数据', en: '1 Data' },
  { id: 'c2', ch: '02', zh: '2 可视化流程', en: '2 Pipeline' },
  { id: 'c3', ch: '03', zh: '3 色彩', en: '3 Color' },
  { id: 'c4', ch: '04', zh: '4 低维可视化', en: '4 Low-Dim' },
  { id: 'c5', ch: '05', zh: '5 时序可视化', en: '5 Time Series' },
];

// 概念节点：sec = 所属小节锚点
const CONCEPTS = [
  { id: 'gen', p: 'c1', sec: 'lesson-01/#ch-1-1', zh: '数据生成', en: 'Data generation' },
  { id: 'dikw', p: 'c1', sec: 'lesson-01/#ch-1-2', zh: 'DIKW 金字塔', en: 'DIKW pyramid' },
  { id: 'stevens', p: 'c1', sec: 'lesson-01/#ch-1-3', zh: 'Stevens 测量尺度', en: "Stevens' scales" },
  { id: 'mack', p: 'c1', sec: 'lesson-01/#ch-1-3', zh: 'Mackinlay 通道排序', en: 'Mackinlay ranking' },
  { id: 'scale', p: 'c1', sec: 'lesson-01/#ch-1-3', zh: '比例尺选型', en: 'Scale selection' },
  { id: 'transform', p: 'c1', sec: 'lesson-01/#ch-1-4', zh: '数据变换', en: 'Data transformation' },
  { id: 'join', p: 'c1', sec: 'lesson-01/#ch-1-5', zh: 'Data-Join 三态', en: 'Data-join states' },

  { id: 'card', p: 'c2', sec: 'lesson-02/#ch-2-1', zh: 'Card 数据流模型', en: 'Card pipeline' },
  { id: 'rollup', p: 'c2', sec: 'lesson-02/#ch-2-2', zh: '多层聚合 rollup', en: 'Nested rollup' },
  { id: 'tree', p: 'c2', sec: 'lesson-02/#ch-2-3', zh: 'Reingold-Tilford 树布局', en: 'Tree layout' },
  { id: 'deleg', p: 'c2', sec: 'lesson-02/#ch-2-4', zh: '事件委托', en: 'Event delegation' },

  { id: 'cspace', p: 'c3', sec: 'lesson-03/#ch-3-1', zh: '颜色空间', en: 'Color spaces' },
  { id: 'cmap', p: 'c3', sec: 'lesson-03/#ch-3-2', zh: 'colormap 三类', en: 'Colormap families' },
  { id: 'lab', p: 'c3', sec: 'lesson-03/#ch-3-3', zh: 'CIE Lab 感知均匀', en: 'CIE Lab uniformity' },
  { id: 'scheme', p: 'c3', sec: 'lesson-03/#ch-3-4', zh: '色系搭配规则', en: 'Scheme rules' },
  { id: 'cvd', p: 'c3', sec: 'lesson-03/#ch-3-8', zh: '色盲友好 (CVD)', en: 'CVD safety' },

  { id: 'coord', p: 'c4', sec: 'lesson-04/#ch-4-2', zh: '坐标轴变换', en: 'Axis transforms' },
  { id: 'fit', p: 'c4', sec: 'lesson-04/#ch-4-3', zh: '曲线拟合', en: 'Curve fitting' },
  { id: 'slope', p: 'c4', sec: 'lesson-04/#ch-4-4', zh: '倾角感知 45°', en: 'Slope perception' },
  { id: 'contour', p: 'c4', sec: 'lesson-04/#ch-4-5', zh: '等值线', en: 'Contours' },

  { id: 'tattr', p: 'c5', sec: 'lesson-05/#ch-5-1', zh: '时间属性分解', en: 'Time attributes' },
  { id: 'line', p: 'c5', sec: 'lesson-05/#ch-5-2', zh: '折线图', en: 'Line chart' },
  { id: 'cal', p: 'c5', sec: 'lesson-05/#ch-5-3', zh: '日历热图', en: 'Calendar heatmap' },
  { id: 'polar', p: 'c5', sec: 'lesson-05/#ch-5-4', zh: '周期/极坐标', en: 'Cyclic / polar' },
  { id: 'story', p: 'c5', sec: 'lesson-05/#ch-5-5', zh: 'Storyline 时间线', en: 'Storyline' },
];

// 前置依赖（source 是 target 的前置）
const PREREQ = [
  ['stevens', 'mack'], ['mack', 'scale'], ['stevens', 'scale'],
  ['dikw', 'card'], ['transform', 'rollup'], ['rollup', 'tree'],
  ['join', 'deleg'], ['scale', 'cmap'], ['cspace', 'cmap'],
  ['cmap', 'lab'], ['lab', 'cvd'], ['scheme', 'cvd'],
  ['scale', 'coord'], ['coord', 'slope'], ['cmap', 'contour'],
  ['transform', 'fit'], ['tattr', 'line'], ['cmap', 'cal'],
  ['tattr', 'cal'], ['coord', 'polar'], ['tattr', 'polar'],
  ['join', 'story'],
];

const CH_COLOR = { c1: '#6366f1', c2: '#0ea5e9', c3: '#f59e0b', c4: '#10b981', c5: '#ef4444' };

export async function render(mount) {
  const host = mount.querySelector('#knowledge-map') || mount;
  host.innerHTML = '';

  let d3;
  try {
    d3 = await import(/* @vite-ignore */ D3_URL);
  } catch (e) {
    host.innerHTML = '<p class="viz-note">知识地图需要联网加载 D3，当前不可用。' +
      '五章内容仍可从下方章节卡进入。</p>';
    return;
  }

  const isEn = () => (window.__i18n && window.__i18n.getLocale()) === 'en-US';
  const label = (d) => (isEn() ? d.en : d.zh);

  const W = Math.max(320, host.clientWidth || 900);
  const H = 460;

  const nodes = [
    ...CHAPTERS.map((c) => ({ ...c, kind: 'chap', r: 26 })),
    ...CONCEPTS.map((c) => ({ ...c, kind: 'con', r: 9 })),
  ];
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // 边：章节→概念（归属）+ 概念→概念（前置）
  const links = [
    ...CONCEPTS.map((c) => ({ source: c.p, target: c.id, type: 'own' })),
    ...PREREQ.filter(([a, b]) => byId.has(a) && byId.has(b))
      .map(([a, b]) => ({ source: a, target: b, type: 'pre' })),
  ];

  const svg = d3.select(host).append('svg')
    .attr('viewBox', [0, 0, W, H])
    .attr('width', '100%')
    .attr('height', H);

  const lg = svg.append('g').attr('class', 'links');
  const ng = svg.append('g').attr('class', 'nodes');

  const link = lg.selectAll('line').data(links).join('line')
    .attr('class', (d) => 'link ' + d.type)
    .attr('stroke-dasharray', (d) => (d.type === 'own' ? '2,3' : null));

  const node = ng.selectAll('g').data(nodes).join('g')
    .attr('class', (d) => 'node ' + d.kind)
    .style('cursor', (d) => (d.sec || d.ch ? 'pointer' : 'default'));

  node.append('circle')
    .attr('r', (d) => d.r)
    .attr('fill', (d) => (d.kind === 'chap' ? CH_COLOR[d.id] : CH_COLOR[d.p]))
    .attr('fill-opacity', (d) => (d.kind === 'chap' ? 0.92 : 0.75));

  const text = node.append('text')
    .attr('dy', (d) => (d.kind === 'chap' ? 4 : -13))
    .attr('text-anchor', 'middle')
    .attr('fill', (d) => (d.kind === 'chap' ? '#fff' : '#1e293b'))
    .text(label);

  // 前置链路高亮
  const preInto = new Map();
  PREREQ.forEach(([a, b]) => {
    if (!preInto.has(b)) preInto.set(b, []);
    preInto.get(b).push(a);
  });
  function chainOf(id, acc = new Set()) {
    (preInto.get(id) || []).forEach((p) => {
      if (!acc.has(p)) { acc.add(p); chainOf(p, acc); }
    });
    return acc;
  }

  node.on('mouseenter', (ev, d) => {
    const keep = chainOf(d.id);
    keep.add(d.id);
    if (d.kind === 'chap') {
      CONCEPTS.filter((c) => c.p === d.id).forEach((c) => keep.add(c.id));
      keep.add(d.id);
    }
    node.classed('dim', (n) => !keep.has(n.id) && !(n.kind === 'chap' && keep.has(n.id)));
    link.classed('hot', (l) =>
      l.type === 'pre' && keep.has(idOf(l.source)) && keep.has(idOf(l.target)));
    link.classed('dim', (l) => !(keep.has(idOf(l.source)) && keep.has(idOf(l.target))));
  }).on('mouseleave', () => {
    node.classed('dim', false);
    link.classed('dim', false).classed('hot', false);
  }).on('click', (ev, d) => {
    const url = d.sec || (d.ch ? 'lesson-' + d.ch + '/' : null);
    if (url) location.href = url;
  });

  const idOf = (x) => (typeof x === 'object' ? x.id : x);

  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d) => d.id)
      .distance((d) => (d.type === 'own' ? 58 : 95))
      .strength((d) => (d.type === 'own' ? 0.9 : 0.25)))
    .force('charge', d3.forceManyBody().strength(-230))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collide', d3.forceCollide().radius((d) => d.r + 14))
    .on('tick', () => {
      link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y);
      node.attr('transform', (d) => {
        d.x = Math.max(d.r + 4, Math.min(W - d.r - 4, d.x));
        d.y = Math.max(d.r + 14, Math.min(H - d.r - 6, d.y));
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });

  node.call(d3.drag()
    .on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
    .on('drag', (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
    .on('end', (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

  // 图例
  const legend = document.createElement('p');
  legend.className = 'viz-note';
  const syncLegend = () => {
    legend.textContent = isEn()
      ? 'Dotted edges: chapter membership. Solid edges: prerequisite. Hover a node to light up its prerequisite chain; click to open that section.'
      : '虚线表示章节归属，实线表示前置依赖。悬停节点可点亮它的前置链路，点击跳到对应小节。';
  };
  syncLegend();
  host.appendChild(legend);

  document.addEventListener('wbl:localechange', () => { text.text(label); syncLegend(); });
}
