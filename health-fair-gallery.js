(() => {
  const gallery = document.querySelector('.health-fair-gallery');
  const dialog = document.querySelector('.photo-viewer');
  if (!gallery || !dialog || typeof dialog.showModal !== 'function') return;
  const links = [...gallery.querySelectorAll('a')];
  const image = dialog.querySelector('.photo-viewer-image');
  let current = 0;
  let origin;
  function show(index) {
    current = (index + links.length) % links.length;
    const source = links[current].querySelector('img');
    image.src = links[current].href;
    image.alt = source.alt;
    dialog.querySelector('.photo-viewer-caption').textContent = links[current].closest('figure').querySelector('figcaption').textContent;
    dialog.querySelector('.photo-counter').textContent = `${current + 1} / ${links.length}`;
  }
  links.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault(); origin = link; show(index); dialog.showModal();
    document.body.classList.add('photo-viewer-open');
  }));
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.photo-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.photo-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('photo-viewer-open'); origin?.focus();
  });
})();
