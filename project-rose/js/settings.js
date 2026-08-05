document.addEventListener('DOMContentLoaded', () => {
  const PR = window.ProjectRose || {};
  const settings = PR.getSettings ? PR.getSettings() : { saveEnabled: true, fontSize: 'md', lineHeight: 'normal' };

  const saveToggle = document.getElementById('saveToggle');
  const fontSizeSelect = document.getElementById('fontSizeSelect');
  const lineHeightSelect = document.getElementById('lineHeightSelect');

  saveToggle.checked = settings.saveEnabled;
  fontSizeSelect.value = settings.fontSize;
  lineHeightSelect.value = settings.lineHeight;

  saveToggle.addEventListener('change', () => {
    const enabled = saveToggle.checked;
    PR.setSettings({ saveEnabled: enabled });
    if (!enabled) {
      PR.clearProgress();
      PR.showToast('Reading history cleared.');
    } else {
      PR.showToast('Progress saving turned on.');
    }
  });

  fontSizeSelect.addEventListener('change', () => {
    PR.setSettings({ fontSize: fontSizeSelect.value });
    PR.showToast('Font size updated.');
  });

  lineHeightSelect.addEventListener('change', () => {
    PR.setSettings({ lineHeight: lineHeightSelect.value });
    PR.showToast('Line height updated.');
  });
});