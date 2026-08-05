document.addEventListener('DOMContentLoaded', async () => {
  const PR = window.ProjectRose || {};
  const params = new URLSearchParams(window.location.search);
  const chapterId = params.get('ch') || '1';

  const eyebrowEl = document.getElementById('chapterEyebrow');
  const titleEl = document.getElementById('chapterTitle');
  const bodyEl = document.getElementById('chapterBody');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let data;
  try {
    const res = await fetch('data/chapters.json');
    data = await res.json();
  } catch (e) {
    titleEl.textContent = 'Could not load this chapter.';
    return;
  }

  const chapter = data.chapters[chapterId];
  if (!chapter) {
    titleEl.textContent = 'Chapter not found.';
    return;
  }

  const book = data.books.find(b => b.id === chapter.bookId);
  eyebrowEl.textContent = book ? book.title : 'Project Rose';
  titleEl.textContent = chapter.title;
  document.title = `${chapter.title} — Project Rose`;

  const imagesByIndex = {};
  (chapter.images || []).forEach(img => {
    imagesByIndex[img.afterParagraph] = imagesByIndex[img.afterParagraph] || [];
    imagesByIndex[img.afterParagraph].push(img);
  });

  const frag = document.createDocumentFragment();
  chapter.content.forEach((paragraph, idx) => {
    const p = document.createElement('p');
    p.innerHTML = paragraph;
    frag.appendChild(p);

    if (imagesByIndex[idx]) {
      imagesByIndex[idx].forEach(img => {
        const figure = document.createElement('figure');
        figure.className = 'chapter-image';
        if (img.src) {
          const image = document.createElement('img');
          image.src = img.src;
          image.alt = img.caption || '';
          figure.appendChild(image);
        } else {
          const ph = document.createElement('div');
          ph.className = 'book-cover';
          ph.style.maxWidth = '100%';
          ph.style.aspectRatio = '16/10';
          ph.innerHTML = `<span>Chapter image placeholder<br>${img.caption || ''}</span>`;
          figure.appendChild(ph);
        }
        if (img.caption) {
          const cap = document.createElement('figcaption');
          cap.textContent = img.caption;
          figure.appendChild(cap);
        }
        frag.appendChild(figure);
      });
    }
  });
  bodyEl.appendChild(frag);

  const recapModal = document.getElementById('recapModal');
  const recapCloseBtn = document.getElementById('recapCloseBtn');
  if (Number(chapterId) >= 4) {
    recapModal.classList.add('open');
  }
  recapCloseBtn.addEventListener('click', () => recapModal.classList.remove('open'));
  recapModal.addEventListener('click', (e) => { if (e.target === recapModal) recapModal.classList.remove('open'); });

  const allIds = Object.keys(data.chapters).map(Number).sort((a, b) => a - b);
  const currentIndex = allIds.indexOf(Number(chapterId));
  const prevId = currentIndex > 0 ? allIds[currentIndex - 1] : null;
  const nextId = currentIndex >= 0 && currentIndex < allIds.length - 1 ? allIds[currentIndex + 1] : null;

  if (prevId) {
    prevBtn.addEventListener('click', () => { window.location.href = `chapter.html?ch=${prevId}`; });
  } else {
    prevBtn.disabled = true;
  }

  const saveModal = document.getElementById('saveModal');
  const saveYesBtn = document.getElementById('saveYesBtn');
  const saveNoBtn = document.getElementById('saveNoBtn');

  function goToNext() {
    if (nextId) window.location.href = `chapter.html?ch=${nextId}`;
  }

  if (nextId) {
    nextBtn.addEventListener('click', () => {
      // Already saving? Don't interrupt — just save quietly and move on.
      if (PR.isSaveEnabled && PR.isSaveEnabled()) {
        if (PR.saveProgress) PR.saveProgress(chapter.bookId, Number(chapterId), chapter.title);
        goToNext();
        return;
      }
      // Not saving yet — ask each time, since there's nothing being saved.
      saveModal.classList.add('open');
    });
  } else {
    nextBtn.textContent = "That's all for now";
    nextBtn.disabled = true;
  }

  saveYesBtn.addEventListener('click', () => {
    if (PR.setSettings) PR.setSettings({ saveEnabled: true });
    if (PR.saveProgress) PR.saveProgress(chapter.bookId, Number(chapterId), chapter.title);
    saveModal.classList.remove('open');
    if (PR.showToast) PR.showToast('Progress saved!');
    setTimeout(goToNext, 600);
  });

  saveNoBtn.addEventListener('click', () => {
    saveModal.classList.remove('open');
    goToNext();
  });
});