/**
 * Theme management
 */
const Themes = (() => {
  const THEMES = ['dark', 'light', 'neon', 'nature'];

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const data = Storage.get();
    data.settings.theme = theme;
    Storage.set(data);
    updatePickerUI(theme);
  }

  function init() {
    const data = Storage.get();
    apply(data.settings?.theme || 'dark');
    renderQuickSwitcher();
    bindPicker();
  }

  function updatePickerUI(theme) {
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    document.querySelectorAll('.theme-quick-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  function renderQuickSwitcher() {
    const containers = document.querySelectorAll('#themeQuick');
    const colors = { dark: '#0F172A', light: '#F8FAFC', neon: '#00FF88', nature: '#4ADE80' };
    containers.forEach(container => {
      if (!container || container.children.length) return;
      THEMES.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'theme-quick-btn';
        btn.dataset.theme = t;
        btn.title = t.charAt(0).toUpperCase() + t.slice(1);
        btn.style.background = colors[t];
        btn.addEventListener('click', () => apply(t));
        container.appendChild(btn);
      });
    });
  }

  function bindPicker() {
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => apply(btn.dataset.theme));
    });
  }

  function getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  return { apply, init, getCurrent, THEMES };
})();
