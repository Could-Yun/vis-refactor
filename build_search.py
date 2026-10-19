"""Refresh tool entries and rebuild the search posting lists."""
from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parent
p=ROOT/'search-index.json';index=json.loads(p.read_text(encoding='utf-8'))
docs=[d for d in index['docs'] if not d.get('tool')]
entries=[
 ('index.html#choose','图表选型实验室','Chart selection lab','字段类型、任务、视觉编码、条形图、散点图、折线图、直方图、热力图','Field types, analysis tasks, visual encoding, bar charts, scatter plots, line charts, histograms and heatmaps'),
 ('lesson-03/#ch-3-1','色彩感知对比器','Colour perception comparison','jet、viridis、RdBu、亮度曲线、灰度、色觉近似模拟','jet, viridis, RdBu, luminance curves, grayscale and approximate colour vision simulation'),
 ('demos/regression.html','交互式线性回归','Interactive linear regression','拖动散点更新拟合线与 R²，相关不等于因果','Drag points to update the fit and R squared; correlation is not causation'),
]
for u,zh,en,zs,es in entries:
 for lang,title,snip,crumb in [('zh',zh,zs,'交互实验'),('en',en,es,'Interactive lab')]:docs.append({'u':u,'c':crumb,'t':title,'s':snip,'l':lang,'tool':True})
def grams(s):
 low=s.lower();out=re.findall(r'[a-z0-9_.+#-]{2,}',low)
 for run in re.sub(r'[^一-鿿]',' ',low).split():
  out.extend([run] if len(run)==1 else [run[i:i+2] for i in range(len(run)-1)])
 return set(out)
inv={}
for i,d in enumerate(docs):
 for g in grams(' '.join(str(d.get(k,'')) for k in ['t','s','c'])):inv.setdefault(g,[]).append(i)
p.write_text(json.dumps({'docs':docs,'inv':inv},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(f'Search index: {len(docs)} records, {len(inv)} terms')
