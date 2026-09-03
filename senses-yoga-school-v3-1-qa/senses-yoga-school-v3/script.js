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
  const showPortal=()=>{
    if(!document.body.contains(gate)) return;
    gate.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('portal-active');
    document.body.classList.add('portal-active');
    gate.querySelector('.sun-entry')?.focus({preventScroll:true});
  };
  const openWorld=()=>{
    gate.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('portal-active');
    document.body.classList.remove('portal-active');
  };
  showPortal();
  enter.addEventListener('click',openWorld);
  enter.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openWorld()}});
  document.querySelectorAll('a.brand').forEach(brand=>{
    brand.addEventListener('click',e=>{
      e.preventDefault();
      window.scrollTo({top:0,behavior:'auto'});
      showPortal();
    });
  });
}
