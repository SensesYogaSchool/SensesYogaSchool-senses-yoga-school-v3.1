const m=document.querySelector('.menu'),n=document.querySelector('.nav');if(m){m.onclick=()=>{n.classList.toggle('open');m.setAttribute('aria-expanded',n.classList.contains('open'))}}

// Mobile-first photography layer. Keeping this separate from the core stylesheet
// makes the image-led refinement easy to tune without disturbing desktop layout.
const mobileMedia=document.createElement('link');
mobileMedia.rel='stylesheet';
mobileMedia.href='mobile-media.css';
document.head.appendChild(mobileMedia);
