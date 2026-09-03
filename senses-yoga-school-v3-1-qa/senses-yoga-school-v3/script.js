const m=document.querySelector('.menu'),n=document.querySelector('.nav');if(m&&n){m.onclick=()=>{n.classList.toggle('open');m.setAttribute('aria-expanded',n.classList.contains('open'))}}

// Shared visual layers: yellow atmosphere, responsive structure, then breathing space.
['senses-yellow.css','mobile-media.css','breathe.css'].forEach(href=>{
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  document.head.appendChild(link);
});
