/**
 * Page-specific initialization for all HealthPulse pages
 */
const Pages = (() => {
  let data;

  function baseInit() {
    data = Storage.get();
    data = Storage.resetDailyIfNeeded(data);
    Storage.set(data);
    if (typeof App !== 'undefined') App.initShell();
    else { Nav.render(); Themes.init(); Notifications.init(); }
  }

  function $(id) { return document.getElementById(id); }
  function setText(id, v) { const e = $(id); if (e) e.textContent = v; }

  function initBmiCalculator() {
    baseInit();
    if (!document.getElementById('bmiForm')) return;
    App.initDashboard?.();
  }

  function initWeightTracker() {
    baseInit();
    renderWeightList();
    $('weightForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      let w = parseFloat($('logWeight')?.value);
      if (!w) return;
      const unit = data.settings?.units || 'metric';
      if (unit === 'imperial') w = BMI.lbsToKg(w);
      data = Tracker.addWeight(data, w, $('logDate')?.value || Storage.todayKey());
      Storage.set(data);
      $('logWeight').value = '';
      renderWeightList();
      drawChart('weightPageChart', [...(data.weightHistory || [])].reverse().slice(-14).map(e => e.weight), 'line');
      Notifications.show('Logged', 'Weight entry saved', 'success');
    });
    if ($('logDate')) $('logDate').value = Storage.todayKey();
    drawChart('weightPageChart', [...(data.weightHistory || [])].reverse().slice(-14).map(e => e.weight), 'line');
  }

  function renderWeightList() {
    data = Storage.get();
    const el = $('weightList');
    if (!el) return;
    const entries = (data.weightHistory || []).slice(0, 20);
    el.innerHTML = entries.length ? entries.map(e =>
      `<div class="list-item glass"><span><strong>${e.weight} kg</strong><br><small>${e.date}</small></span>
       <button class="delete-btn" data-id="${e.id}">×</button></div>`
    ).join('') : '<p class="text-muted">No entries yet.</p>';
    el.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = () => {
        data = Tracker.removeWeight(data, parseInt(btn.dataset.id, 10));
        Storage.set(data);
        renderWeightList();
      };
    });
  }

  function initWaterTracker() {
    baseInit();
    updateWaterPage();
    $('addWaterBtn')?.addEventListener('click', () => { data = Tracker.addWater(data); Storage.set(data); updateWaterPage(); });
    $('removeWaterBtn')?.addEventListener('click', () => { data = Tracker.removeWater(data); Storage.set(data); updateWaterPage(); });
    $('resetWaterBtn')?.addEventListener('click', () => { data = Tracker.resetWater(data); Storage.set(data); updateWaterPage(); });
  }

  function updateWaterPage() {
    data = Storage.get();
    const count = data.water?.today || 0;
    const goal = data.water?.goal || 8;
    const pct = Tracker.getWaterPercent(data);
    setText('waterPageCount', count);
    setText('waterPageGoal', goal);
    setText('waterPagePct', Math.round(pct) + '%');
    const wave = $('waterPageWave');
    if (wave) wave.style.height = pct + '%';
    Charts.updateCircularProgress($('waterPageCircle'), pct);
  }

  function initCalorieCalculator() {
    baseInit();
    const p = data.profile;
    setText('pageBmr', p?.bmr ? p.bmr + ' kcal' : 'Calculate BMI first');
    setText('pageCalories', p?.dailyCalories ? p.dailyCalories + ' kcal' : '--');
    setText('pageBodyFat', p?.bodyFat ? p.bodyFat + '%' : '--');
  }

  function initBodyFat() {
    baseInit();
    const p = data.profile;
    setText('bfValue', p?.bodyFat ? p.bodyFat + '%' : '--');
    setText('bfBmi', p?.bmi || '--');
  }

  function initFitnessGoals() {
    baseInit();
    $('goalTarget') && ($('goalTarget').value = data.goals?.targetWeight || '');
    $('goalFitness') && ($('goalFitness').value = data.goals?.fitnessGoal || 'maintain');
    $('saveGoalsBtn')?.addEventListener('click', () => {
      data.goals.targetWeight = parseFloat($('goalTarget')?.value) || null;
      data.goals.fitnessGoal = $('goalFitness')?.value;
      Storage.set(data);
      Notifications.show('Saved', 'Fitness goals updated', 'success');
    });
    setText('goalProgressPct', Tracker.getGoalProgress(data) + '%');
  }

  function initSleepTracker() {
    baseInit();
    setText('sleepAvgDisplay', Tracker.getSleepAvg(data) ?? '--');
    $('sleepForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const h = parseFloat($('sleepInput')?.value);
      if (!h) return;
      data = Tracker.logSleep(data, h);
      Storage.set(data);
      setText('sleepAvgDisplay', Tracker.getSleepAvg(data));
      Notifications.show('Sleep Logged', h + ' hours recorded', 'success');
    });
    renderSleepHistory();
  }

  function renderSleepHistory() {
    const el = $('sleepHistory');
    if (!el) return;
    data = Storage.get();
    el.innerHTML = (data.sleep?.history || []).slice(0, 14).map(s =>
      `<div class="list-item glass"><span>${s.date}</span><span>${s.hours} hrs</span></div>`
    ).join('') || '<p class="text-muted">No sleep logs yet.</p>';
  }

  function initMoodJournal() {
    baseInit();
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        data = Tracker.setMood(data, btn.dataset.mood);
        Storage.set(data);
        setText('moodToday', 'Today: ' + btn.dataset.mood);
      };
    });
    if (data.mood?.today) setText('moodToday', 'Today: ' + data.mood.today);
  }

  function initHealthTips() {
    baseInit();
    showTip();
    $('nextTipBtn')?.addEventListener('click', showTip);
    function showTip() {
      const t = Tracker.getRandomTip();
      setText('tipPageCategory', t.category);
      setText('tipPageText', t.text);
      setText('tipPageQuote', '"' + t.quote + '"');
    }
  }

  function initAchievements() {
    baseInit();
    data = Tracker.checkAchievements(data);
    Storage.set(data);
    const grid = $('achievementsGrid');
    if (!grid) return;
    grid.innerHTML = Tracker.getAchievementList(data).map(a =>
      `<div class="achievement-card glass ${a.unlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-name">${a.name}</span>
        <p>${a.desc}</p>
        <span class="achievement-status">${a.unlocked ? 'Unlocked' : 'Locked'}</span>
      </div>`
    ).join('');
  }

  function initChallenges() {
    baseInit();
    const pct = Tracker.getChallengeProgress(data);
    setText('challengePercent', pct + '%');
    const fill = $('challengeBar');
    if (fill) fill.style.width = pct + '%';
  }

  function initHeartRate() {
    baseInit();
    loadVitals('heartRate');
    $('hrForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      saveVital('heartRate', { bpm: parseInt($('hrBpm')?.value, 10), date: Storage.todayKey() });
    });
  }

  function initBloodPressure() {
    baseInit();
    loadVitals('bloodPressure');
    $('bpForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      saveVital('bloodPressure', {
        systolic: parseInt($('bpSys')?.value, 10),
        diastolic: parseInt($('bpDia')?.value, 10),
        date: Storage.todayKey()
      });
    });
  }

  function saveVital(key, entry) {
    data = Storage.get();
    data.vitals = data.vitals || {};
    data.vitals[key] = data.vitals[key] || [];
    data.vitals[key].unshift({ ...entry, id: Date.now() });
    data.vitals[key] = data.vitals[key].slice(0, 50);
    Storage.set(data);
    loadVitals(key);
    Notifications.show('Saved', 'Reading recorded', 'success');
  }

  function loadVitals(key) {
    data = Storage.get();
    const list = $('vitalsList');
    if (!list) return;
    const entries = data.vitals?.[key] || [];
    list.innerHTML = entries.length ? entries.slice(0, 15).map(e => {
      if (key === 'heartRate') return `<div class="list-item glass"><span>${e.date}</span><span>${e.bpm} bpm</span></div>`;
      return `<div class="list-item glass"><span>${e.date}</span><span>${e.systolic}/${e.diastolic} mmHg</span></div>`;
    }).join('') : '<p class="text-muted">No readings yet.</p>';
  }

  function initMedications() {
    baseInit();
    data.medications = data.medications || [];
    renderMeds();
    $('medForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      data.medications.unshift({
        id: Date.now(),
        name: $('medName')?.value,
        dose: $('medDose')?.value,
        time: $('medTime')?.value
      });
      Storage.set(data);
      $('medForm').reset();
      renderMeds();
    });
  }

  function renderMeds() {
    data = Storage.get();
    const el = $('medList');
    if (!el) return;
    el.innerHTML = (data.medications || []).map(m =>
      `<div class="list-item glass"><div><strong>${m.name}</strong><br><small>${m.dose} — ${m.time}</small></div>
       <button class="delete-btn" data-id="${m.id}">×</button></div>`
    ).join('') || '<p class="text-muted">No medications added.</p>';
    el.querySelectorAll('.delete-btn').forEach(b => {
      b.onclick = () => {
        data.medications = data.medications.filter(x => x.id !== parseInt(b.dataset.id, 10));
        Storage.set(data);
        renderMeds();
      };
    });
  }

  function initAppointments() {
    baseInit();
    data.appointments = data.appointments || [];
    renderAppts();
    $('apptForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      data.appointments.push({
        id: Date.now(),
        title: $('apptTitle')?.value,
        date: $('apptDate')?.value,
        notes: $('apptNotes')?.value
      });
      Storage.set(data);
      $('apptForm').reset();
      renderAppts();
    });
  }

  function renderAppts() {
    data = Storage.get();
    const el = $('apptList');
    if (!el) return;
    el.innerHTML = (data.appointments || []).map(a =>
      `<div class="list-item glass"><div><strong>${a.title}</strong><br><small>${a.date}</small><p>${a.notes || ''}</p></div>
       <button class="delete-btn" data-id="${a.id}">×</button></div>`
    ).join('') || '<p class="text-muted">No appointments scheduled.</p>';
    el.querySelectorAll('.delete-btn').forEach(b => {
      b.onclick = () => {
        data.appointments = data.appointments.filter(x => x.id !== parseInt(b.dataset.id, 10));
        Storage.set(data);
        renderAppts();
      };
    });
  }

  function initProfile() {
    baseInit();
    const p = data.profile;
    setText('profileBmi', p?.bmi || '--');
    setText('profileWeight', p?.weightKg ? p.weightKg + ' kg' : '--');
    setText('profileHeight', p?.heightCm ? p.heightCm + ' cm' : '--');
    setText('profileAge', p?.age || '--');
    setText('profileStreak', (data.streak?.days || 0) + ' days');
  }

  function initActivityLog() {
    baseInit();
    const logs = [];
    (data.weightHistory || []).forEach(e => logs.push({ type: 'Weight', desc: e.weight + ' kg', date: e.date }));
    (data.bmiHistory || []).forEach(e => logs.push({ type: 'BMI', desc: String(e.bmi), date: e.date }));
    if (data.water?.today) logs.push({ type: 'Water', desc: data.water.today + ' glasses', date: Storage.todayKey() });
    logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    const el = $('activityList');
    if (el) el.innerHTML = logs.slice(0, 30).map(l =>
      `<div class="list-item glass"><span class="log-type">${l.type}</span><span>${l.desc}</span><span>${l.date}</span></div>`
    ).join('') || '<p class="text-muted">No activity yet.</p>';
  }

  function initStepCounter() {
    baseInit();
    setText('stepsPageCount', data.steps?.today || 0);
    setText('stepsPageGoal', data.steps?.goal || data.settings?.stepsGoal || 10000);
    $('addStepsBtn')?.addEventListener('click', () => {
      const n = parseInt($('stepsPageInput')?.value, 10) || 0;
      if (n > 0) { data = Tracker.addSteps(data, n); Storage.set(data); setText('stepsPageCount', data.steps.today); }
    });
  }

  function initWorkoutTimer() {
    baseInit();
    let sec = 0, interval = null;
    const display = $('timerPageDisplay');
    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    $('timerPageStart')?.addEventListener('click', () => {
      if (interval) return;
      interval = setInterval(() => { sec++; if (display) display.textContent = fmt(sec); }, 1000);
    });
    $('timerPagePause')?.addEventListener('click', () => { clearInterval(interval); interval = null; });
    $('timerPageReset')?.addEventListener('click', () => { clearInterval(interval); sec = 0; if (display) display.textContent = '00:00'; });
  }

  function initProgressGallery() {
    baseInit();
    data.gallery = data.gallery || [];
    const save = () => {
      const note = $('galleryNote')?.value?.trim();
      if (!note) return;
      data.gallery.unshift({ id: Date.now(), note, date: Storage.todayKey() });
      Storage.set(data);
      $('galleryNote').value = '';
      renderGallery();
      Notifications.show('Saved', 'Progress note added', 'success');
    };
    $('galleryForm')?.addEventListener('submit', (e) => { e.preventDefault(); save(); });
    renderGallery();
  }

  function renderGallery() {
    data = Storage.get();
    const el = $('galleryList');
    if (!el) return;
    el.innerHTML = (data.gallery || []).map(g =>
      `<div class="gallery-card glass"><span class="gallery-date">${g.date}</span><p>${g.note}</p></div>`
    ).join('') || '<p class="text-muted">Add progress notes to track your journey.</p>';
  }

  function initHealthScore() {
    baseInit();
    const p = data.profile;
    let score = 50;
    if (p?.bmi) {
      const cat = BMI.getCategory(p.bmi);
      if (cat.key === 'normal') score += 25;
      else if (cat.key === 'overweight') score += 10;
      else score += 5;
    }
    if ((data.water?.today || 0) >= (data.water?.goal || 8)) score += 10;
    if ((data.steps?.today || 0) >= 5000) score += 10;
    if ((data.streak?.days || 0) >= 3) score += 5;
    score = Math.min(100, score);
    setText('healthScoreValue', score);
    Charts.updateCircularProgress($('healthScoreCircle'), score);
  }

  function initWeeklySummary() {
    baseInit();
    const week = Tracker.getWeeklySummary(data);
    const el = $('weeklyList');
    if (el) el.innerHTML = week.map(d =>
      `<div class="list-item glass"><span>${d.date}</span><span>💧 ${d.water} | ⚖ ${d.weight ? d.weight + 'kg' : '--'}</span></div>`
    ).join('');
  }

  function initMonthlyReport() {
    baseInit();
    setText('monthBmi', data.profile?.bmi || '--');
    setText('monthWeight', data.profile?.weightKg ? data.profile.weightKg + ' kg' : '--');
    setText('monthChange', Tracker.getWeightChange(data, 30) + ' kg');
    setText('monthStreak', (data.streak?.days || 0) + ' days');
  }

  function initDataExport() {
    baseInit();
    $('exportJsonBtn')?.addEventListener('click', () => {
      const blob = new Blob([Storage.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'healthpulse-backup.json';
      a.click();
      Notifications.show('Exported', 'Data downloaded', 'success');
    });
  }

  function initNotificationsCenter() {
    baseInit();
    const el = $('notifHistory');
    if (el) el.innerHTML = `
      <div class="list-item glass"><span>💧 Water Reminder</span><span>Stay hydrated</span></div>
      <div class="list-item glass"><span>⚖ Weight Log</span><span>Log your weight today</span></div>
      <div class="list-item glass"><span>🎯 Goals</span><span>${Tracker.getGoalProgress(data)}% complete</span></div>`;
  }

  function initGenericList(pageId) {
    baseInit();
  }

  function drawChart(canvasId, values, type) {
    const canvas = $(canvasId);
    if (!canvas || !values?.length) return;
    const labels = values.map((_, i) => String(i + 1));
    if (type === 'line') Charts.lineChart(canvas, labels, values);
    else Charts.barChart(canvas, labels, values);
  }

  const ROUTES = {
    'bmi-calculator': initBmiCalculator,
    'weight-tracker': initWeightTracker,
    'water-tracker': initWaterTracker,
    'calorie-calculator': initCalorieCalculator,
    'body-fat': initBodyFat,
    'fitness-goals': initFitnessGoals,
    'sleep-tracker': initSleepTracker,
    'mood-journal': initMoodJournal,
    'health-tips': initHealthTips,
    'achievements': initAchievements,
    'challenges': initChallenges,
    'heart-rate': initHeartRate,
    'blood-pressure': initBloodPressure,
    'medications': initMedications,
    'appointments': initAppointments,
    'profile': initProfile,
    'activity-log': initActivityLog,
    'step-counter': initStepCounter,
    'workout-timer': initWorkoutTimer,
    'progress-gallery': initProgressGallery,
    'health-score': initHealthScore,
    'weekly-summary': initWeeklySummary,
    'monthly-report': initMonthlyReport,
    'data-export': initDataExport,
    'notifications-center': initNotificationsCenter,
    'workout-plans': initGenericList,
    'exercise-library': initGenericList,
    'meal-planner': initGenericList,
    'nutrition-guide': initGenericList,
    'help': initGenericList,
    'privacy': initGenericList
  };

  function init() {
    const pageId = Nav.getActiveId();
    const fn = ROUTES[pageId];
    if (fn) fn();
    else baseInit();
  }

  return { init, ROUTES };
})();
