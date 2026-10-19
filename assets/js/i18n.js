// =============================================================
// i18n.js — 中英文切换核心（v1.0 · 2026-09-09）
// 用法：
//   - 在 HTML 节点上加 data-i18n="key"
//   - 引入 <script type="module" src="../i18n.js"></script>
//   - 用户切换：调用 window.__i18n.setLocale('en')
//   - URL 自动识别 ?lang=en
//   - localStorage('wbl-locale') 持久化
// =============================================================

// ---------- 翻译字典 ----------
const I18N = {
  'zh-CN': {
    'demo.tableshow.name': '数据表渲染',
    'demo.tableshow.desc': '用 d3 把新生 CSV 渲染成可读数据表，演示最朴素的「数据 → 视图」绑定。',
    'demo.newstudent.name': '新生数据总览',
    'demo.newstudent.desc': '同一份新生数据的概览视图，配合 1.1 节的数据生成与字段定义。',
    'demo.treelist.name': '树形列表',
    'demo.treelist.desc': '专业 → 班级 → 学生的可折叠层级列表，演示 classed 与事件委托。',
    'demo.nssystem.name': '新生信息系统',
    'demo.nssystem.desc': '把表格、树、筛选拼成一个小系统，对应 Card 数据流模型的完整链路。',
    'demo.sex_compare.name': '男女对比配色',
    'demo.sex_compare.desc': '二分类数据的配色选择：定性色对与发散色的差别。',
    'demo.crime1985.name': '1985 犯罪数据散点',
    'demo.crime1985.desc': '双变量散点图，4.1 节数据转换的原始案例。',
    'demo.regression.name': '线性回归拟合',
    'demo.regression.desc': '用 d3-regression 做最小二乘拟合并画出回归线，对应 4.3 曲线拟合。',
    'demo.mark.name': '标记与通道',
    'demo.mark.desc': '点、线、面三类标记与位置、颜色、形状通道的组合演示。',
    'demo.contour.name': '等值线（手写 Marching Squares）',
    'demo.contour.desc': '从 10×10 高程网格自己实现等值线追踪，对应 4.5 节。',
    'demo.contourd3.name': '等值线（d3.contours）',
    'demo.contourd3.desc': '同一数据改用 d3.contours，和手写版对照看算法封装的取舍。',
    'demo.colormap.name': '等值线 + Viridis 配色',
    'demo.colormap.desc': '等值线叠加感知均匀 colormap，把第 3、4 章串起来。',
    'demo.calendar.name': '螺旋时间轴日历 · 版本 1',
    'demo.calendar.desc': '2008 年数据沿阿基米德螺旋排布，周期对齐在同一角度上。',
    'demo.calendar1.name': '螺旋时间轴日历 · 版本 2',
    'demo.calendar1.desc': '同一数据的第二次迭代，调整了日/周粒度与标注方式。',
    'demo.calendar3.name': '螺旋时间轴日历 · 版本 3',
    'demo.calendar3.desc': '最完整的一版，月份分隔与热力映射都更明显。',
    'ch.1.full': '第 1 章 数据',
    'ch.2.full': '第 2 章 数据可视化流程',
    'ch.3.full': '第 3 章 色彩专题',
    'ch.4.full': '第 4 章 低维数据可视化',
    'ch.5.full': '第 5 章 时序数据可视化',
    'lesson.1.subtitle': 'Doc-01 集成教学页面 · 讲解 ⇄ 代码 ⇄ 演示 三 tab 切换',
    'lesson.2.subtitle': 'Doc-02 集成教学页面 · 讲解 ⇄ 代码 ⇄ 演示 三 tab 切换',
    'lesson.3.subtitle': 'Doc-03 集成教学页面 · 讲解 ⇄ 代码 ⇄ 演示 三 tab 切换 · 8 个小节',
    'lesson.4.subtitle': 'Doc-04 集成教学页面 · 讲解 ⇄ 代码 ⇄ 演示 三 tab 切换 · 5 个小节',
    'lesson.5.subtitle': 'Doc-05 集成教学页面 · 讲解 ⇄ 代码 ⇄ 演示 三 tab 切换 · 5 个小节',
    'header.tip': '切换章节 · 每个章节内三 tab 自由切换',
    'xref.4.colormap': '🎨 本节使用了 colormap（Viridis）画热图。colormap 理论详见 <a href="../lesson-03/#ch-3-2">第 3 章 3.2 colormap 三类选择</a>。',
    'code.2.input-array': '// 输入数组',
    'code.2.key1': '// key1（外层）',
    'code.2.key2': '// key2（内层，可选）',
    'code.2.add-class': '// 1) 添加 class',
    'code.2.remove-class': '// 2) 移除 class',
    'code.2.toggle-class': '// 3) 函数式批量切换',
    'card-01.doc': '3. 数据',
    'card-02.doc': '4. 数据可视化流程',
    'card-04.doc': '5. 低维数据可视化',
    'card-05.doc': '6. 时序数据可视化',
    'card-01.tag1': 'DIKW 金字塔',
    'card-01.tag2': 'Stevens 4 尺度',
    'card-01.tag3': '8 个 D3 变换函数',
    'card-01.tag4': 'Selection 三态',
    'card-02.tag1': 'Card 模型',
    'card-02.tag2': '事件委托',
    'card-03.tag1': '4 颜色空间 + CVD',
    'card-03.tag2': '5 大色系规则',
    'card-03.tag3': '鲜艳+低饱和',
    'card-03.tag4': 'CVD 论文图测',
    'card-04.tag1': '三层坐标变换',
    'card-04.tag2': '10 种曲线',
    'card-05.tag1': '时间分解',
    'card-05.tag2': '日历 colormap',
    'card-05.tag3': '极坐标变换',
    'portal.howto.h2': '▶️ 使用方式',
    'portal.about.h2': 'ℹ️ 关于本课程',
    'ui.search.placeholder': '搜索全站内容…',
    'ui.search.open': '搜索',
    'ui.search.hint': '输入关键词后回车跳转',
    'ui.search.empty': '没有匹配结果',
    'ui.search.count': '个结果',
    'ui.toc.title': '本章目录',
    'ui.progress.label': '本章阅读进度',
    'ui.resume': '继续上次阅读',
    'ui.demos.title': '补充 Demo 集合',
    'ui.demos.nav': '🧪 Demo 集合',
    'ui.demos.lead': '按章节组织的独立演示页，可单独打开讲解。',
    'ui.map.title': '课程知识地图',
    'ui.map.lead': '节点为核心概念，连线表示前置依赖。点击节点跳到对应小节。',
    'ui.chooser.title': '图表选型决策流',
    'ui.mackinlay.title': 'Mackinlay 视觉通道排序',
    'ui.colorcmp.title': '色彩感知对比器',
    'demos.note.ch3': '本章理论配套的交互对比器已内置在第 3 章页面（色彩感知对比器），此处只保留原始 demo。',
    'demos.note.ch5': '三个版本用同一份 calendar_data_modified.csv，是同一演示的三次迭代，可对照看设计取舍。',
    'demos.removed.title': '已移除的两个链接',
    'demos.removed.body': '原站此处有 <code>volumeRendering.html</code> 与 <code>yearcalendar.html</code> 两个链接，但仓库中<strong>不存在对应文件</strong>，线上实测均为 404。前者所需的 <code>utils/volumeRendering.js</code> 虽然存在，却要加载一份原始体数据（<code>loadRawVolumeData(url, dimensions)</code>），而该数据文件在仓库中缺失，因此无法重建为可运行页面；后者没有任何对应源码。为避免继续给出死链，本次重构移除了这两个入口并在此说明。',
    'demos.nav': 'Demo 集合',
    'common.back': '← 返回课程门户',   // 回填：原中文词典缺失
    'supp.ch1': '第 1 章 · 数据',   // 回填：原中文词典缺失
    'supp.ch2': '第 2 章 · 数据可视化流程',   // 回填：原中文词典缺失
    'supp.ch3': '第 3 章 · 色彩专题',   // 回填：原中文词典缺失
    'supp.ch4': '第 4 章 · 低维数据可视化',   // 回填：原中文词典缺失
    'supp.ch5': '第 5 章 · 时序数据可视化',   // 回填：原中文词典缺失
    'supp.hint1': '对应 doc-01：1.1 数据生成',   // 回填：原中文词典缺失
    'supp.hint2': '对应 doc-02：4.4 树形列表',   // 回填：原中文词典缺失
    'supp.hint3': '对应 doc-03：3.4 5 大色系',   // 回填：原中文词典缺失
    'supp.hint4': '对应 doc-04：4.1 数据转换 / 4.3 曲线拟合 / 4.5 等值线',   // 回填：原中文词典缺失
    'supp.hint5': '对应 doc-05：5.3 日历热图 / 5.4 阿基米德螺旋',   // 回填：原中文词典缺失
    'supp.tagline': '与课程章节配合的实战 demo，可单独打开讲解',   // 回填：原中文词典缺失
    'supp.title': '补充 Demo 集合',   // 回填：原中文词典缺失
    // === 顶部导航 ===
    'nav.home': '课程门户',
    'nav.ch1': '第 1 章 · 数据',
    'nav.ch2': '第 2 章 · 数据可视化流程',
    'nav.ch3': '第 3 章 · 色彩专题',
    'nav.ch4': '第 4 章 · 低维可视化',
    'nav.ch5': '第 5 章 · 时序可视化',
    'nav.back': '← 返回课程门户',
    'nav.lang.zh': '中',
    'nav.lang.en': 'EN',
    'nav.lang.label': '切换语言',
    'nav.toc': '章节目录',

    // === Tab 按钮 ===
    'tab.explain': '📖 讲解',
    'tab.code': '⌨️ 关键代码',
    'tab.demo': '▶️ 演示',

    // === 公共 ===
    'common.loading': '加载中…',
    'common.your-case': '你的原案例',
    'common.theory': '嵌入陈为教材理论',
    'common.key-code': '⭐ 关键代码',
    'common.full-lecture': '↗ 完整讲义 markdown',
    'common.supplementary': '↗ 补充 demo 集合',
    'common.prev': '← 上一章',
    'common.next': '下一章 →',
    'common.prev.aria': '上一章',
    'common.next.aria': '下一章',
    'common.enter': '进入章节 →',
    'common.live': '✅ 已上线',
    'common.maps-to': '对应你的文档：',

    // === 章节标题（lesson-01 数据）===
    'sec-01-1.title': '1.1 数据生成',
    'sec-01-1.subtitle': '基于新生数据（DeepSeek 合成）讲解异步加载与字段映射',
    'sec-01-2.title': '1.2 数据定义',
    'sec-01-2.subtitle': 'DIKW 金字塔 —— 数据 → 信息 → 知识 → 智慧',
    'sec-01-3.title': '1.3 数据属性',
    'sec-01-3.subtitle': 'Stevens 测量尺度 × Mackinlay 视觉通道排序',
    'sec-01-4.title': '1.4 数据变换',
    'sec-01-4.subtitle': 'D3 8 个函数式数组操作',
    'sec-01-5.title': '1.5 D3 数据选择器',
    'sec-01-5.subtitle': 'Selection 与 enter / update / exit 三态模型',

    // === 章节标题（lesson-02 流程）===
    'sec-02-1.title': '2.1 数据可视化流程',
    'sec-02-1.subtitle': '从「拿到一张表」到「画出一张图」的完整链路',
    'sec-02-2.title': '2.2 数据变换：原数据 → 数据表',
    'sec-02-2.subtitle': 'Card 模型 D→T 阶段：清洗、聚合、连接、派生',
    'sec-02-3.title': '2.3 视觉映射：数据表 → 视觉结构',
    'sec-02-3.subtitle': 'Mackinlay 通道排名 + 图元/通道 + 树布局实例',
    'sec-02-4.title': '2.4 视图渲染与用户交互',
    'sec-02-4.subtitle': '视觉结构 → 视图渲染 + 动画 + 事件反馈循环',

    // === 章节标题（lesson-03 色彩）===
    'sec-03-1.title': '3.1 颜色模型基础',
    'sec-03-1.subtitle': '为什么需要 4 种颜色空间？它们各自擅长什么？',
    'sec-03-2.title': '3.2 colormap 三类选择',
    'sec-03-2.subtitle': '顺序型 / 发散型 / 定性型。选错类型 = 误导读者',
    'sec-03-3.title': '3.3 CIE Lab 色域图',
    'sec-03-3.subtitle': '在感知均匀的颜色空间里，色域长什么样？',
    'sec-03-4.title': '3.4 色系搭配规则（5 大类）',
    'sec-03-4.subtitle': '单色 / 类比 / 互补 / 三等分 / 分裂互补',
    'sec-03-5.title': '3.5 科研经典配色',
    'sec-03-5.subtitle': 'Wong / Paul Tol / Okabe-Ito / Tableau — 顶标都在用什么',
    'sec-03-6.title': '3.6 对错案例对比',
    'sec-03-6.subtitle': '4 张图，4 错 1 对。点击你认为对的那张',
    'sec-03-7.title': '3.7 鲜艳 + 低饱和 哲学生成器',
    'sec-03-7.subtitle': '颜色数量 ≤ 7、鲜艳颜色 + 低饱和度 = 好看又耐看',
    'sec-03-8.title': '3.8 CVD 论文图测',
    'sec-03-8.subtitle': '你的图在色盲眼里还看得懂吗？',

    // === 章节标题（lesson-04 低维）===
    'sec-04-1.title': '4.1 数据转换',
    'sec-04-1.subtitle': '你的 Crime 数据是宽格式，可视化常需要长格式',
    'sec-04-2.title': '4.2 坐标轴变换',
    'sec-04-2.subtitle': '数据空间 → 坐标系空间 → 屏幕空间。三层职责分明',
    'sec-04-3.title': '4.3 曲线拟合',
    'sec-04-3.subtitle': '同 50 个点，用 10 种 line.curve 画风各异',
    'sec-04-4.title': '4.4 倾角感知（45° 黄金角）',
    'sec-04-4.subtitle': '人眼对斜率的估计不是线性的。45° 是视觉"中点"',
    'sec-04-5.title': '4.5 等值线（Marching Squares）',
    'sec-04-5.subtitle': '给定标量场 + 阈值，追踪"值 = 阈值"的曲线',

    // === 章节标题（lesson-05 时序）===
    'sec-05-1.title': '5.1 时间属性',
    'sec-05-1.subtitle': '时间有 5 个核心属性：有序/连续/周期/独立于空间/结构性',
    'sec-05-2.title': '5.2 标准时间可视化（折线图）',
    'sec-05-2.subtitle': 'x 轴 = 时间，y 轴 = 度量',
    'sec-05-3.title': '5.3 日历热图（van Wijk）',
    'sec-05-3.subtitle': '以"年=行 / 周=列"展示全年数据',
    'sec-05-4.title': '5.4 周期时间可视化（阿基米德螺旋）',
    'sec-05-4.subtitle': '将时间沿圆周排列，发现周期性',
    'sec-05-5.title': '5.5 Storyline 时间线（侏罗纪公园）',
    'sec-05-5.subtitle': '多角色叙事：每条线 = 一个角色 / 组织 / 进程',

    // === Portal 主页 ===
    'portal.title': '《可视化导论》',
    'footer.meta': '零依赖 · D3.js v7 · 部署于 WorkBuddy Sites',

    'footer.copyright': '© 2026 《可视化导论》课程 · 中国石油大学（华东）· 授课教师：<a href="https://cinger007.github.io" target="_blank" rel="noopener" class="teacher-link">李昕</a> · 主要参考教材：陈为《可视化导论》',

    'portal.cards.color-bold': '颜色是可视化基础',

    'portal.cards.source-prefix': '独立专题：',

    'portal.cta.enter3': '进入专题 →',

    'portal.cta.enter1': '进入章节 →',

    'portal.nav.about': 'ℹ️ 关于',

    'portal.nav.howto': '▶️ 使用方式',

    'portal.nav.chapters': '📚 章节',

    'portal.hero.meta': '中国石油大学（华东）· 授课教师：<a href="https://cinger007.github.io" target="_blank" rel="noopener" class="teacher-link">李昕</a> · 主要参考教材：陈为《可视化导论》',

    'portal.hero.subtitle': '从数据到图表：JavaScript + D3.js 实战课程',

    'portal.hero.tag': 'VISUALIZATION · INTRODUCTION',

    'portal.hero.h1': '《可视化导论》',

    'portal.tagline': '课程章节',
    'portal.intro': '点击任一卡片进入该章节，每章节含 3 个 tab：📖 讲解 / ⌨️ 关键代码 / ▶️ 演示。',
    'portal.section.usage': '使用方式',
    'portal.section.about': '关于本课程',
    'portal.usage.classroom.title': '课堂讲解',
    'portal.usage.classroom.desc': '打开任一章节后，左侧选小节，顶部切换 讲解 / 代码 / 演示 三个 tab，一边讲解、一边实时运行。',
    'portal.usage.student.title': '学生自学',
    'portal.usage.student.desc': '按章节顺序过完所有 ⭐ 关键点，每个关键点配有「为什么这么写」+「有什么坑」段落。',
    'portal.usage.teacher.title': '教师备课时',
    'portal.usage.teacher.desc': '每个章节有 1 套独立的 demo/ 子目录，可以单独跑、单独改、单独打包给学生。',
    'portal.usage.lan.title': '局域网使用',
    'portal.usage.lan.desc': '若公网不通，可在本机跑 python -m http.server 8080，学生连同一 WiFi 即可访问。',
    'portal.about.theory': '理论来源',
    'portal.about.theory.desc': '陈为《可视化导论》、Mackinlay 1986、Stevens 1946、Cleveland 1984、Bostock D3 官方文档、Card 1999 数据流模型。',
    'portal.about.principle': '设计原则',
    'portal.about.principle.desc': '案例为中心（不是理论为中心）。每个知识点都嵌入到用户的实践案例里，配 ⭐ 关键点解释 + 可运行演示。',
    'portal.about.stack': '技术栈',
    'portal.about.stack.desc': '零依赖：纯 HTML + CSS + ES modules + D3.js v7 (CDN)。本地一条命令 python -m http.server 启动，无需 npm。',
    'portal.about.data': '数据集',
    'portal.about.data.desc': '新生数据 CSV 与 Crime 数据等都已打包进 data/ 目录，浏览器 fetch 加载，离线可用。',

    // === 5 张卡片 ===
    'card-01.num': '第 1 章',
    'card-01.title': '数据',
    'card-01.desc': '从 DeepSeek 合成新生数据出发，展开数据生成、DIKW、Stevens 测量尺度、Mackinlay 视觉通道、D3 数据变换与 Data-Join 三态。',
    'card-01.tags': 'DIKW 金字塔 · Stevens 4 尺度 · 8 个 D3 变换函数 · Selection 三态',
    'card-02.num': '第 2 章',
    'card-02.title': '数据可视化流程',
    'card-02.desc': 'Card 数据流模型、新生数据 → 分类树 → 树形列表的完整链路，Reingold-Tilford 布局、DOM 事件机制。',
    'card-02.tags': 'Card 模型 · d3.rollup · Reingold-Tilford · 事件委托',
    'card-03.num': '第 3 章',
    'card-03.title': '色彩专题',
    'card-03.desc': '独立专题：颜色是可视化基础。颜色模型 + colormap + Lab 色域 + 5 大色系 + 经典科研配色 + 对错案例 + 鲜艳+低饱和哲学生成器 + CVD 论文图测。8 小节，配色一站式。',
    'card-03.tags': '4 颜色空间 + CVD · Wong / Paul Tol · 5 大色系规则 · 鲜艳+低饱和 · CVD 论文图测',
    'card-04.num': '第 4 章',
    'card-04.title': '低维数据可视化',
    'card-04.desc': 'Crime 数据坐标变换、10 种曲线拟合、Cleveland 45° 倾角、Marching Squares 等值线，共 5 小节。',
    'card-04.tags': '三层坐标变换 · 10 种曲线 · Cleveland 45° · Marching Squares',
    'card-05.num': '第 5 章',
    'card-05.title': '时序数据可视化',
    'card-05.desc': '5 个时间属性、法国人名时间序列、van Wijk 日历热图、阿基米德螺旋日历、Storyline 故事线（《侏罗纪公园》案例）。',
    'card-05.tags': '时间分解 · 日历 colormap · 极坐标变换 · Storygraph',
  },

  'en-US': {
    'demo.tableshow.name': 'Data Table Rendering',
    'demo.tableshow.desc': 'Renders the student CSV into a readable table with d3 — the most basic data-to-view binding.',
    'demo.newstudent.name': 'Student Data Overview',
    'demo.newstudent.desc': 'An overview of the same student dataset, paired with §1.1 on data generation and field definition.',
    'demo.treelist.name': 'Collapsible Tree List',
    'demo.treelist.desc': 'A collapsible major → class → student hierarchy demonstrating classed() and event delegation.',
    'demo.nssystem.name': 'Student Info System',
    'demo.nssystem.desc': 'Table, tree and filters combined into a small system — the full Card pipeline end to end.',
    'demo.sex_compare.name': 'Gender Comparison Palette',
    'demo.sex_compare.desc': 'Palette choice for binary categories: a qualitative pair versus a diverging scale.',
    'demo.crime1985.name': '1985 Crime Scatter',
    'demo.crime1985.desc': 'A bivariate scatter plot — the original case behind §4.1 on data transformation.',
    'demo.regression.name': 'Linear Regression Fit',
    'demo.regression.desc': 'Least-squares fitting with d3-regression and a drawn regression line, matching §4.3.',
    'demo.mark.name': 'Marks and Channels',
    'demo.mark.desc': 'Point, line and area marks combined with position, colour and shape channels.',
    'demo.contour.name': 'Contours (hand-written Marching Squares)',
    'demo.contour.desc': 'Contour tracing implemented from scratch on a 10×10 elevation grid, matching §4.5.',
    'demo.contourd3.name': 'Contours (d3.contours)',
    'demo.contourd3.desc': 'The same data via d3.contours — compare against the hand-written version to see what the abstraction costs.',
    'demo.colormap.name': 'Contours + Viridis',
    'demo.colormap.desc': 'Contours with a perceptually uniform colormap, linking Chapters 3 and 4.',
    'demo.calendar.name': 'Spiral Calendar · v1',
    'demo.calendar.desc': '2008 data laid out along an Archimedean spiral so cycles align at the same angle.',
    'demo.calendar1.name': 'Spiral Calendar · v2',
    'demo.calendar1.desc': 'A second iteration on the same data with different day/week granularity and labelling.',
    'demo.calendar3.name': 'Spiral Calendar · v3',
    'demo.calendar3.desc': 'The most complete version — clearer month separators and heat mapping.',
    'ch.1.full': 'Chapter 1 · Data',
    'ch.2.full': 'Chapter 2 · The Visualization Pipeline',
    'ch.3.full': 'Chapter 3 · Color',
    'ch.4.full': 'Chapter 4 · Low-Dimensional Visualization',
    'ch.5.full': 'Chapter 5 · Time-Series Visualization',
    'lesson.1.subtitle': 'Doc-01 integrated lesson · three tabs: Explain ⇄ Code ⇄ Demo',
    'lesson.2.subtitle': 'Doc-02 integrated lesson · three tabs: Explain ⇄ Code ⇄ Demo',
    'lesson.3.subtitle': 'Doc-03 integrated lesson · three tabs: Explain ⇄ Code ⇄ Demo · 8 sections',
    'lesson.4.subtitle': 'Doc-04 integrated lesson · three tabs: Explain ⇄ Code ⇄ Demo · 5 sections',
    'lesson.5.subtitle': 'Doc-05 integrated lesson · three tabs: Explain ⇄ Code ⇄ Demo · 5 sections',
    'header.tip': 'switches chapters · three tabs inside each chapter',
    'xref.4.colormap': '🎨 This section uses a colormap (Viridis) for the heatmap. For the theory see <a href="../lesson-03/#ch-3-2">Chapter 3 §3.2 The Three Colormap Families</a>.',
    'code.2.input-array': '// input array',
    'code.2.key1': '// key1 (outer level)',
    'code.2.key2': '// key2 (inner level, optional)',
    'code.2.add-class': '// 1) add a class',
    'code.2.remove-class': '// 2) remove a class',
    'code.2.toggle-class': '// 3) functional batch toggle',
    'card-01.doc': '3. Data',
    'card-02.doc': '4. The Visualization Pipeline',
    'card-04.doc': '5. Low-Dimensional Visualization',
    'card-05.doc': '6. Time-Series Visualization',
    'card-01.tag1': 'DIKW pyramid',
    'card-01.tag2': 'Stevens\' four scales',
    'card-01.tag3': '8 D3 transform functions',
    'card-01.tag4': 'Selection enter / update / exit',
    'card-02.tag1': 'Card pipeline model',
    'card-02.tag2': 'Event delegation',
    'card-03.tag1': '4 color spaces + CVD',
    'card-03.tag2': '5 color-scheme rules',
    'card-03.tag3': 'Vivid + desaturated',
    'card-03.tag4': 'CVD figure audit',
    'card-04.tag1': 'Three-layer coordinate transforms',
    'card-04.tag2': '10 curve types',
    'card-05.tag1': 'Time decomposition',
    'card-05.tag2': 'Calendar colormap',
    'card-05.tag3': 'Polar transform',
    'portal.howto.h2': '▶️ How to Use',
    'portal.about.h2': 'ℹ️ About This Course',
    'ui.search.placeholder': 'Search the whole site…',
    'ui.search.open': 'Search',
    'ui.search.hint': 'Type a keyword, press Enter to jump',
    'ui.search.empty': 'No matches',
    'ui.search.count': 'results',
    'ui.toc.title': 'On this page',
    'ui.progress.label': 'Reading progress',
    'ui.resume': 'Resume reading',
    'ui.demos.title': 'Supplementary Demos',
    'ui.demos.nav': '🧪 Demos',
    'ui.demos.lead': 'Standalone demo pages organised by chapter.',
    'ui.map.title': 'Course Knowledge Map',
    'ui.map.lead': 'Nodes are key concepts; edges show prerequisites. Click a node to jump to its section.',
    'ui.chooser.title': 'Chart Chooser',
    'ui.mackinlay.title': 'Mackinlay Channel Ranking',
    'ui.colorcmp.title': 'Colormap Perception Comparator',
    'demos.note.ch3': 'This chapter\'s interactive comparator is built into the Chapter 3 page; only the original demo is kept here.',
    'demos.note.ch5': 'All three versions use the same calendar_data_modified.csv — three iterations of one demo, useful for comparing design choices.',
    'demos.removed.title': 'Two Removed Links',
    'demos.removed.body': 'The original site linked <code>volumeRendering.html</code> and <code>yearcalendar.html</code> here, but <strong>neither file exists</strong> in the repository — both returned HTTP 404 when tested live. The first needs <code>utils/volumeRendering.js</code>, which does exist, but that script loads a raw volume dataset via <code>loadRawVolumeData(url, dimensions)</code> and the data file is missing, so the page cannot be rebuilt as a working demo; the second has no source at all. Both entries were removed rather than left as dead links.',
    'demos.nav': 'Demos',
    // === Top nav ===
    'nav.home': 'Course Portal',
    'nav.ch1': 'Ch 1 · Data',
    'nav.ch2': 'Ch 2 · Viz Workflow',
    'nav.ch3': 'Ch 3 · Color',
    'nav.ch4': 'Ch 4 · Low-Dim',
    'nav.ch5': 'Ch 5 · Time Series',
    'nav.back': '← Back to Portal',
    'nav.lang.zh': '中',
    'nav.lang.en': 'EN',
    'nav.lang.label': 'Switch language',
    'nav.toc': 'Table of Contents',

    // === Tabs ===
    'tab.explain': '📖 Explain',
    'tab.code': '⌨️ Key Code',
    'tab.demo': '▶️ Demo',

    // === Common ===
    'common.loading': 'Loading…',
    'common.your-case': 'Your Original Case',
    'common.theory': "Theory from Chen Wei's Textbook",
    'common.key-code': '⭐ Key Code',
    'common.full-lecture': '↗ Full Lecture Markdown',
    'common.supplementary': '↗ Supplementary Demos',
    'common.prev': '← Previous',
    'common.next': 'Next →',
    'common.prev.aria': 'Previous chapter',
    'common.next.aria': 'Next chapter',
    'common.enter': 'Enter →',
    'common.live': '✅ Live',
    'common.maps-to': 'Maps to your doc:',

    // === Lesson 01: Data ===
    'sec-01-1.title': '1.1 Data Generation',
    'sec-01-1.subtitle': 'Async loading + field mapping using DeepSeek-generated student data',
    'sec-01-2.title': '1.2 Data Definition',
    'sec-01-2.subtitle': 'DIKW pyramid — Data → Information → Knowledge → Wisdom',
    'sec-01-3.title': '1.3 Data Attributes',
    'sec-01-3.subtitle': "Stevens' scales × Mackinlay's visual channel ranking",
    'sec-01-4.title': '1.4 Data Transformation',
    'sec-01-4.subtitle': '8 functional array operations in D3',
    'sec-01-5.title': '1.5 D3 Selectors',
    'sec-01-5.subtitle': 'Selection + enter / update / exit three-phase model',

    // === Lesson 02: Workflow ===
    'sec-02-1.title': '2.1 Visualization Workflow',
    'sec-02-1.subtitle': 'Full pipeline: raw table → final chart',
    'sec-02-2.title': '2.2 Data Transformation: Raw → Data Table',
    'sec-02-2.subtitle': 'Card model D→T stage: cleaning, aggregation, join, derive',
    'sec-02-3.title': '2.3 Visual Mapping: Data → Visual Structure',
    'sec-02-3.subtitle': "Mackinlay's channel ranking + marks/channels + tree layout example",
    'sec-02-4.title': '2.4 View Rendering & User Interaction',
    'sec-02-4.subtitle': 'Visual structure → view rendering + animation + interaction feedback loop',

    // === Lesson 03: Color ===
    'sec-03-1.title': '3.1 Color Model Basics',
    'sec-03-1.subtitle': 'Why 4 color spaces? What are their strengths?',
    'sec-03-2.title': '3.2 Colormap: 3 Types',
    'sec-03-2.subtitle': 'Sequential / Diverging / Categorical. Wrong type = misleading readers.',
    'sec-03-3.title': '3.3 CIE Lab Gamut',
    'sec-03-3.subtitle': 'What does the gamut look like in a perceptually uniform space?',
    'sec-03-4.title': '3.4 Color Harmony Rules (5 Types)',
    'sec-03-4.subtitle': 'Mono / Analogous / Complementary / Triadic / Split-Complementary',
    'sec-03-5.title': '3.5 Classic Research Palettes',
    'sec-03-5.subtitle': 'Wong / Paul Tol / Okabe-Ito / Tableau — what top journals use',
    'sec-03-6.title': '3.6 Right vs Wrong Comparison',
    'sec-03-6.subtitle': '4 charts, 3 wrong 1 right. Click the right one.',
    'sec-03-7.title': '3.7 Vivid + Low-Sat Palette Generator',
    'sec-03-7.subtitle': '≤7 colors, vivid hues + low saturation = pleasant + readable',
    'sec-03-8.title': '3.8 CVD Paper Figure Test',
    'sec-03-8.subtitle': 'Can color-blind readers still understand your chart?',

    // === Lesson 04: Low-Dim ===
    'sec-04-1.title': '4.1 Data Transformation',
    'sec-04-1.subtitle': 'Your Crime data is wide; visualization needs long format',
    'sec-04-2.title': '4.2 Axis Transformation',
    'sec-04-2.subtitle': 'Data → coord → screen. Three-layer separation',
    'sec-04-3.title': '4.3 Curve Fitting',
    'sec-04-3.subtitle': 'Same 50 points, 10 different line.curve styles',
    'sec-04-4.title': '4.4 Slope Perception (45° Sweet Spot)',
    'sec-04-4.subtitle': 'Human slope estimation is NOT linear. 45° is the visual "middle".',
    'sec-04-5.title': '4.5 Marching Squares (Contour Lines)',
    'sec-04-5.subtitle': 'Given a scalar field + threshold, trace the value=threshold curve',

    // === Lesson 05: Time Series ===
    'sec-05-1.title': '5.1 Time Attributes',
    'sec-05-1.subtitle': '5 core properties: ordered / continuous / periodic / space-independent / structured',
    'sec-05-2.title': '5.2 Standard Time Viz (Line Chart)',
    'sec-05-2.subtitle': 'x = time, y = measure',
    'sec-05-3.title': '5.3 Calendar Heatmap (van Wijk)',
    'sec-05-3.subtitle': 'Year=row, week=column — full-year periodic patterns',
    'sec-05-4.title': '5.4 Cyclic Time Viz (Archimedean Spiral)',
    'sec-05-4.subtitle': 'Arrange time along a circle — reveal periodic structure',
    'sec-05-5.title': '5.5 Storyline (Jurassic Park)',
    'sec-05-5.subtitle': 'Multi-character narrative: each line = character / org / process',

    // === Portal home ===
    'portal.title': 'Introduction to Visualization',
    'footer.meta': 'Zero dependencies · D3.js v7 · Deployed on WorkBuddy Sites',
    'footer.copyright': '© 2026 Introduction to Visualization Course · China University of Petroleum (Huadong) · Instructor: <a href="https://cinger007.github.io" target="_blank" rel="noopener" class="teacher-link">Li Xin</a> · Main reference: Chen Wei’s 《Introduction to Visualization》',
    'portal.cards.color-bold': 'Color is the foundation of visualization',
    'portal.cards.source-prefix': 'Standalone topic:',
    'portal.cta.enter3': 'Open Topic →',
    'portal.cta.enter1': 'Open Chapter →',
    'portal.nav.about': 'ℹ️ About',
    'portal.nav.howto': '▶️ How to Use',
    'portal.nav.chapters': '📚 Chapters',
    'portal.hero.meta': 'China University of Petroleum (Huadong) · Instructor: <a href="https://cinger007.github.io" target="_blank" rel="noopener" class="teacher-link">Li Xin</a> · Main reference: Chen Wei’s 《Introduction to Visualization》',
    'portal.hero.subtitle': 'From Data to Charts: A Hands-on JavaScript + D3.js Course',
    'portal.hero.h1': 'Introduction to Visualization',
    'portal.hero.tag': 'VISUALIZATION · INTRODUCTION',
    'portal.tagline': 'Course Chapters',
    'portal.intro': 'Click any card to enter a chapter. Each chapter has 3 tabs: 📖 Explain / ⌨️ Key Code / ▶️ Demo.',
    'portal.section.usage': 'How to Use',
    'portal.section.about': 'About This Course',
    'portal.usage.classroom.title': 'Classroom Teaching',
    'portal.usage.classroom.desc': 'Open any chapter, pick a section on the left, switch between Explain / Code / Demo tabs at the top. Lecture while the demo runs live.',
    'portal.usage.student.title': 'Student Self-Study',
    'portal.usage.student.desc': 'Go through all ⭐ Key Points in chapter order. Each has "why this way" + "what pitfalls" notes.',
    'portal.usage.teacher.title': 'Teacher Preparation',
    'portal.usage.teacher.desc': 'Each chapter has its own demo/ subfolder. Run, modify, and package demos separately for students.',
    'portal.usage.lan.title': 'LAN Mode',
    'portal.usage.lan.desc': 'If public web fails, run python -m http.server 8080 on your machine. Students on the same WiFi can access.',
    'portal.about.theory': 'Theory Sources',
    'portal.about.theory.desc': "Chen Wei's 《Introduction to Visualization》, Mackinlay 1986, Stevens 1946, Cleveland 1984, Bostock D3 docs, Card 1999 data flow model.",
    'portal.about.principle': 'Design Principle',
    'portal.about.principle.desc': 'Case-centered (not theory-centered). Each concept is grounded in their hands-on cases, with ⭐ Key Code explanations + runnable demos.',
    'portal.about.stack': 'Tech Stack',
    'portal.about.stack.desc': 'Zero dependencies: plain HTML + CSS + ES modules + D3.js v7 (CDN). One command python -m http.server. No npm needed.',
    'portal.about.data': 'Datasets',
    'portal.about.data.desc': 'Student CSV + Crime CSV etc. all packaged in data/. Loaded via fetch, works offline.',

    // === Supplementary index ===
    'common.back': '← Back to Course Portal',
    'supp.title': 'Supplementary Demo Collection',
    'supp.tagline': 'Hands-on demos paired with the course chapters — each opens standalone',
    'supp.ch1': 'Chapter 1 · Data',
    'supp.ch2': 'Chapter 2 · Visualization Pipeline',
    'supp.ch3': 'Chapter 3 · Color Topics',
    'supp.ch4': 'Chapter 4 · Low-Dimensional Data',
    'supp.ch5': 'Chapter 5 · Time Series Data',
    'supp.hint1': 'Maps to doc-01: 1.1 Data Generation',
    'supp.hint2': 'Maps to doc-02: 4.4 Tree List',
    'supp.hint3': 'Maps to doc-03: 3.4 5 Color Schemes',
    'supp.hint4': 'Maps to doc-04: 4.1 Data Transformation / 4.3 Curve Fitting / 4.5 Contour Lines',
    'supp.hint5': 'Maps to doc-05: 5.3 Calendar Heatmap / 5.4 Archimedean Spiral',

    // === 5 cards ===
    'card-01.num': 'Chapter 1',
    'card-01.title': 'Data',
    'card-01.desc': "DeepSeek-generated student data → data generation, DIKW pyramid, Stevens' scales, Mackinlay's channels, D3 functional transforms, Data-Join.",
    'card-01.tags': 'DIKW · Stevens 4 scales · 8 D3 ops · Selection',
    'card-02.num': 'Chapter 2',
    'card-02.title': 'Visualization Workflow',
    'card-02.desc': "Card data flow model, student data → hierarchy → collapsible tree list. Reingold-Tilford layout, DOM event mechanics.",
    'card-02.tags': 'Card model · d3.rollup · Reingold-Tilford · delegation',
    'card-03.num': 'Chapter 3',
    'card-03.title': 'Color',
    'card-03.desc': 'Standalone topic: color is the foundation of visualization. Color models + colormap + Lab gamut + 5 harmonies + classic palettes + right/wrong cases + vivid+low-sat generator + CVD test. 8 sections, one-stop.',
    'card-03.tags': '4 spaces + CVD · Wong / Paul Tol · 5 harmonies · Vivid+Low-Sat · CVD test',
    'card-04.num': 'Chapter 4',
    'card-04.title': 'Low-Dim Visualization',
    'card-04.desc': 'Crime data axis transformation, 10 curve types, Cleveland 45° slope perception, Marching Squares contours. 5 sections.',
    'card-04.tags': '3-layer axis · 10 curves · Cleveland 45° · Marching Squares',
    'card-05.num': 'Chapter 5',
    'card-05.title': 'Time Series Visualization',
    'card-05.desc': '5 time attributes, French names time series, van Wijk calendar heatmap, Archimedean spiral, Storyline (Jurassic Park case).',
    'card-05.tags': 'Time props · Calendar colormap · Polar transform · Storygraph',
  },
};

