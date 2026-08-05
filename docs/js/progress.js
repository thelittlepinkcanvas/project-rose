/* ============================================================
   progress.js
   All persistence lives in localStorage, entirely on-device.
   Two keys:
     pr_settings  -> { saveEnabled, fontSize, lineHeight }
     pr_progress  -> { bookId, chapterId, chapterTitle, updatedAt }
   No account / server round-trip involved.
   ============================================================ */

(function () {
  const SETTINGS_KEY = 'pr_settings';
  const PROGRESS_KEY = 'pr_progress';

  const FONT_SIZES = { sm: '0.92rem', md: '1.05rem', lg: '1.22rem' };
  const LINE_HEIGHTS = { compact: '1.5', normal: '1.8', relaxed: '2.15' };

  const DEFAULT_SETTINGS = { saveEnabled: true, fontSize: 'md', lineHeight: 'normal' };

  function getSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return { ...DEFAULT_SETTINGS };
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function setSettings(partial) {
    const current = getSettings();
    const next = { ...current, ...partial };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    applyReaderVars(next);
    return next;
  }

  function applyReaderVars(settings) {
    const s = settings || getSettings();
    document.documentElement.style.setProperty('--reader-font-size', FONT_SIZES[s.fontSize] || FONT_SIZES.md);
    document.documentElement.style.setProperty('--reader-line-height', LINE_HEIGHTS[s.lineHeight] || LINE_HEIGHTS.normal);
  }

  function isSaveEnabled() {
    return getSettings().saveEnabled;
  }

  function getProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveProgress(bookId, chapterId, chapterTitle) {
    if (!isSaveEnabled()) return false;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      bookId, chapterId, chapterTitle, updatedAt: Date.now(),
    }));
    return true;
  }

  function clearProgress() {
    localStorage.removeItem(PROGRESS_KEY);
  }

  // Apply reader vars as soon as this script loads on any page.
  applyReaderVars();

  window.ProjectRose = window.ProjectRose || {};
  Object.assign(window.ProjectRose, {
    getSettings, setSettings, isSaveEnabled,
    getProgress, saveProgress, clearProgress,
  });
})();