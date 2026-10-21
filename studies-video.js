(() => {
 const hero = document.querySelector('.studies-video-hero');
 if (!hero) return;
 const scene = hero.querySelector('.school-banner-scene');
 const layer = hero.querySelector('.studies-video-layer');
 const button = hero.querySelector('.studies-video-toggle');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let player, ready = false, visible = true, manualPause = false;
 function resize() {
   const iframe = layer.querySelector('iframe');
   if (!iframe) return;
   const width = Math.max(scene.clientWidth, scene.clientHeight * 16 / 9);
   iframe.style.width = `${Math.ceil(width)}px`;
   iframe.style.height = `${Math.ceil(width * 9 / 16)}px`;
   iframe.setAttribute('tabindex', '-1');
 }
 function update() {
   if (!ready) return;
   if (!visible || document.hidden || reduced.matches || navigator.connection?.saveData || manualPause) player.pauseVideo();
   else player.playVideo();
 }
 function init() {
   if (player || !window.YT?.Player) return;
   player = new YT.Player('studies-youtube-player', {
     host: 'https://www.youtube-nocookie.com', videoId: 'OonfeTeAUdY',
     playerVars: {autoplay:0, mute:1, controls:0, loop:1, playlist:'OonfeTeAUdY', playsinline:1, rel:0, disablekb:1, origin:location.origin},
     events: {
       onReady() {ready=true;player.mute();button.disabled=false;button.textContent='Play background';resize();update();},
       onStateChange(event) {
         const playing = event.data === YT.PlayerState.PLAYING;
         if (playing) layer.classList.add('is-ready');
         button.textContent = playing ? 'Pause background' : 'Play background';
         button.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
       },
       onError() {layer.classList.remove('is-ready');button.hidden=true;}
     }
   });
 }
 button.addEventListener('click', () => {
   if (!ready) return;
   if (player.getPlayerState() === YT.PlayerState.PLAYING) {manualPause=true;player.pauseVideo();}
   else {manualPause=false;player.mute();player.playVideo();}
 });
 if ('ResizeObserver' in window) new ResizeObserver(resize).observe(scene);
 else window.addEventListener('resize', resize);
 if ('IntersectionObserver' in window) new IntersectionObserver(entries => {visible=entries[0].isIntersecting;update();},{threshold:.1}).observe(scene);
 document.addEventListener('visibilitychange', update);
 reduced.addEventListener('change', update);
 if (window.YT?.Player) init();
 else {
   const prior = window.onYouTubeIframeAPIReady;
   window.onYouTubeIframeAPIReady = () => {if (typeof prior === 'function') prior();init();};
   const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';
   script.onerror=()=>{button.hidden=true;};document.head.appendChild(script);
 }
})();
