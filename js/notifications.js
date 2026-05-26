/**
 * Toast notification system
 */
const Notifications = (() => {
  let container;

  function init() {
    container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  }

  function show(title, message, type = 'info', duration = 4000) {
    if (!container) init();

    const icons = { success: '✓', warning: '⚠', danger: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">×</button>
    `;

    container.appendChild(toast);

    const close = () => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    if (duration > 0) setTimeout(close, duration);

    const badge = document.getElementById('notifBadge');
    if (badge) badge.classList.add('active');

    return toast;
  }

  function waterReminder() {
    const data = Storage.get();
    if (!data.settings?.notifications?.water) return;
    show('Hydration Reminder', 'Time to drink a glass of water! Stay hydrated.', 'info');
  }

  function weightReminder() {
    const data = Storage.get();
    if (!data.settings?.notifications?.weight) return;
    show('Weight Log', 'Remember to log your weight today for accurate tracking.', 'info');
  }

  function goalProgress(percent) {
    const data = Storage.get();
    if (!data.settings?.notifications?.goals) return;
    if (percent >= 100) {
      show('Goal Achieved!', 'Congratulations! You reached your health goal.', 'success');
    } else if (percent >= 75) {
      show('Almost There!', `You're ${percent}% toward your goal. Keep going!`, 'success');
    }
  }

  function healthWarning(category) {
    const data = Storage.get();
    if (!data.settings?.notifications?.health) return;
    if (category === 'obese' || category === 'underweight') {
      show('Health Notice', 'Your BMI is outside the normal range. Consider consulting a healthcare provider.', 'warning', 6000);
    }
  }

  function scheduleReminders() {
    setTimeout(waterReminder, 30000);
    setTimeout(weightReminder, 60000);
  }

  return { init, show, waterReminder, weightReminder, goalProgress, healthWarning, scheduleReminders };
})();
