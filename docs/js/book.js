document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = Number(params.get('id') || '1');

  const bookEyebrow = document.getElementById('bookEyebrow');
  const bookTitle = document.getElementById('bookTitle');
  const bookSynopsis = document.getElementById('bookSynopsis');
  const chapterList = document.getElementById('chapterList');
  const countdownBox = document.getElementById('countdownBox');
  const countdownText = document.getElementById('countdownText');

  let data;
  try {
    const res = await fetch('data/chapters.json');
    data = await res.json();
  } catch (e) {
    bookTitle.textContent = 'Could not load chapters.';
    return;
  }

  const book = data.books.find(b => b.id === bookId);
  if (!book) {
    bookTitle.textContent = 'Book not found.';
    return;
  }

  bookEyebrow.textContent = 'Project Rose';
  bookTitle.textContent = book.title;
  bookSynopsis.textContent = book.synopsis;
  document.title = `${book.title} — Project Rose`;

  if (book.chapters.length === 0) {
    const li = document.createElement('li');
    li.style.color = 'var(--mist)';
    li.style.textAlign = 'center';
    li.style.fontSize = '.9rem';
    li.textContent = 'No chapters have been released for this book yet.';
    chapterList.appendChild(li);
  } else {
    book.chapters.forEach(chId => {
      const chapter = data.chapters[String(chId)];
      if (!chapter) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `chapter.html?ch=${chId}`;
      a.className = 'btn btn-block';
      a.style.justifyContent = 'space-between';
      a.innerHTML = `<span>${chapter.title}</span><span aria-hidden="true">&rarr;</span>`;
      li.appendChild(a);
      chapterList.appendChild(li);
    });
  }

  // ---------- countdown to next chapter (editable via js/release-config.js) ----------
  const config = window.ProjectRoseReleaseConfig || {};
  const nextChapterNumber = book.chapters.length > 0
    ? Math.max(...book.chapters) + 1
    : 1;
  const targetDateStr = config[nextChapterNumber];

  if (targetDateStr) {
    const target = new Date(targetDateStr + 'T00:00:00');

    function renderCountdown() {
      const now = new Date();
      const diffMs = target - now;

      if (diffMs <= 0) {
        countdownText.textContent = "It's here!";
        return false; // stop updating
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const timeLeft = days > 0
        ? `${days} day${days === 1 ? '' : 's'} left`
        : `${hours} hour${hours === 1 ? '' : 's'} left`;

      countdownText.textContent = `Chapter ${nextChapterNumber} — ${timeLeft}`;
      return true;
    }

    countdownBox.style.display = 'flex';
    const keepGoing = renderCountdown();
    if (keepGoing) {
      setInterval(renderCountdown, 60 * 1000); // refresh every minute
    }
  }
});
