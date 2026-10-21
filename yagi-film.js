(() => {
 const section = document.querySelector('.yagi-film');
 if (!section) return;
 const video = section.querySelector('video');
 const button = section.querySelector('.yagi-film-toggle');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const connection = navigator.connection;
 let visible = false;
 let manualPause = false;
 function sync() {
   button.textContent = video.paused ? 'Play background' : 'Pause background';
   button.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
 }
 function play() {
   if (!video.src) video.src = video.dataset.src;
   video.muted = true;
   video.play().catch(sync);
 }
 button.addEventListener('click', () => {
   if (video.paused) { manualPause = false; play(); }
   else { manualPause = true; video.pause(); }
 });
 video.addEventListener('play', sync);
 video.addEventListener('pause', sync);
 video.addEventListener('error', () => { video.pause(); button.hidden = true; });
 function update() {
   if (!visible || document.hidden || reduced.matches || connection?.saveData || manualPause) video.pause();
   else play();
 }
 if ('IntersectionObserver' in window) {
   new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, {threshold: .15}).observe(section);
 }
 document.addEventListener('visibilitychange', update);
 reduced.addEventListener('change', update);
 sync();
})();
