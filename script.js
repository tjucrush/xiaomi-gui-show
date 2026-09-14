const primaryData = [
  {name:'Xiaomi-GUI-Show', val:72.0, ours:true},
  {name:'Gemini 3.1 Pro', val:85.0},
  {name:'Seed 2.0 Pro', val:80.0},
  {name:'Seed 1.8', val:65.0},
  {name:'Claude Opus 4.7', val:60.0},
  {name:'Gemini 3.1 Flash', val:58.0},
  {name:'MAI-UI-8B', val:33.0},
  {name:'GUI-Owl-1.5-32B-Thinking', val:31.0},
  {name:'UI-Venus-1.5-30B-A3B', val:21.0},
  {name:'Step-GUI-8B', val:15.0},
];

const secondaryData = [
  {name:'Xiaomi-GUI-Show', val:78.9, ours:true},
  {name:'UI-Venus-1.5-30B-A3B', val:77.6},
  {name:'UI-Venus-1.5-8B', val:73.7},
  {name:'UI-TARS-2', val:73.3},
  {name:'GUI-Owl-1.5-8B-Thinking', val:71.6},
  {name:'Seed 1.8', val:70.7},
  {name:'MAI-UI-8B', val:70.7},
  {name:'GUI-Owl-1.5-32B-Instruct', val:69.8},
  {name:'Step-GUI-8B', val:67.7},
  {name:'UI-TARS-1.5', val:64.2},
];

function renderBars(containerId, data){
  const el = document.getElementById(containerId);
  if(!el) return;
  const max = Math.max(...data.map(d=>d.val));
  data.slice().sort((a,b)=>b.val-a.val).forEach(d=>{
    const row = document.createElement('div');
    row.className = 'bar-row' + (d.ours ? ' ours' : '');
    row.innerHTML = `
      <div class="bar-label" title="${d.name}">${d.name}</div>
      <div class="bar-track"><div class="bar-fill${d.ours?' is-ours':''}" data-w="${(d.val/max*100).toFixed(1)}"></div></div>
      <div class="bar-val">${d.val.toFixed(1)}</div>`;
    el.appendChild(row);
  });
}
renderBars('bars-primary', primaryData);
renderBars('bars-secondary', secondaryData);

const barObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.bar-fill').forEach(f=>{
        f.style.width = f.dataset.w + '%';
      });
      barObserver.unobserve(e.target);
    }
  });
},{threshold:0.2});
document.querySelectorAll('.bars').forEach(b=>barObserver.observe(b));

const revealEls = document.querySelectorAll('.card, .pillar, .figure, .domain-card, .method-block, .cite-box, .train-flow');
revealEls.forEach(el=>el.classList.add('reveal'));
const revObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); revObserver.unobserve(e.target); }
  });
},{threshold:0.12});
revealEls.forEach(el=>revObserver.observe(el));

document.querySelectorAll('#navlinks a').forEach(a=>{
  a.addEventListener('click', ()=>document.getElementById('navlinks').classList.remove('open'));
});

  const heroParticles = document.getElementById('heroParticles');
  if(heroParticles){
    for(let i=0;i<16;i++){
      const particle = document.createElement('span');
      particle.className = 'hero-particle';
      particle.style.left = `${8 + ((i * 37) % 84)}%`;
      particle.style.top = `${8 + ((i * 23) % 34)}%`;
      particle.style.animationDelay = `${(i % 8) * -0.8}s`;
      particle.style.animationDuration = `${6 + (i % 4)}s`;
      heroParticles.appendChild(particle);
    }
    for(let i=0;i<12;i++){
      const particle = document.createElement('span');
      particle.className = 'hero-particle hero-particle--strong';
      particle.style.left = `${4 + ((i * 53) % 92)}%`;
      particle.style.top = `${4 + ((i * 31) % 30)}%`;
      particle.style.animationDelay = `${(i % 6) * -0.7}s`;
      particle.style.animationDuration = `${5.5 + (i % 3)}s`;
      heroParticles.appendChild(particle);
    }
  }

  const navSectionLinks = Array.from(document.querySelectorAll('#navlinks a[href^="#"]'));
  const navSections = navSectionLinks
    .map(link=>document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);
  if(navSections.length){
    const navObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        navSectionLinks.forEach(link=>{
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if(active) link.setAttribute('aria-current','page');
          else link.removeAttribute('aria-current');
        });
      });
    },{rootMargin:'-24% 0px -64% 0px',threshold:0});
    navSections.forEach(section=>navObserver.observe(section));
  }

