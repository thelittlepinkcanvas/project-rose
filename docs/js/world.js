document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.world-card.spoiler').forEach(card => {
    const revealBtn = card.querySelector('.spoiler-flag button');
    if (!revealBtn) return;
    revealBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      card.classList.add('revealed');
    });
  });
});
