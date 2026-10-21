from pathlib import Path
import functools,http.server,threading,json,sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'交付物'
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=s.serve_forever,daemon=True).start()
base=sys.argv[1] if len(sys.argv)>1 else f'http://127.0.0.1:{s.server_port}/'
fixture={'01':['ch-1-1','ch-1-2'],'02':['ch-2-1','ch-2-2','ch-2-3'],'03':['ch-3-1'],'__last':{'chapter':'02','id':'ch-2-3'}}
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True)
 page=b.new_page(viewport={'width':1440,'height':1100})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base,wait_until='networkidle')
 assert page.locator('.portal-resume').inner_text()=='开始学习 →'
 assert page.locator('.card-learning').count()==5
 page.evaluate('(data)=>localStorage.setItem("vis-progress",JSON.stringify(data))',fixture)
 page.reload(wait_until='networkidle')
 assert page.locator('.portal-resume').get_attribute('href')=='lesson-02/#ch-2-3'
 assert '6 / 27' in page.locator('.learning-disclaimer').inner_text()
 for width,lang,name in [(1440,'zh-CN','桌面'),(390,'zh-CN','手机'),(390,'en-US','英文手机'),(1440,'en-US','英文桌面')]:
  page.set_viewport_size({'width':width,'height':1100})
  page.evaluate('(l)=>window.__i18n.setLocale(l)',lang)
  page.locator('#chapters').scroll_into_view_if_needed()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
  for card in page.locator('#chapters .card').all():
   badge=card.locator('.card-status').bounding_box();ring=card.locator('.card-progress').bounding_box()
   assert ring['y']>=badge['y']+badge['height'],(width,lang,badge,ring)
  overview=page.locator('.learning-overview').bounding_box();cards=page.locator('#chapters .cards').bounding_box()
  assert cards['y']-overview['y']-overview['height']>=27
  page.screenshot(path=str(OUT/f'章节区-{name}.png'))
 page.locator('.portal-resume').click()
 page.wait_for_load_state('networkidle')
 assert page.url.endswith('lesson-02/#ch-2-3')
 assert not errors,errors
 print(json.dumps({'passed':True,'viewports':4,'resume':page.url,'errors':errors},ensure_ascii=False))
 b.close()
s.shutdown()
