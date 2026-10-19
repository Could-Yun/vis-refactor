// The same scalar field and luminance profile under three colour maps.
export function render(mount){
 let mode='normal'; const en=()=>window.__i18n?.getLocale()==='en-US';
 const opts={normal:['原色','Original'],protan:['红色觉缺陷（近似）','Protan simulation (approx.)'],deutan:['绿色觉缺陷（近似）','Deutan simulation (approx.)'],tritan:['蓝色觉缺陷（近似）','Tritan simulation (approx.)'],gray:['灰度','Grayscale']};
 const anchors={viridis:[[68,1,84],[59,82,139],[33,145,140],[94,201,98],[253,231,37]],RdBu:[[178,24,43],[244,165,130],[247,247,247],[146,197,222],[33,102,172]]};
 function rgb(name,t){if(name==='jet')return [3,2,1].map(k=>Math.round(255*Math.max(0,Math.min(1,1.5-Math.abs(4*t-k)))));const a=anchors[name],v=t*(a.length-1),i=Math.min(a.length-2,Math.floor(v));return a[i].map((c,j)=>Math.round(c+(a[i+1][j]-c)*(v-i)));}
 function convert(c){const [r,g,b]=c;const m={protan:[[.567,.433,0],[.558,.442,0],[0,.242,.758]],deutan:[[.625,.375,0],[.7,.3,0],[0,.3,.7]],tritan:[[.95,.05,0],[0,.433,.567],[0,.475,.525]]}[mode];if(mode==='gray'){const l=.2126*r+.7152*g+.0722*b;return [l,l,l];}return m?m.map(row=>row.reduce((s,v,i)=>s+v*c[i],0)):c;}
 function lum(c){const v=c.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];}
 function paint(){
  mount.innerHTML=`<div class="viz-head"><strong>${en()?'One field, three colour maps':'同一份数据，三种色图'}</strong></div><label>${en()?'Viewing condition':'观察条件'} <select class="color-mode">${Object.entries(opts).map(([k,v])=>`<option value="${k}" ${k===mode?'selected':''}>${v[en()?1:0]}</option>`).join('')}</select></label><div class="color-panels"></div><p class="viz-note">${en()?'All panels show identical values from 0 (left) to 1 (right). Lower curves show relative luminance, not the data. Viridis is sequential; RdBu is diverging and needs a meaningful midpoint. Simulations are educational approximations, not a clinical assessment.':'三幅图的数据相同：由左侧 0 增长到右侧 1。下方曲线是相对亮度，不是原始数据。Viridis 适合连续数值；RdBu 适合存在有意义中点的发散数据。色觉模拟仅为教学近似，不能替代实际可访问性评估。'}</p>`;
  mount.querySelector('select').onchange=e=>{mode=e.target.value;paint();};
  for(const name of ['jet','viridis','RdBu']){const card=document.createElement('div');card.innerHTML=`<h4>${name}</h4><canvas width="360" height="150" role="img" aria-label="${name}"></canvas><svg viewBox="0 0 360 85" aria-label="${en()?'Relative luminance':'相对亮度'}"></svg>`;mount.querySelector('.color-panels').append(card);const ctx=card.querySelector('canvas').getContext('2d');for(let x=0;x<360;x++){const c=convert(rgb(name,x/359));ctx.fillStyle=`rgb(${c.join(',')})`;ctx.fillRect(x,0,1,150);}const path=Array.from({length:180},(_,i)=>`${i?'L':'M'}${i*2},${77-lum(convert(rgb(name,i/179)))*68}`).join(' ');card.querySelector('svg').innerHTML=`<path d="M0 77H360" stroke="#cbd5e1"/><path d="${path}" fill="none" stroke="#334155" stroke-width="2"/>`;}
 }
 paint();document.addEventListener('wbl:localechange',paint);
}
