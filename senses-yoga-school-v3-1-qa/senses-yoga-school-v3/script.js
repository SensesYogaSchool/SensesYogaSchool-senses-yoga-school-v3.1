const m=document.querySelector('.menu'),n=document.querySelector('.nav'),a=document.querySelector('.actions'),bar=document.querySelector('.navbar');

if(m&&n&&bar){
  const setMenu=open=>{
    n.classList.toggle('open',open);
    bar.classList.toggle('menu-open',open);
    document.documentElement.classList.toggle('menu-open',open);
    document.body.classList.toggle('menu-open',open);
    m.setAttribute('aria-expanded',String(open));
    m.textContent=open?'Close':'Menu';
  };

  m.addEventListener('click',()=>setMenu(!n.classList.contains('open')));
  [...n.querySelectorAll('a'),...(a?[...a.querySelectorAll('a')]:[])].forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false)});
  window.addEventListener('resize',()=>{if(window.innerWidth>760)setMenu(false)});
}

// Shared visual layers: yellow atmosphere, responsive structure, breathing space, depth, solar threshold, and Vedic visual language.
['senses-yellow.css','mobile-media.css','breathe.css','depth.css','portal.css','archetypes.css'].forEach(href=>{
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  document.head.appendChild(link);
});

const gate=document.querySelector('.solar-gate');
const sun=document.querySelector('.sun-entry');
const cue=document.querySelector('.sun-cue');
const worldEnter=document.querySelector('.world-enter');
const living=document.querySelector('.portal-living');
if(gate&&sun&&worldEnter){
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(!reduceMotion){
    const count=window.innerWidth<760?14:24;
    for(let i=0;i<count;i++){
      const p=document.createElement('i');
      p.className='solar-particle';
      p.setAttribute('aria-hidden','true');
      p.style.setProperty('--x',`${5+Math.random()*90}%`);
      p.style.setProperty('--y',`${7+Math.random()*86}%`);
      p.style.setProperty('--dur',`${7+Math.random()*9}s`);
      p.style.setProperty('--delay',`${-Math.random()*9}s`);
      p.style.width=p.style.height=`${2+Math.random()*2.5}px`;
      gate.appendChild(p);
    }
  }

  const lock=()=>{document.documentElement.classList.add('portal-active');document.body.classList.add('portal-active')};
  const unlock=()=>{document.documentElement.classList.remove('portal-active');document.body.classList.remove('portal-active')};

  const showSun=(animate=false)=>{
    gate.classList.remove('is-entering');
    gate.setAttribute('data-stage','sun');
    gate.setAttribute('aria-hidden','false');
    living?.setAttribute('aria-hidden','true');
    lock();
    if(animate&&!reduceMotion){gate.classList.add('is-returning');setTimeout(()=>gate.classList.remove('is-returning'),1100)}
  };

  const revealLiving=()=>{gate.setAttribute('data-stage','living');living?.setAttribute('aria-hidden','false')};
  const enterSite=()=>{
    if(gate.classList.contains('is-entering')) return;
    if(reduceMotion){gate.setAttribute('aria-hidden','true');unlock();return}
    gate.classList.add('is-entering');
    setTimeout(()=>{gate.setAttribute('aria-hidden','true');unlock()},1050);
    setTimeout(()=>gate.classList.remove('is-entering'),1900);
  };

  showSun(false);
  sun.addEventListener('click',revealLiving);
  cue?.addEventListener('click',revealLiving);
  worldEnter.addEventListener('click',enterSite);

  document.querySelectorAll('a.brand').forEach(brand=>{
    brand.addEventListener('click',e=>{
      e.preventDefault();
      window.scrollTo({top:0,behavior:'auto'});
      showSun(true);
    });
  });
}
