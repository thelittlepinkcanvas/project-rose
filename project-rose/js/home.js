document.addEventListener('DOMContentLoaded', () => {
  const figures = document.querySelectorAll('#heroCast .cast-figure');
  figures.forEach((fig, i) => {
    setTimeout(() => fig.classList.add('in'), 300 + i * 350);
  });

  const cta = document.getElementById('startReadingBtn');
  const progress = window.ProjectRose && window.ProjectRose.getProgress();
  if (cta && progress && progress.chapterId) {
    cta.textContent = 'Continue Reading';
    cta.href = `chapter.html?ch=${progress.chapterId}`;
  }
});
