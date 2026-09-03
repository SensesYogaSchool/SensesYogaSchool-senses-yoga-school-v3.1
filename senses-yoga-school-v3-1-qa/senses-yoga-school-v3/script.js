const m=document.querySelector('.menu'),n=document.querySelector('.nav');if(m&&n){m.onclick=()=>{n.classList.toggle('open');m.setAttribute('aria-expanded',n.classList.contains('open'))}}

// Shared visual layers: Senses Yellow establishes the site-wide atmosphere;
// mobile-media repairs small-screen structure and lets photography breathe.
['senses-yellow.css','mobile-media.css'].forEach(href=>{
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  document.head.appendChild(link);
});
