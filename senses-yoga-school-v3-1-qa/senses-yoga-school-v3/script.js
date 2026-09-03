const m=document.querySelector('.menu'),n=document.querySelector('.nav');if(m&&n){m.onclick=()=>{n.classList.toggle('open');m.setAttribute('aria-expanded',n.classList.contains('open'))}}

// Shared visual layers: yellow atmosphere, responsive structure, breathing space, depth, and solar portal.
['senses-yellow.css','mobile-media.css','breathe.css','depth.css','portal.css'].forEach(href=>{
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  document.head.appendChild(link);
});

const gate=document.querySelector('.solar-gate');
const enter=document.querySelector('.sun-entry');
if(gate&&enter){
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A sparse field of drifting light around the sun. Kept deliberately small for mobile performance.
  if(!reduceMotion){
    const count=window.innerWidth<760?12:20;
    for(let i=0;i<count;i++){
      const p=document.createElement('i');
      p.className='solar-particle';
      p.setAttribute('aria-hidden','true');
      p.style.setProperty('--x',`${8+Math.random()*84}%`);
      p.style.setProperty('--y',`${8+Math.random()*84}%`);
      p.style.setProperty('--dur',`${7+Math.random()*8}s`);
      p.style.setProperty('--delay',`${-Math.random()*8}s`);
      p.style.width=p.style.height=`${2+Math.random()*3}px`;
      gate.appendChild(p);
    }
  }

  const lock=()=>{
    document.documentElement.classList.add('portal-active');
    document.body.classList.add('portal-active');
  };
  const unlock=()=>{
    document.documentElement.classList.remove('portal-active');
    document.body.classList.remove('portal-active');
  };

  const showPortal=(animate=false)=>{
    gate.classList.remove('is-entering');
    gate.setAttribute('aria-hidden','false');
    lock();
    if(animate&&!reduceMotion){
      gate.classList.add('is-returning');
      window.setTimeout(()=>gate.classList.remove('is-returning'),1250);
    }
    window.setTimeout(()=>gate.querySelector('.sun-entry')?.focus({preventScroll:true}),animate?900:80);
  };

  const openWorld=()=>{
    if(gate.classList.contains('is-entering')) return;
    if(reduceMotion){
      gate.setAttribute('aria-hidden','true');
      unlock();
      return;
    }
    gate.classList.remove('is-returning');
    gate.classList.add('is-entering');
    // Let the solar disk expand until it becomes the yellow world beneath it.
    window.setTimeout(()=>{
      gate.setAttribute('aria-hidden','true');
      unlock();
    },1180);
    window.setTimeout(()=>gate.classList.remove('is-entering'),2450);
  };

  showPortal(false);
  enter.addEventListener('click',openWorld);
  enter.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openWorld()}});

  // The Senses mark is the route back to the source: the world recedes and the sun reforms.
  document.querySelectorAll('a.brand').forEach(brand=>{
    brand.addEventListener('click',e=>{
      e.preventDefault();
      window.scrollTo({top:0,behavior:'auto'});
      showPortal(true);
    });
  });
}
