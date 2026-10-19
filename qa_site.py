from pathlib import Path
import json, re, threading, functools, http.server,sys
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'交付物';OUT.mkdir(exist_ok=True)
class Parse(HTMLParser):
    def __init__(self):super().__init__();self.refs=[];self.ids=set()
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'):self.ids.add(a['id'])
        for k in ['src','href']:
            if a.get(k):self.refs.append(a[k])
bad=[]
for p in ROOT.rglob('*.html'):
    h=Parse();h.feed(p.read_text(encoding='utf-8'))
    for ref in h.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc or not u.path:continue
        target=(p.parent/unquote(u.path)).resolve()
        if target.is_dir():target=target/'index.html'
        if not target.exists():bad.append({'page':str(p.relative_to(ROOT)),'ref':ref})
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
if len(sys.argv)>1:base=sys.argv[1].rstrip('/')+'/'
report={'missingLinks':bad,'pages':[],'interaction':{}}
with sync_playwright() as pw:
    browser=pw.chromium.launch(channel='msedge',headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1000})
    errors=[];failed=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r:failed.append(r.url) if r.status>=400 and r.url.startswith(base) else None)
    paths=['index.html']+[f'lesson-{n:02d}/' for n in range(1,6)]+['demos/']+[str(p.relative_to(ROOT)).replace('\\','/') for p in (ROOT/'demos').glob('*.html') if p.name!='index.html']
    for path in paths:
        errors.clear();failed.clear()
        try:
            page.goto(base+path,wait_until='networkidle',timeout=30000)
            page.wait_for_timeout(350)
            report['pages'].append({'path':path,'errors':list(errors),'failed':list(failed),'svg':page.locator('svg').count()})
        except Exception as e:report['pages'].append({'path':path,'error':str(e)})
    page.goto(base,wait_until='networkidle')
    page.locator('#choose').scroll_into_view_if_needed()
    page.locator('[data-case="relation"]').click()
    report['interaction']['chooser']=page.locator('#choose h3').inner_text()
    page.screenshot(path=str(OUT/'首页.png'),full_page=True)
    page.evaluate("window.__i18n.setLocale('en-US')")
    report['interaction']['chooserEnglish']=page.locator('#choose h3').inner_text()
    page.locator('.search-open').click();page.locator('.search-overlay input').fill('color')
    page.wait_for_function("window.__features?.Search?.idx !== null",timeout=30000)
    page.wait_for_timeout(500)
    report['interaction']['searchEnglish']=page.locator('.search-results a').count()
    page.keyboard.press('Escape')
    page.goto(base+'lesson-03/',wait_until='networkidle')
    page.locator('[data-viz="color-compare"]').scroll_into_view_if_needed()
    page.locator('.color-mode').select_option('gray')
    report['interaction']['colorCanvases']=page.locator('.color-panels canvas').count()
    page.locator('[data-viz="color-compare"]').screenshot(path=str(OUT/'色彩对比器.png'))
    page.set_viewport_size({'width':390,'height':844})
    page.goto(base,wait_until='networkidle')
    report['interaction']['mobileOverflow']=page.evaluate('document.documentElement.scrollWidth-innerWidth')
    report['lessonTabs']=[]
    page.set_viewport_size({'width':1440,'height':1000})
    for n in range(1,6):
        page.goto(base+f'lesson-{n:02d}/',wait_until='networkidle')
        ids=page.locator('.chapter-nav a[data-chapter]').evaluate_all('(els)=>els.map(e=>e.dataset.chapter)')
        for ident in ids:
            errors.clear();failed.clear()
            page.locator(f'.chapter-nav a[data-chapter="{ident}"]').click()
            article=page.locator('#'+ident)
            for button in article.locator('.tab-btn').all():
                button.click();page.wait_for_timeout(220)
            report['lessonTabs'].append({'id':ident,'errors':list(errors),'failed':list(failed)})
    browser.close()
server.shutdown()
filename='线上验收报告.json' if len(sys.argv)>1 else '验收报告.json'
(OUT/filename).write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
