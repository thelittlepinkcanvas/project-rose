document.addEventListener('DOMContentLoaded', () => {
  const PROFILES = [
    { id: 'alice',      image: 'images/alice info hz.png' },
    { id: 'benedict',      image: 'images/benedict info hz.png' },
  ];

  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');

  PROFILES.forEach(() => dotsWrap.appendChild(document.createElement('span')));
  const dots = dotsWrap.querySelectorAll('span');

  const params = new URLSearchParams(window.location.search);
  const startId = params.get('id') || PROFILES[0].id;
  let currentIndex = Math.max(0, PROFILES.findIndex(p => p.id === startId));

  function render(index, { updateUrl = true } = {}) {
    currentIndex = (index + PROFILES.length) % PROFILES.length;
    const p = PROFILES[currentIndex];

    track.style.opacity = '0';

    setTimeout(() => {
      track.innerHTML = p.image
        ? `<div class="carousel-slide active"><img src="${p.image}" alt=""></div>`
        : `<div class="carousel-slide active"><span>Profile image</span></div>`;

      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));

      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set('id', p.id);
        history.replaceState(null, '', url);
      }

      track.style.opacity = '1';
    }, 150);
  }

  track.style.transition = 'opacity .15s ease';
  render(currentIndex, { updateUrl: false });

  document.getElementById('carPrev').addEventListener('click', () => render(currentIndex - 1));
  document.getElementById('carNext').addEventListener('click', () => render(currentIndex + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => render(i)));
});