const cursorOrbit = document.getElementById('cursorOrbit');
if(cursorOrbit && window.matchMedia('(pointer:fine)').matches){
  document.body.classList.add('has-custom-cursor');
  window.addEventListener('pointermove', (event)=>{
    cursorOrbit.style.left = `${event.clientX}px`;
    cursorOrbit.style.top = `${event.clientY}px`;
    cursorOrbit.classList.add('is-visible');
  }, {passive:true});
  document.querySelectorAll('a, button, video, .case-img, .demo-slide').forEach((element)=>{
    element.addEventListener('mouseenter', ()=>cursorOrbit.classList.add('is-hovering'));
    element.addEventListener('mouseleave', ()=>cursorOrbit.classList.remove('is-hovering'));
  });
  document.addEventListener('mouseleave', ()=>cursorOrbit.classList.remove('is-visible'));
}

(function(){
  const box = document.getElementById('lightbox');
  if(!box) return;
  const img = document.getElementById('lightboxImg');
  const close = document.getElementById('lightboxClose');

  function open(src){
    img.src = src;
    box.classList.add('open');
    box.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function hide(){
    box.classList.remove('open');
    box.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    img.src = '';
  }

  document.querySelectorAll('.case-img[data-zoom]').forEach(btn=>{
    btn.addEventListener('click', ()=>open(btn.dataset.zoom));
  });
  close.addEventListener('click', hide);
  box.addEventListener('click', (e)=>{ if(e.target===box) hide(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && box.classList.contains('open')) hide(); });
})();

// Additive localization: retain every original English fragment for exact restoration.
(() => {
  const translations = [];
  function register(selector, chinese) {
    document.querySelectorAll(selector).forEach((element, index) => {
      const zh = Array.isArray(chinese) ? chinese[index] : chinese;
      if (zh !== undefined) translations.push({element, en: element.innerHTML, zh});
    });
  }
  register('#navlinks a', ['概览', '演示', '案例', '方法', '评测', '结果']);
  register('.hero-sub', '一个<strong>交互式界面自动化展示平台</strong>，汇集本地演示、评测结果与工作流程研究。');
  register('.btn-row a', ['观看演示', '探索结果']);
  register('#overview .section-title', '项目概览');
  register('#overview .lead', '可靠的界面自动化需要应对状态变化、操作中断与多步骤工作流。Xiaomi-GUI-Show 汇集本地交互演示、评测结果与异常恢复模式，呈现交互式自动化的完整过程。');
  register('.pillar h3', ['执行基础设施', '错误驱动改进', '渐进式训练', '任务评测']);
  register('.pillar p', [
    '结构化环境支持交互工作流中的可重复采集、执行、评测与复盘。',
    '将失败路径转化为纠正动作、反思记录与恢复示范，提升异常状态识别和自我纠正能力。',
    '从基础操作到局部纠错，逐步提升长程规划与异常恢复能力。',
    '精选任务集采用细粒度子目标评估，覆盖跨越多个界面的工作流程。'
  ]);
  register('#demos .section-title', '交互演示');
  register('.demo-badge', ['任务 1 · 跨应用信息传递', '任务 2 · 跨应用图像搜索', '任务 3 · 多应用协同规划']);
  register('.demo-app', ['应用 A → 应用 B → 应用 C → 应用 D', '应用 A → 应用 B', '应用 A → 应用 B']);
  // The existing bilingual demo quotations remain intact in both languages.
  document.querySelectorAll('.demo-query').forEach(el => el.lang = 'zh-CN');
  document.querySelectorAll('.demo-query-en').forEach(el => el.lang = 'en');
  register('#cases .section-title', '案例研究');
  register('#cases .section-intro', '两组真实设备执行轨迹：端到端任务执行与执行途中的异常恢复。');
  register('.case-badge', ['案例 1 · 端到端执行', '案例 2 · 反思与恢复']);
  register('.case-card figcaption p', [
    '智能体观察屏幕，将任务拆解为子目标，并连续执行 GUI 操作，直至达成目标。',
    '当观察到的状态偏离预期结果时，智能体会记录差异、调整计划并选择纠正动作，而非继续沿原有轨迹执行。'
  ]);
  register('#results .section-title', '评测结果');
  register('#results .section-intro', 'Xiaomi-GUI-Show 集中呈现评测集上的任务完成率、执行进度与基线模型对比。');
  register('.card-title', ['基准评测：成功率（%）', '第二评测集：成功率（%）', '导航任务结果']);
  register('.card-note', '成功率表示完全完成的任务占比；完成进度表示每项任务中已完成子目标比例的平均值。');
  register('.data-table th', ['模型', '主评测集<br>成功率', '主评测集<br>完成进度', '第二评测集']);
  register('.data-table .group td', ['闭源模型', '开源模型', '展示系统']);
  register('#benchmark .section-title', '评测基准');
  register('#benchmark .section-intro', '评测集旨在支持对界面操作进行可复现的评估。每项任务通过细粒度子目标计分，部分完成也可获得相应分数；其中许多任务涉及多个界面。');
  register('#benchmark figcaption', ['任务集中各界面的出现频率。', '每项任务涉及的应用数量。']);
  register('.domain-count', ['10 项任务', '16 项任务', '33 项任务', '41 项任务']);
  register('.domain-card h3', ['基础操作', '安全与反思', '记忆与知识', '推理与规划']);
  register('.domain-card p', [
    '基础 GUI 操作：点击、滚动、输入与跨界面导航。',
    '拒绝不安全或不可逆的操作，识别不可行目标并停止或跳过。',
    '在多个步骤间保留信息，并运用外部知识完成任务。',
    '长程规划、多源信息整合与自适应决策。'
  ]);
  register('#method .section-title', '方法架构');
  register('.method-h', ['以真实设备为主的混合基础设施', '多来源训练数据', '错误驱动的数据飞轮', '渐进式三阶段训练']);
  register('.method-block > p', [
    '以物理设备作为主要执行环境，沙盒作为辅助支持，整体分为资源层、调度层以及执行与采集层。<b>设备拉取（Device-Pull）</b>调度机制允许空闲设备根据自身当前状态请求匹配任务，避免将任务分配给已不具备执行条件的设备。',
    '三类递进数据覆盖真实移动场景所需的监督信号：<b>高频任务数据</b>面向常用功能与异常状态；<b>高泛化数据</b>借助功能树与行为桶覆盖长尾意图；<b>智能体能力增强数据</b>采用包含观察、反思、计划、决策和记忆五个字段的结构化思维链。',
    '数据飞轮围绕真实执行中暴露的错误分布组织，而非单纯扩大数据量。<b>交互式标注</b>定位首个关键错误，记录纠正动作与原因；<b>教师模型评分与接管</b>大规模识别偏离行为，并示范如何恢复至可行路径。',
    '训练流程从密集反馈逐步过渡到稀疏反馈。<b>SFT</b> 建立输出协议与基础交互能力；<b>Step RL</b> 使用逐步反馈及层级触发的级联奖励纠正局部错误；<b>Agentic RL</b> 在模拟或真实环境中优化完整执行轨迹，提升长程规划与恢复能力。'
  ]);
  register('#method figcaption', [
    '数百部实体手机与数十台平板构成主要执行基础，并辅以数百个沙盒实例。',
    '高泛化数据构建：功能树、行为桶查询合成、轨迹执行与两级清洗。',
    '覆盖单应用与跨应用任务的查询合成，结合质量过滤与功能点反向标注。',
    '学生模型执行任务，教师模型逐步评分；持续低于阈值的评分会触发有限步数的接管，形成“偏离—诊断—恢复”片段。'
  ]);
  register('.ts-desc', ['监督微调', '步骤级强化学习', '轨迹级强化学习']);
  register('.footer-brand span', '交互式展示平台');
  register('.footer-note', '以清晰的决策序列，呈现界面自动化的每一步。');
  register('.footer-fine', '本地展示 · 交互演示 · 案例研究 · 评测基准 · 评测结果');
  const legal = document.querySelector('.footer-legal');
  translations.push({element: legal, zh: legal.innerHTML, en: 'The content of this website is for personal learning and exchange only and may not be used for commercial gain. If any content infringes your rights, please contact us to request its removal.'});
  const labels = [
    ['.nav-toggle', '切换导航菜单', 'Toggle menu'],
    ['.case-img[data-zoom]', '放大案例', 'Enlarge case'],
    ['.lightbox-close', '关闭', 'Close']
  ];
  const switcher = document.querySelector('.language-switch');
  const buttons = switcher.querySelectorAll('button');
  const originalTitle = document.title;
  const description = document.querySelector('meta[name="description"]');
  const originalDescription = description.content;
  function setLanguage(language) {
    const zh = language === 'zh';
    document.documentElement.lang = zh ? 'zh-CN' : 'en';
    translations.forEach(item => { item.element.innerHTML = item[zh ? 'zh' : 'en']; });
    labels.forEach(([selector, chinese, english]) => {
      document.querySelectorAll(selector).forEach((el, index) => {
        el.setAttribute('aria-label', (zh ? chinese : english) + (selector.includes('case-img') ? ` ${index + 1}` : ''));
      });
    });
    document.title = zh ? 'Xiaomi-GUI-Show：交互式展示平台' : originalTitle;
    description.content = zh ? 'Xiaomi-GUI-Show 是一个展示界面自动化演示、评测结果与工作流程研究的交互式平台。' : originalDescription;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    try { localStorage.setItem('xiaomi-show-language', language); } catch (_) { /* Storage is optional. */ }
  }
  buttons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  let language = 'zh';
  try {
    const saved = localStorage.getItem('xiaomi-show-language');
    if (saved === 'en' || saved === 'zh') language = saved;
  } catch (_) { /* Direct-file and private browsing still support switching. */ }
  setLanguage(language);
  switcher.hidden = false;
})();
