document.addEventListener('DOMContentLoaded', () => {

  function closeItem(item) {
    item.classList.remove('open');
    const trigger = item.querySelector(':scope > .accordion-trigger');
    const panel = item.querySelector(':scope > .accordion-panel');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (panel) panel.style.maxHeight = null;
  }

  function openItem(item) {
    item.classList.add('open');
    const trigger = item.querySelector(':scope > .accordion-trigger');
    const panel = item.querySelector(':scope > .accordion-panel');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
  }

  // Walk up through any open ancestor accordions and resize them to fit
  // their new (bigger or smaller) content — this is what makes a book's
  // height grow when you open a chapter inside it.
  function refreshAncestors(item) {
    let panel = item.parentElement ? item.parentElement.closest('.accordion-panel') : null;
    while (panel) {
      const ancestorItem = panel.closest('.accordion-item');
      if (ancestorItem && ancestorItem.classList.contains('open')) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
      panel = ancestorItem && ancestorItem.parentElement
        ? ancestorItem.parentElement.closest('.accordion-panel')
        : null;
    }
  }

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const siblingsContainer = item.parentElement; // only true siblings at this level
      const isOpen = item.classList.contains('open');

      // Close other accordions at the SAME level only (so opening a
      // chapter doesn't collapse a different book, and vice versa).
      siblingsContainer.querySelectorAll(':scope > .accordion-item').forEach(sibling => {
        if (sibling !== item) closeItem(sibling);
      });

      isOpen ? closeItem(item) : openItem(item);

      refreshAncestors(item);
    });
  });

  document.querySelectorAll('.accordion-panel').forEach(panel => {
    panel.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'max-height') return;
      const item = panel.closest('.accordion-item');
      if (item) refreshAncestors(item);
    });
  });

  // lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.scene-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const img = thumb.querySelector('img');
      const caption = thumb.dataset.caption || '';
      if (img) {
        lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
      } else {
        lightboxContent.innerHTML = `<div class="book-cover" style="max-width:320px; aspect-ratio:4/3;"><span>Full-size scene image<br>${caption}</span></div>`;
      }
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() { lightbox.classList.remove('open'); }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
});