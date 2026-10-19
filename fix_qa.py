from pathlib import Path
ROOT=Path(__file__).resolve().parent
for p in (ROOT/'demos').glob('calendar*.html'):
 s=p.read_text(encoding='utf-8').replace('../data/calendar_data_modified.csv','./data/calendar_data_modified.csv')
 p.write_text(s,encoding='utf-8')
p=ROOT/'demos/regression.html';s=p.read_text(encoding='utf-8')
s=s.replace('<script src="../assets/vendor/d3-regression.min.js"></script>','<script>window.baseD3=window.d3;</script><script src="../assets/vendor/d3-regression.min.js"></script><script>Object.assign(window.baseD3,window.d3);window.d3=window.baseD3;delete window.baseD3;</script>')
p.write_text(s,encoding='utf-8')
print('Calendar data paths and regression plugin namespace corrected.')
