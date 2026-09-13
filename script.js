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
