/* ============================================================
   components.js
   Injects the navbar + footer on every page (so markup lives in
   one place), wires up the hamburger menu, and exposes a couple
   of small shared helpers (toast, active-link highlighting).
   Every page must include:  <div id="site-nav"></div>  and
   <div id="site-footer"></div>  plus this script.
   ============================================================ */

(function () {
  const NAV_LINKS = [
    { href: 'index.html',    label: 'Home',     n: '01' },
    { href: 'story.html',    label: 'Story',     n: '02' },
    { href: 'profiles.html', label: 'Profile',   n: '03' },
    { href: 'scenes.html',   label: 'Scenes',    n: '04' },
    { href: 'world.html',    label: 'World',     n: '05' },
    { href: 'gallery.html',  label: 'Gallery',   n: '06' },
    { href: 'settings.html', label: 'Settings',  n: '07' },
  ];

  function currentFile() {
    const p = window.location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  function renderNav() {
    const mount = document.getElementById('site-nav');
    if (!mount) return;
    const here = currentFile();

    mount.innerHTML = `
      <nav class="site-nav">
        <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div class="nav-panel" id="navPanel">
        <button class="nav-close" id="navCloseBtn" aria-label="Close menu">&times;</button>
        <ul class="nav-links">
          ${NAV_LINKS.map(l => `<li><a data-n="${l.n}" href="${l.href}" class="${here === l.href ? 'active' : ''}">${l.label}</a></li>`).join('')}
        </ul>
      </div>
    `;

    const panel = document.getElementById('navPanel');
    const openBtn = document.getElementById('hamburgerBtn');
    const closeBtn = document.getElementById('navCloseBtn');

    function openMenu() {
      panel.classList.add('open');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      panel.classList.remove('open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    openBtn.addEventListener('click', () => {
      panel.classList.contains('open') ? closeMenu() : openMenu();
    });
    closeBtn.addEventListener('click', closeMenu);
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (window.innerWidth < 900) closeMenu();
    }));
    window.addEventListener('resize', () => { if (window.innerWidth >= 900) closeMenu(); });
  }

  function renderFooter() {
    const mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.innerHTML = `
      <footer class="site-footer">
        <div class="footer-logo">
          <img src="images/prtitle.png" alt="Project Rose logo" style="width:200px; height:auto;">
        </div>
        <div class="footer-credits">
          STORY BY SUMI<br>
          PROOFREAD BY LEADHOSE
        </div>
        <div class="footer-socials">
          <a href="https://www.instagram.com/sumidollhouse/" aria-label="Instagram" target="_blank" rel="noopener">
            <img src="images/insta.png" style="width:20px;">
          </a>
          <a href="https://discord.gg/AkxGDyNYbk" aria-label="Discord" target="_blank" rel="noopener">
            <img src="images/discord-white-icon.png" style="width:20px;">
          </a>
        </div>
      </footer>
    `;
  }

  function showToast(message, duration = 2200) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), duration);
  }

  window.ProjectRose = window.ProjectRose || {};
  window.ProjectRose.showToast = showToast;

  function renderToTop() {
    if (document.getElementById('toTopBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'toTopBtn';
    btn.className = 'to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&uarr;';
    document.body.appendChild(btn);

    function toggleVisible() {
      btn.classList.toggle('show', window.scrollY > 400);
    }
    window.addEventListener('scroll', toggleVisible, { passive: true });
    toggleVisible();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    renderFooter();
    renderToTop();
  });
})();
