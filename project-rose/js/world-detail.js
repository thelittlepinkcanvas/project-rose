document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.spoiler-block .spoiler-note button').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.spoiler-block');
      block.classList.remove('flagged');
      block.classList.add('revealed');
    });
  });
});
