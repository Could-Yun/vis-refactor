from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urlsplit, unquote
from html.parser import HTMLParser
import re, json, hashlib

ROOT=Path(__file__).resolve().parent
vendor=ROOT/'assets/vendor';vendor.mkdir(exist_ok=True)
for name,url in [('d3.v7.min.js','https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js'),('d3-regression.min.js','https://cdn.jsdelivr.net/npm/d3-regression@1.3.10/dist/d3-regression.min.js')]:
    if not (vendor/name).exists():
        with urlopen(url,timeout=45) as r:(vendor/name).write_bytes(r.read())
# Export every named D3 member required by the retained lessons.
sources=list(ROOT.rglob('*.js'))+list(ROOT.rglob('*.html'))
names=sorted(set(re.findall(r'\bd3\.([A-Za-z_]\w*)','\n'.join(p.read_text(encoding='utf-8') for p in sources if 'vendor' not in p.parts))))
(vendor/'d3-local.js').write_text('import "./d3.v7.min.js";\nconst d3=globalThis.d3;\n'+''.join(f'export const {n}=d3.{n};\n' for n in names),encoding='utf-8')
for p in sources:
    if 'vendor' in p.parts:continue
    s=p.read_text(encoding='utf-8');old=s
    import os
    def rel(target):
        r=os.path.relpath(target,p.parent).replace('\\','/');return r if r.startswith('.') else './'+r
    s=s.replace('https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm',rel(vendor/'d3-local.js'))
    s=s.replace('https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',rel(vendor/'d3.v7.min.js'))
    s=s.replace('https://cdn.jsdelivr.net/npm/d3-regression@1.3.10/dist/d3-regression.min.js',rel(vendor/'d3-regression.min.js'))
    if s!=old:p.write_text(s,encoding='utf-8')
p=ROOT/'index.html';s=p.read_text(encoding='utf-8')
if 'data-viz="chart-chooser"' not in s:s=s.replace('<section id="chapters"', '<section class="section" id="choose"><h2><span data-lang="zh-CN">图表选型实验室</span><span data-lang="en-US" hidden>Chart selection lab</span></h2><div class="viz-mount" data-viz="chart-chooser"></div></section>\n<section id="chapters"',1)
p.write_text(s,encoding='utf-8')
for chapter,kind in [('lesson-01','chart-chooser'),('lesson-02','chart-chooser'),('lesson-04','chart-chooser'),('lesson-03','color-compare')]:
    p=ROOT/chapter/'index.html';s=p.read_text(encoding='utf-8')
    if f'data-viz="{kind}"' not in s:
        start=s.find('<article');end=s.find('</article>',start)
        s=s[:end]+f'<div class="viz-mount" data-viz="{kind}"></div>\n'+s[end:]
    # Correct existing pager labels from the target href rather than stale numbering.
    s=re.sub(r'(<a class="pager-(?:prev|next)" href="../lesson-(\d+)/">.*?<span class="pager-title" data-i18n=")ch\.\d+\.full',lambda m:m[1]+f'ch.{int(m[2])}.full',s,flags=re.S)
    p.write_text(s,encoding='utf-8')
p=ROOT/'assets/css/features.css';s=p.read_text(encoding='utf-8')
if '.chooser-grid' not in s:s+='''
.tool-options{display:flex;flex-wrap:wrap;gap:.5rem;margin:.8rem 0}
.chooser-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:center}
.chooser-grid h3{font-size:1.5rem;margin:.5rem 0;color:#4338ca}
.color-panels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin-top:1rem}
.color-panels canvas{width:100%;height:auto;display:block;border-radius:8px}
.color-panels h4{margin:.6rem 0}.color-mode{font:inherit;padding:.4rem;border:1px solid #cbd5e1;border-radius:6px;max-width:100%}
.viz-mount{min-width:0}.viz-mount svg{overflow:visible}
@media(max-width:700px){.chooser-grid,.color-panels{grid-template-columns:1fr}}
'''
p.write_text(s,encoding='utf-8')
# The retained regression example previously defined a regression but rendered nothing.
(ROOT/'demos/regression.html').write_text('''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Linear regression · 线性回归</title><link rel="stylesheet" href="../assets/css/portal.css"><body><main class="section"><a href="./">← Demo</a><h1><span data-lang="zh-CN">散点与线性回归</span><span data-lang="en-US" hidden>Scatter and linear regression</span></h1><p data-lang="zh-CN">拖动任意数据点，观察最小二乘拟合线如何改变。相关不等于因果。</p><p data-lang="en-US" hidden>Drag a point to update the least-squares fit. Correlation is not causation.</p><svg id="regression" viewBox="0 0 700 400" style="width:100%;max-width:900px"></svg><p id="fit"></p></main><script src="../assets/vendor/d3.v7.min.js"></script><script src="../assets/vendor/d3-regression.min.js"></script><script type="module" src="../assets/js/i18n.js"></script><script>
const points=[{x:8,y:3},{x:2,y:10},{x:11,y:3},{x:6,y:6},{x:5,y:8},{x:4,y:12},{x:12,y:1},{x:9,y:4},{x:6,y:9},{x:1,y:14}];const svg=d3.select('#regression'),x=d3.scaleLinear().domain([0,14]).range([45,670]),y=d3.scaleLinear().domain([0,16]).range([350,20]);svg.append('g').attr('transform','translate(0,350)').call(d3.axisBottom(x));svg.append('g').attr('transform','translate(45,0)').call(d3.axisLeft(y));const line=svg.append('path').attr('stroke','#4338ca').attr('stroke-width',3).attr('fill','none');const dots=svg.selectAll('circle').data(points).join('circle').attr('r',7).attr('fill','#0ea5e9').style('cursor','grab').call(d3.drag().on('drag',(e,d)=>{d.x=x.invert(Math.max(45,Math.min(670,e.x)));d.y=y.invert(Math.max(20,Math.min(350,e.y)));paint();}));function paint(){dots.attr('cx',d=>x(d.x)).attr('cy',d=>y(d.y));const fit=d3.regressionLinear().x(d=>d.x).y(d=>d.y).domain([0,14])(points);line.attr('d',d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(fit));document.querySelector('#fit').textContent='y = '+fit.a.toFixed(3)+'x + '+fit.b.toFixed(3)+' · R² = '+fit.rSquared.toFixed(3);}paint();</script></body></html>''',encoding='utf-8')
# Content versions for HTML-referenced modules/styles and dynamic imports.
for p in list(ROOT.rglob('*.html'))+list((ROOT/'assets/js').rglob('*.js')):
    s=p.read_text(encoding='utf-8');s=re.sub(r'\?v=[a-zA-Z0-9]+','?v=20261019',s);p.write_text(s,encoding='utf-8')
(ROOT/'.nojekyll').touch()
print('Local dependencies, tools and regression demo updated.')
