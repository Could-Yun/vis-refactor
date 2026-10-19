// Field types → task → visual encoding. No external dependency.
const CASES = {
  compare: {zh:['类别 + 数值','比较各组数量','条形图','长度与共同基线支持准确比较。类别没有大小关系，不应映射为面积或连续色阶。','第 2 章：通道排序','lesson-02/#ch-2-1'],en:['Category + number','Compare magnitudes','Bar chart','Length on a shared baseline supports accurate comparison. Unordered categories should not imply magnitude through size or sequential colour.','Chapter 2: visual channels','lesson-02/#ch-2-1']},
  relation: {zh:['数值 + 数值','发现关联与离群值','散点图','用横纵位置分别编码两个数值。相关不等于因果；必要时用透明度减轻重叠。','第 4 章：散点图','lesson-04/'],en:['Number + number','Explore relationships','Scatter plot','Encode two numeric variables with x/y position. Correlation is not causation; use transparency to reduce overplotting.','Chapter 4: scatter plots','lesson-04/']},
  trend: {zh:['时间 + 数值','观察随时间的变化','折线图','时间顺序映射到横轴，位置编码数值；缺失时间段应留空，避免虚构连续变化。','第 5 章：时序','lesson-05/'],en:['Time + number','Trace change over time','Line chart','Map ordered time to x and value to y. Leave gaps for missing observations instead of inventing continuous change.','Chapter 5: time series','lesson-05/']},
  distribution: {zh:['一个数值字段','观察分布形状','直方图','先分箱，再用长度表示频数。箱宽会影响形状，必须比较不同箱数。','第 1 章：数据属性','lesson-01/#ch-1-3'],en:['One numeric field','Inspect a distribution','Histogram','Bin observations, then encode counts with length. Bin width changes the apparent shape; compare several settings.','Chapter 1: attributes','lesson-01/#ch-1-3']},
  matrix: {zh:['两个类别 + 数值','比较交叉组合','热力图','两个位置编码类别，连续明度编码数值。用色图例说明单位，避免彩虹色制造假边界。','第 3 章：色彩','lesson-03/#ch-3-2'],en:['Two categories + number','Compare intersections','Heatmap','Two positional axes encode categories; sequential lightness encodes magnitude. Label units and avoid rainbow-induced false boundaries.','Chapter 3: colour','lesson-03/#ch-3-2']},
};
export function render(mount){
  let active='compare'; const en=()=>window.__i18n?.getLocale()==='en-US';
  const base=/lesson-\d+/.test(location.pathname)?'../':'./';
  function paint(){
    const lang=en()?'en':'zh', d=CASES[active][lang];
    mount.innerHTML=`<div class="viz-head"><strong>${en()?'Choose a chart by task':'按分析任务选择图表'}</strong></div><div class="tool-options">${Object.entries(CASES).map(([k,v])=>`<button class="chip" data-case="${k}" aria-pressed="${k===active}">${v[lang][0]}</button>`).join('')}</div><div class="chooser-grid"><div><p class="viz-note">${en()?'Analysis task':'分析任务'} → ${d[1]}</p><h3>${d[2]}</h3><p>${d[3]}</p><a href="${base+d[5]}">${d[4]} →</a></div><svg role="img" aria-label="${d[2]}" viewBox="0 0 400 220"><path d="M35 15V190H380" fill="none" stroke="#64748b"/>${preview(active)}</svg></div>`;
    mount.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>{active=b.dataset.case;paint();});
  }
  paint(); document.addEventListener('wbl:localechange',paint);
}
function preview(k){
 if(k==='relation')return Array.from({length:35},(_,i)=>`<circle cx="${48+i*9}" cy="${173-i*4+Math.sin(i*2)*27}" r="4" fill="#4338ca" opacity=".6"/>`).join('');
 if(k==='trend')return '<path d="M40 165L90 145L140 151L190 102L240 122L290 63L350 40" fill="none" stroke="#4338ca" stroke-width="4"/>';
 if(k==='matrix')return Array.from({length:24},(_,i)=>`<rect x="${43+(i%6)*51}" y="${20+Math.floor(i/6)*40}" width="47" height="36" fill="hsl(245 55% ${92-(i*17%65)}%)"/>`).join('');
 const vals=k==='distribution'?[22,49,87,130,158,139,86,43,20]:[94,152,63,128,174];
 return vals.map((v,i)=>`<rect x="${45+i*(300/vals.length)}" y="${190-v}" width="${300/vals.length-4}" height="${v}" rx="2" fill="#4338ca"/>`).join('');
}
