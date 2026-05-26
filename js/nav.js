/**
 * Shared sidebar navigation — injects into #sidebar on every page
 */
const Nav = (() => {
  const SECTIONS = [
    {
      title: 'Main',
      links: [
        { href: 'index.html', icon: '⌂', label: 'Dashboard', id: 'index' },
        { href: 'analytics.html', icon: '📊', label: 'Analytics', id: 'analytics' },
        { href: 'health-score.html', icon: '💯', label: 'Health Score', id: 'health-score' },
        { href: 'reports.html', icon: '📋', label: 'Reports', id: 'reports' },
        { href: 'weekly-summary.html', icon: '📅', label: 'Weekly Summary', id: 'weekly-summary' },
        { href: 'monthly-report.html', icon: '🗓', label: 'Monthly Report', id: 'monthly-report' }
      ]
    },
    {
      title: 'Tracking',
      links: [
        { href: 'bmi-calculator.html', icon: '⚖', label: 'BMI Calculator', id: 'bmi-calculator' },
        { href: 'weight-tracker.html', icon: '📈', label: 'Weight Tracker', id: 'weight-tracker' },
        { href: 'water-tracker.html', icon: '💧', label: 'Water Tracker', id: 'water-tracker' },
        { href: 'step-counter.html', icon: '👟', label: 'Step Counter', id: 'step-counter' },
        { href: 'sleep-tracker.html', icon: '😴', label: 'Sleep Tracker', id: 'sleep-tracker' },
        { href: 'mood-journal.html', icon: '😊', label: 'Mood Journal', id: 'mood-journal' },
        { href: 'activity-log.html', icon: '📝', label: 'Activity Log', id: 'activity-log' }
      ]
    },
    {
      title: 'Fitness',
      links: [
        { href: 'fitness-goals.html', icon: '🎯', label: 'Fitness Goals', id: 'fitness-goals' },
        { href: 'workout-plans.html', icon: '🏋', label: 'Workout Plans', id: 'workout-plans' },
        { href: 'exercise-library.html', icon: '📚', label: 'Exercise Library', id: 'exercise-library' },
        { href: 'workout-timer.html', icon: '⏱', label: 'Workout Timer', id: 'workout-timer' },
        { href: 'challenges.html', icon: '🏆', label: 'Challenges', id: 'challenges' },
        { href: 'achievements.html', icon: '⭐', label: 'Achievements', id: 'achievements' }
      ]
    },
    {
      title: 'Nutrition',
      links: [
        { href: 'calorie-calculator.html', icon: '🔥', label: 'Calorie Calculator', id: 'calorie-calculator' },
        { href: 'meal-planner.html', icon: '🍽', label: 'Meal Planner', id: 'meal-planner' },
        { href: 'nutrition-guide.html', icon: '🥗', label: 'Nutrition Guide', id: 'nutrition-guide' },
        { href: 'body-fat.html', icon: '📐', label: 'Body Fat', id: 'body-fat' }
      ]
    },
    {
      title: 'Health',
      links: [
        { href: 'heart-rate.html', icon: '❤', label: 'Heart Rate', id: 'heart-rate' },
        { href: 'blood-pressure.html', icon: '🩺', label: 'Blood Pressure', id: 'blood-pressure' },
        { href: 'medications.html', icon: '💊', label: 'Medications', id: 'medications' },
        { href: 'appointments.html', icon: '📆', label: 'Appointments', id: 'appointments' },
        { href: 'health-tips.html', icon: '💡', label: 'Health Tips', id: 'health-tips' }
      ]
    },
    {
      title: 'More',
      links: [
        { href: 'progress-gallery.html', icon: '🖼', label: 'Progress Gallery', id: 'progress-gallery' },
        { href: 'profile.html', icon: '👤', label: 'Profile', id: 'profile' },
        { href: 'notifications-center.html', icon: '🔔', label: 'Notifications', id: 'notifications-center' },
        { href: 'data-export.html', icon: '💾', label: 'Data Export', id: 'data-export' },
        { href: 'settings.html', icon: '⚙', label: 'Settings', id: 'settings' },
        { href: 'help.html', icon: '❓', label: 'Help', id: 'help' },
        { href: 'privacy.html', icon: '🔒', label: 'Privacy', id: 'privacy' }
      ]
    }
  ];

  function getActiveId() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar?.dataset.active) return sidebar.dataset.active;
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path.replace('.html', '') || 'index';
  }

  function render() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const active = getActiveId();

    let html = `
      <div class="sidebar-brand">
        <span class="brand-icon">◈</span>
        <span class="brand-text">HealthPulse</span>
      </div>
      <div class="nav-scroll">
    `;

    SECTIONS.forEach(section => {
      html += `<div class="nav-section"><span class="nav-section-title">${section.title}</span><ul class="nav-links">`;
      section.links.forEach(link => {
        const isActive = link.id === active || (active === 'index' && link.id === 'index');
        html += `<li><a href="${link.href}" class="nav-link${isActive ? ' active' : ''}"><span class="nav-icon">${link.icon}</span> ${link.label}</a></li>`;
      });
      html += '</ul></div>';
    });

    html += `</div><button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">☰</button>`;
    sidebar.innerHTML = html;
  }

  function getPageCount() {
    return SECTIONS.reduce((n, s) => n + s.links.length, 0);
  }

  return { render, getActiveId, SECTIONS, getPageCount };
})();
