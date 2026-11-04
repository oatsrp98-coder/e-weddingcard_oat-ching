(() => {
  'use strict';
  const viewer = document.getElementById('photoViewer');
  const image = document.getElementById('fullPhoto');
  const stage = document.getElementById('photoStage');
  const photos = Array.from(document.querySelectorAll('.gallery-photo'));
  const close = document.getElementById('closePhotoViewer');
  let index = 0;
  let returnFocus;
  let touchStart = null;

  function showPhoto(nextIndex) {
    index = (nextIndex + photos.length) % photos.length;
    const thumbnail = photos[index].querySelector('img');
    image.src = photos[index].href;
    image.alt = thumbnail.alt;
    image.width = thumbnail.width;
    image.height = thumbnail.height;
    document.getElementById('photoOriginal').href = photos[index].href;
    document.getElementById('photoCount').textContent = `${index + 1} / ${photos.length}`;
  }

  photos.forEach((photo, photoIndex) => {
    photo.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnFocus = photo;
      showPhoto(photoIndex);
      viewer.showModal();
      close.focus();
    });
  });
  document.getElementById('previousPhoto').addEventListener('click', () => showPhoto(index - 1));
  document.getElementById('nextPhoto').addEventListener('click', () => showPhoto(index + 1));
  close.addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    touchStart = null;
    returnFocus?.focus({ preventScroll: true });
  });
  viewer.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      showPhoto(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  stage.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : null;
  }, { passive: true });
  stage.addEventListener('touchmove', event => {
    if (event.touches.length > 1) touchStart = null;
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  stage.addEventListener('touchend', event => {
    const start = touchStart;
    touchStart = null;
    if (!start || event.touches.length || event.changedTouches.length !== 1) return;
    if (window.visualViewport && window.visualViewport.scale > 1.05) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      showPhoto(index + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
})();