// ---------- 状态 ----------
const STORAGE_KEY = 'wbl-locale';
const DEFAULT_LOCALE = 'zh-CN';
let currentLocale = DEFAULT_LOCALE;

// ---------- 工具 ----------
function readUrlLocale() {
  try {
    const sp = new URLSearchParams(location.search);
    const v = sp.get('lang');
    if (v === 'en' || v === 'zh') return v === 'en' ? 'en-US' : 'zh-CN';
  } catch (_) {}
  return null;
}

function readStoredLocale() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'en-US' || v === 'zh-CN') return v;
  } catch (_) {}
  return null;
}

function storeLocale(loc) {
  try { localStorage.setItem(STORAGE_KEY, loc); } catch (_) {}
}

// ---------- 核心：替换 DOM ----------
function t(key) {
  const loc = I18N[currentLocale] || I18N[DEFAULT_LOCALE];
  return loc[key] || I18N[DEFAULT_LOCALE][key] || key;
}

function applyLocale(loc) {
  if (!I18N[loc]) loc = DEFAULT_LOCALE;
  currentLocale = loc;
  storeLocale(loc);

  // 1. 替换 [data-i18n] textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    // ⚠️ demo-mount 由 lesson.js 在 init 之后渲染 demo 内容，绝不能被 i18n 把 innerHTML 清空回"加载中…"
    if (el.classList && el.classList.contains('demo-mount')) return;
    const v = t(key);
    if (v) el.textContent = v;
  });

  // 2. 替换 [data-i18n-attr="title|aria-label"] 属性
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const key = el.getAttribute('data-i18n-attr');
    if (!key) return;
    const v = t(key);
    if (v) el.setAttribute('aria-label', v);
  });

  // 3. 替换 [data-i18n-placeholder] placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const v = t(key);
    if (v) el.setAttribute('placeholder', v);
  });

  // 3.5 替换 [data-i18n-html] innerHTML（带链接的混合内容）
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (!key) return;
    if (el.classList && el.classList.contains('demo-mount')) return;
    const v = t(key);
    if (v) el.innerHTML = v;
  });

  // 4. 切换按钮高亮
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    const lang = btn.getAttribute('data-lang-btn');
    btn.classList.toggle('active', lang === loc);
  });

  // 4.5 切换 [data-lang] 双语正文节点（方案 B 双 DOM）
  // 中文节点 data-lang="zh-CN" 仅在中文模式显示；英文节点 data-lang="en-US" 仅在英文模式显示
  document.querySelectorAll('[data-lang]').forEach(el => {
    const lang = el.getAttribute('data-lang');
    el.hidden = (lang === 'en-US') !== (loc === 'en-US');
  });

  // 5. 切换 [data-i18n-href] 节点的 href（"完整讲义" markdown 自动切中英文）
  // 用 data-i18n-href="lecture" 标记，i18n.js 根据 locale 切换 ./lecture.md ↔ ./lecture-en.md
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    if (key === 'lecture') {
      const isEn = (loc === 'en-US');
      const baseHref = el.getAttribute('href');
      if (!baseHref) return;
      // 去掉 -en 后缀（如已存在），或加上
      const baseClean = baseHref.replace(/-en(\.[^./?#]+)?$|(\.[^./?#]+)$/i, (m, s1, s2) => s1 ? (s1) : (m.replace(s2, '')) + s2);
      // 简单实现：如果当前 href 以 lecture-en.md 结尾：去掉 -en；否则：如果 isEn，在 .md 前插入 -en
      let newHref;
      if (loc === 'en-US') {
        // 加 -en
        newHref = baseHref.replace(/lecture\.md$/, 'lecture-en.md');
        if (newHref === baseHref) {
          // 已经是 en 版本，跳过
          return;
        }
      } else {
        // 去 -en
        newHref = baseHref.replace(/lecture-en\.md$/, 'lecture.md');
        if (newHref === baseHref) {
          return;
        }
      }
      el.setAttribute('href', newHref);
    }
  });

  // 5. <html lang="...">
  document.documentElement.lang = loc === 'en-US' ? 'en' : 'zh-CN';

  // 6. 触发自定义事件（其他脚本可监听）
  document.dispatchEvent(new CustomEvent('wbl:localechange', { detail: { locale: loc } }));
}

