document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('mapViewport');
  const inner = document.getElementById('mapInner');

  let currentX = 0;  
  let minX = 0;      
  let isDragging = false;
  let dragStartX = 0;
  let startTranslateX = 0;
  let dragDistance = 0;

  function clamp(x) {
    return Math.min(0, Math.max(minX, x));
  }

  function setTranslate(x, animate) {
    currentX = clamp(x);
    inner.style.transition = animate ? '' : 'none';
    inner.style.transform = `translateX(${currentX}px)`;
  }

  function computeBounds() {
    minX = Math.min(0, viewport.clientWidth - inner.scrollWidth);
    setTranslate(currentX, false);
  }

  const img = inner.querySelector('img');
  if (img.complete) {
    computeBounds();
  } else {
    img.addEventListener('load', computeBounds);
  }
  window.addEventListener('resize', computeBounds);

  document.getElementById('mapRight').addEventListener('click', () => {
    setTranslate(currentX - viewport.clientWidth * 0.5, true);
  });
  document.getElementById('mapLeft').addEventListener('click', () => {
    setTranslate(currentX + viewport.clientWidth * 0.5, true);
  });

  function dragStart(clientX) {
    isDragging = true;
    dragDistance = 0;
    dragStartX = clientX;
    startTranslateX = currentX;
    viewport.classList.add('dragging');
  }
  function dragMove(clientX) {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    dragDistance = Math.abs(delta);
    setTranslate(startTranslateX + delta, false);
  }
  function dragEnd() {
    isDragging = false;
    viewport.classList.remove('dragging');
  }

  viewport.addEventListener('mousedown', (e) => { dragStart(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', (e) => dragMove(e.clientX));
  window.addEventListener('mouseup', dragEnd);

  viewport.addEventListener('touchstart', (e) => dragStart(e.touches[0].clientX), { passive: true });
  viewport.addEventListener('touchmove', (e) => dragMove(e.touches[0].clientX), { passive: true });
  viewport.addEventListener('touchend', dragEnd);

  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
      if (dragDistance > 6) {
        e.preventDefault();
      }
    });
  });
});