// ---------- 切换按钮注入 ----------
function buildLangSwitcher() {
  const wrap = document.createElement('div');
  wrap.className = 'lang-switch';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', t('nav.lang.label'));
  wrap.innerHTML = `
    <button type="button" data-lang-btn="zh-CN" aria-label="中文">中</button>
    <button type="button" data-lang-btn="en-US" aria-label="English">EN</button>
  `;
  wrap.addEventListener('click', e => {
    const btn = e.target.closest('[data-lang-btn]');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang-btn');
    if (lang && lang !== currentLocale) {
      applyLocale(lang);
      // 同步 URL（不刷新页面）
      try {
        const sp = new URLSearchParams(location.search);
        if (lang === 'en-US') sp.set('lang', 'en');
        else sp.delete('lang');
        const qs = sp.toString();
        const newUrl = location.pathname + (qs ? '?' + qs : '') + location.hash;
        history.replaceState(null, '', newUrl);
      } catch (_) {}
    }
  });
  return wrap;
}

// ---------- 初始化 ----------
function init() {
  // 决定初始 locale：URL > localStorage > 默认
  const initial = readUrlLocale() || readStoredLocale() || DEFAULT_LOCALE;
  applyLocale(initial);

  // 把切换按钮塞到顶部 nav 最右
  const topbar = document.querySelector('.course-topbar');
  if (topbar) {
    const sw = buildLangSwitcher();
    topbar.appendChild(sw);
  } else {
    // portal 主页没有 .course-topbar → 塞到 body 顶部
    const sw = buildLangSwitcher();
    sw.classList.add('lang-switch-floating');
    document.body.insertBefore(sw, document.body.firstChild);
  }

  // 再次 apply，确保切换按钮自身文案也被翻译（如果还没翻译）
  applyLocale(currentLocale);
}

// ---------- 暴露 API ----------
window.__i18n = {
  setLocale: applyLocale,
  getLocale: () => currentLocale,
  t: t,
  apply: () => applyLocale(currentLocale),
};

// 等 DOM 就绪
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}