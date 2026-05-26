/**
 * Main application controller
 */
const App = (() => {
  let data;
  let currentUnit = 'metric';
  let currentGender = 'male';
  let timerInterval = null;
  let timerSeconds = 0;
  let tipIndex = 0;

  function initShell() {
    Nav.render();
    Themes.init();
    Notifications.init();
    initParticles();
    initSidebar();
    initReveal();
  }

  function init() {
    data = Storage.get();
    data = Storage.resetDailyIfNeeded(data);
    Storage.set(data);

    initShell();
    initCounters();
    initOnboarding();

    if (document.getElementById('bmiForm')) initDashboard();

    updateGreeting();
    Notifications.scheduleReminders();
  }

  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 15 + 's';
      p.style.animationDuration = 10 + Math.random() * 10 + 's';
      container.appendChild(p);
    }
  }

  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const toggle = document.getElementById('sidebarToggle');

    mobileBtn?.addEventListener('click', () => sidebar?.classList.toggle('open'));
    toggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));

    document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
      document.body.classList.toggle('fullscreen');
      Notifications.show('Fullscreen', document.body.classList.contains('fullscreen') ? 'Dashboard expanded' : 'Dashboard restored', 'info', 2000);
    });

    document.getElementById('notifBell')?.addEventListener('click', () => {
      Notifications.waterReminder();
    });
  }

  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.target) || 0;
        animateCounter(el, target);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(el => observer.observe(el));
  }

  function animateCounter(el, target) {
    const duration = 1200;
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initOnboarding() {
    const overlay = document.getElementById('onboarding');
    if (!overlay) return;
    data = Storage.get();
    if (data.onboardingComplete) {
      overlay.classList.add('hidden');
      return;
    }

    const slides = overlay.querySelectorAll('.onboarding-slide');
    const dotsContainer = document.getElementById('onboardingDots');
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'onboarding-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer?.appendChild(dot);
    });

    function goToSlide(n) {
      slides[current].classList.remove('active');
      dotsContainer?.children[current]?.classList.remove('active');
      current = n;
      slides[current].classList.add('active');
      dotsContainer?.children[current]?.classList.add('active');
    }

    document.getElementById('nextOnboarding')?.addEventListener('click', () => {
      if (current < slides.length - 1) goToSlide(current + 1);
      else finish();
    });

    document.getElementById('skipOnboarding')?.addEventListener('click', finish);

    function finish() {
      overlay.classList.add('hidden');
      data.onboardingComplete = true;
      Storage.set(data);
    }
  }

  function updateGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const h = new Date().getHours();
    const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    el.textContent = `${greet} — track your wellness today`;
  }

  function initDashboard() {
    currentUnit = data.settings?.units || data.profile?.unit || 'metric';
    currentGender = data.profile?.gender || 'male';

    initUnitSwitcher();
    initGenderButtons();
    initBMIForm();
    initWeightTracking();
    initWaterTracker();
    initSteps();
    initTips();
    initExtras();

    populateFormFromData();
    refreshDashboard();
  }

  function initUnitSwitcher() {
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUnit = btn.dataset.unit;
        toggleUnitInputs();
      });
    });
    toggleUnitInputs();
  }

  function toggleUnitInputs() {
    const metric = currentUnit === 'metric';
    document.getElementById('heightMetric')?.classList.toggle('hidden', !metric);
    document.getElementById('heightImperial')?.classList.toggle('hidden', metric);
    const suffix = document.getElementById('weightUnit');
    const logUnit = document.getElementById('logWeightUnit');
    if (suffix) suffix.textContent = metric ? 'kg' : 'lbs';
    if (logUnit) logUnit.textContent = metric ? 'kg' : 'lbs';
  }

  function initGenderButtons() {
    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGender = btn.dataset.gender;
      });
    });
  }

  function getHeightCm() {
    if (currentUnit === 'metric') {
      return parseFloat(document.getElementById('heightCm')?.value);
    }
    const ft = parseFloat(document.getElementById('heightFt')?.value) || 0;
    const inches = parseFloat(document.getElementById('heightIn')?.value) || 0;
    return BMI.ftInToCm(ft, inches);
  }

  function getWeightKg() {
    let w = parseFloat(document.getElementById('weight')?.value);
    if (!w) return null;
    return currentUnit === 'imperial' ? BMI.lbsToKg(w) : w;
  }

  function initBMIForm() {
    document.getElementById('bmiForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateAndSaveBMI();
    });
  }

  function calculateAndSaveBMI() {
    const heightCm = getHeightCm();
    let weightKg = getWeightKg();
    const age = parseInt(document.getElementById('age')?.value, 10);
    const activity = parseFloat(document.getElementById('activity')?.value) || 1.55;
    const fitnessGoal = document.getElementById('fitnessGoal')?.value || 'maintain';

    if (!heightCm || !weightKg) {
      Notifications.show('Missing Data', 'Please enter valid height and weight.', 'warning');
      return;
    }

    const bmi = BMI.calculate(heightCm, weightKg);
    const category = BMI.getCategory(bmi);
    const bmr = BMI.calculateBMR(weightKg, heightCm, age, currentGender);
    const calories = BMI.calculateDailyCalories(bmr, activity, fitnessGoal);
    const bodyFat = BMI.estimateBodyFat(bmi, age, currentGender);
    const ideal = BMI.idealWeightRange(heightCm);

    data.profile = {
      ...data.profile,
      heightCm, weightKg, age, gender: currentGender,
      unit: currentUnit, bmi, bmiCategory: category.key,
      bmr, dailyCalories: calories, bodyFat
    };
    data.goals.fitnessGoal = fitnessGoal;

    data.bmiHistory = data.bmiHistory || [];
    data.bmiHistory.unshift({ bmi, date: Storage.todayKey() });
    data.bmiHistory = data.bmiHistory.slice(0, 90);

    data.calorieHistory = data.calorieHistory || {};
    data.calorieHistory[Storage.todayKey()] = calories;

    data = Tracker.checkAchievements(data);
    Storage.set(data);

    displayBMIResult(bmi, category, ideal, fitnessGoal);
    refreshDashboard();
    Notifications.show('BMI Calculated', `Your BMI is ${bmi} (${category.label})`, 'success');
    Notifications.healthWarning(category.key);
    Notifications.goalProgress(Tracker.getGoalProgress(data));
  }

  function displayBMIResult(bmi, category, ideal, fitnessGoal) {
    document.getElementById('bmiScore').textContent = bmi;
    const badge = document.getElementById('categoryBadge');
    badge.textContent = category.label;
    badge.className = 'category-badge ' + category.class;

    document.getElementById('healthMessage').textContent = BMI.getMessage(category.key);

    const unit = currentUnit === 'metric' ? 'kg' : 'lbs';
    let min = ideal.min, max = ideal.max;
    if (currentUnit === 'imperial') {
      min = Math.round(BMI.kgToLbs(ideal.min) * 10) / 10;
      max = Math.round(BMI.kgToLbs(ideal.max) * 10) / 10;
    }
    document.getElementById('idealWeightValue').textContent = `${min} – ${max} ${unit}`;

    const recs = document.getElementById('bmiRecommendations');
    recs.innerHTML = '<ul>' + BMI.getRecommendations(category.key).map(r => `<li>${r}</li>`).join('') + '</ul>';

    const gaugePct = BMI.bmiToGaugePercent(bmi);
    document.getElementById('gaugeFill').style.width = gaugePct + '%';
    document.getElementById('gaugeMarker').style.left = `calc(${gaugePct}% - 2px)`;

    document.getElementById('bmrValue').textContent = data.profile.bmr || '--';
    document.getElementById('calorieTarget').textContent = data.profile.dailyCalories || '--';
    document.getElementById('bodyFatValue').textContent = data.profile.bodyFat ? data.profile.bodyFat + '%' : '--';

    const aiEl = document.getElementById('aiRecommendation');
    if (aiEl) aiEl.textContent = BMI.getAIRecommendation(bmi, category, fitnessGoal);
  }

  function populateFormFromData() {
    const p = data.profile;
    if (!p.heightCm && !p.weightKg) return;

    if (p.unit) {
      currentUnit = p.unit;
      document.querySelectorAll('.unit-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.unit === currentUnit);
      });
      toggleUnitInputs();
    }

    if (currentUnit === 'metric') {
      if (p.heightCm) document.getElementById('heightCm').value = p.heightCm;
      if (p.weightKg) document.getElementById('weight').value = p.weightKg;
    } else {
      const totalIn = p.heightCm / 2.54;
      document.getElementById('heightFt').value = Math.floor(totalIn / 12);
      document.getElementById('heightIn').value = Math.round(totalIn % 12);
      if (p.weightKg) document.getElementById('weight').value = Math.round(BMI.kgToLbs(p.weightKg) * 10) / 10;
    }

    if (p.age) document.getElementById('age').value = p.age;
    if (p.gender) {
      currentGender = p.gender;
      document.querySelectorAll('.gender-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.gender === currentGender);
      });
    }
    if (p.fitnessGoal || data.goals?.fitnessGoal) {
      document.getElementById('fitnessGoal').value = data.goals?.fitnessGoal || 'maintain';
    }

    if (p.bmi) {
      const cat = BMI.getCategory(p.bmi);
      displayBMIResult(p.bmi, cat, BMI.idealWeightRange(p.heightCm), data.goals?.fitnessGoal);
    }
  }

  function initWeightTracking() {
    const dateInput = document.getElementById('logDate');
    if (dateInput) dateInput.value = Storage.todayKey();

    document.getElementById('weightForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      let w = parseFloat(document.getElementById('logWeight')?.value);
      if (!w) return;
      if (currentUnit === 'imperial') w = BMI.lbsToKg(w);
      data = Tracker.addWeight(data, w, document.getElementById('logDate')?.value);
      data = Tracker.checkAchievements(data);
      Storage.set(data);
      document.getElementById('logWeight').value = '';
      renderWeightHistory();
      refreshDashboard();
      drawWeightMiniChart();
      Notifications.show('Weight Logged', `Added ${w.toFixed(1)} kg entry`, 'success');
    });

    document.getElementById('saveTarget')?.addEventListener('click', () => {
      let t = parseFloat(document.getElementById('targetWeight')?.value);
      if (!t) return;
      if (currentUnit === 'imperial') t = BMI.lbsToKg(t);
      data.goals.targetWeight = t;
      Storage.set(data);
      Notifications.show('Goal Saved', `Target weight set to ${t} kg`, 'success');
      refreshDashboard();
    });

    if (data.goals?.targetWeight) {
      const tw = document.getElementById('targetWeight');
      if (tw) tw.value = currentUnit === 'imperial'
        ? Math.round(BMI.kgToLbs(data.goals.targetWeight) * 10) / 10
        : data.goals.targetWeight;
    }

    renderWeightHistory();
    drawWeightMiniChart();
  }

  function renderWeightHistory() {
    const container = document.getElementById('weightHistory');
    if (!container) return;
    const entries = (data.weightHistory || []).slice(0, 12);
    if (!entries.length) {
      container.innerHTML = '<p class="text-muted">No weight entries yet. Log your first weight above.</p>';
      return;
    }
    const unit = currentUnit === 'metric' ? 'kg' : 'lbs';
    container.innerHTML = entries.map(e => {
      const w = currentUnit === 'imperial' ? Math.round(BMI.kgToLbs(e.weight) * 10) / 10 : e.weight;
      return `<div class="weight-entry glass">
        <div><strong>${w} ${unit}</strong><br><small>${e.date}</small></div>
        <button class="delete-btn" data-id="${e.id}" aria-label="Delete">×</button>
      </div>`;
    }).join('');

    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        data = Tracker.removeWeight(data, parseInt(btn.dataset.id, 10));
        Storage.set(data);
        renderWeightHistory();
        drawWeightMiniChart();
        refreshDashboard();
      });
    });
  }

  function drawWeightMiniChart() {
    const canvas = document.getElementById('weightMiniChart');
    if (!canvas) return;
    const history = [...(data.weightHistory || [])].reverse().slice(-14);
    if (!history.length) return;
    Charts.lineChart(canvas, history.map(e => e.date.slice(5)), history.map(e => e.weight));
  }

  function initWaterTracker() {
    const goalInput = document.getElementById('waterGoalInput');
    if (goalInput) goalInput.value = data.water?.goal || data.settings?.waterGoal || 8;

    goalInput?.addEventListener('change', () => {
      data.water.goal = parseInt(goalInput.value, 10) || 8;
      Storage.set(data);
      updateWaterUI();
    });

    document.getElementById('addWater')?.addEventListener('click', () => {
      data = Tracker.addWater(data);
      data = Tracker.checkAchievements(data);
      Storage.set(data);
      updateWaterUI();
      refreshDashboard();
      if (data.water.today >= data.water.goal) {
        Notifications.show('Hydration Goal!', 'You reached your daily water goal!', 'success');
      }
    });

    document.getElementById('removeWater')?.addEventListener('click', () => {
      data = Tracker.removeWater(data);
      Storage.set(data);
      updateWaterUI();
      refreshDashboard();
    });

    document.getElementById('resetWater')?.addEventListener('click', () => {
      data = Tracker.resetWater(data);
      Storage.set(data);
      updateWaterUI();
      refreshDashboard();
      Notifications.show('Water Reset', 'Today\'s water intake has been reset.', 'info');
    });

    updateWaterUI();
  }

  function updateWaterUI() {
    const count = data.water?.today || 0;
    const goal = data.water?.goal || 8;
    const pct = Tracker.getWaterPercent(data);

    const countEl = document.getElementById('waterCount');
    if (countEl) countEl.textContent = count;

    const wave = document.getElementById('waterWave');
    if (wave) wave.style.height = pct + '%';

    Charts.updateCircularProgress(document.getElementById('hydrationCircle'), pct);
    const hydPct = document.getElementById('hydrationPct');
    if (hydPct) hydPct.textContent = Math.round(pct) + '%';

    const mini = document.getElementById('waterMiniFill');
    if (mini) mini.style.width = pct + '%';
  }

  function initSteps() {
    document.getElementById('addSteps')?.addEventListener('click', () => {
      const steps = parseInt(document.getElementById('stepsInput')?.value, 10) || 0;
      if (steps <= 0) return;
      data = Tracker.addSteps(data, steps);
      data = Tracker.checkAchievements(data);
      Storage.set(data);
      document.getElementById('stepsInput').value = '';
      refreshDashboard();
      Notifications.show('Steps Added', `+${steps} steps recorded`, 'success');
    });

    document.getElementById('resetSteps')?.addEventListener('click', () => {
      data = Tracker.resetSteps(data);
      Storage.set(data);
      refreshDashboard();
    });
  }

  function initTips() {
    showTip(0);
    document.getElementById('newTipBtn')?.addEventListener('click', () => {
      tipIndex = Math.floor(Math.random() * Tracker.TIPS.length);
      showTip(tipIndex);
    });

    const dots = document.getElementById('tipDots');
    Tracker.TIPS.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'tip-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => showTip(i));
      dots?.appendChild(dot);
    });

    setInterval(() => {
      tipIndex = (tipIndex + 1) % Tracker.TIPS.length;
      showTip(tipIndex);
    }, 8000);
  }

  function showTip(index) {
    const tip = Tracker.TIPS[index];
    document.getElementById('tipCategory').textContent = tip.category;
    document.getElementById('tipText').textContent = tip.text;
    document.getElementById('tipQuote').textContent = `"${tip.quote}"`;
    document.querySelectorAll('.tip-dot').forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function initExtras() {
    document.getElementById('logStreak')?.addEventListener('click', () => {
      data = Tracker.logStreak(data);
      data = Tracker.checkAchievements(data);
      Storage.set(data);
      refreshDashboard();
      Notifications.show('Streak Updated', `${data.streak.days} day streak!`, 'success');
    });

    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        data = Tracker.setMood(data, btn.dataset.mood);
        Storage.set(data);
        document.getElementById('moodStatus').textContent = `Feeling ${btn.dataset.mood} today`;
      });
    });

    initWorkoutTimer();

    document.getElementById('logSleep')?.addEventListener('click', () => {
      const hours = parseFloat(document.getElementById('sleepHours')?.value);
      if (!hours) return;
      data = Tracker.logSleep(data, hours);
      data = Tracker.checkAchievements(data);
      Storage.set(data);
      const avg = Tracker.getSleepAvg(data);
      document.getElementById('sleepAvg').textContent = avg ?? '--';
      Notifications.show('Sleep Logged', `${hours} hours recorded`, 'success');
    });

    document.getElementById('voiceBtn')?.addEventListener('click', () => {
      const pulse = document.getElementById('voicePulse');
      pulse?.classList.add('active');
      Notifications.show('Voice Assistant', 'Simulated: "Show my BMI and water intake today."', 'info', 3000);
      setTimeout(() => pulse?.classList.remove('active'), 3000);
    });

    renderBadges();
    updateChallenge();
    const sleepAvg = Tracker.getSleepAvg(data);
    if (sleepAvg) document.getElementById('sleepAvg').textContent = sleepAvg;
  }

  function initWorkoutTimer() {
    const display = document.getElementById('timerDisplay');
    const format = (s) => {
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = (s % 60).toString().padStart(2, '0');
      return `${m}:${sec}`;
    };

    document.getElementById('timerStart')?.addEventListener('click', () => {
      if (timerInterval) return;
      timerInterval = setInterval(() => {
        timerSeconds++;
        if (display) display.textContent = format(timerSeconds);
      }, 1000);
    });

    document.getElementById('timerPause')?.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerInterval = null;
    });

    document.getElementById('timerReset')?.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerInterval = null;
      timerSeconds = 0;
      if (display) display.textContent = '00:00';
    });
  }

  function renderBadges() {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;
    const badges = Tracker.getAchievementList(data);
    grid.innerHTML = badges.map(b =>
      `<span class="badge-item ${b.unlocked ? '' : 'locked'}" title="${b.desc}">${b.name}</span>`
    ).join('');
  }

  function updateChallenge() {
    const pct = Tracker.getChallengeProgress(data);
    const fill = document.getElementById('challengeFill');
    const pctEl = document.getElementById('challengePct');
    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
  }

  function refreshDashboard() {
    data = Storage.get();
    const p = data.profile;
    const unit = data.settings?.units === 'imperial' || p?.unit === 'imperial' ? 'lbs' : 'kg';

    setCounter('dashBmi', p?.bmi);
    const catEl = document.getElementById('dashBmiCategory');
    if (catEl && p?.bmi) {
      const cat = BMI.getCategory(p.bmi);
      catEl.textContent = cat.label;
      catEl.className = 'stat-badge ' + cat.class;
    }

    if (p?.weightKg) {
      const w = unit === 'lbs' ? Math.round(BMI.kgToLbs(p.weightKg) * 10) / 10 : p.weightKg;
      setCounter('dashWeight', w);
    }

    const change = Tracker.getWeightChange(data);
    const changeEl = document.getElementById('dashWeightChange');
    if (changeEl) changeEl.textContent = `${change >= 0 ? '+' : ''}${change} kg this week`;

    setCounter('dashCalories', p?.dailyCalories);
    setCounter('dashWater', data.water?.today || 0);

    const waterGoal = document.getElementById('dashWaterGoal');
    if (waterGoal) waterGoal.textContent = data.water?.goal || 8;

    setCounter('dashSteps', data.steps?.today || 0);
    const stepsGoal = document.getElementById('dashStepsGoal');
    if (stepsGoal) stepsGoal.textContent = data.steps?.goal || data.settings?.stepsGoal || 10000;

    const goalPct = Tracker.getGoalProgress(data);
    setCounter('dashGoalPct', goalPct);
    const goalLabel = document.getElementById('dashGoalLabel');
    if (goalLabel) {
      goalLabel.textContent = data.goals?.targetWeight
        ? `Target: ${data.goals.targetWeight} kg` : 'Set a goal in settings';
    }

    Charts.updateCircularProgress(document.getElementById('bmiCircle'), BMI.bmiToCirclePercent(p?.bmi));
    Charts.updateCircularProgress(document.getElementById('stepsCircle'), Tracker.getStepsPercent(data));

    setCounter('streakDays', data.streak?.days || 0);
    renderBadges();
    updateChallenge();
    updateWaterUI();
  }

  function setCounter(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (value == null || value === '--') {
      el.textContent = '--';
      return;
    }
    el.dataset.target = value;
    el.textContent = typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value;
  }

  /* Analytics Page */
  function initAnalyticsPage() {
    data = Storage.get();
    initShell();

    const periodSelect = document.getElementById('chartPeriod');
    const render = () => renderAnalyticsCharts(parseInt(periodSelect?.value || 30, 10));
    periodSelect?.addEventListener('change', render);
    render();
    updateAnalyticsSummary();
  }

  function renderAnalyticsCharts(days) {
    const dayKeys = Charts.getLastNDays(days);
    const labels = Charts.formatLabels(dayKeys);

    const bmiHist = data.bmiHistory || [];
    const bmiValues = dayKeys.map(d => {
      const entry = bmiHist.find(h => h.date === d);
      return entry?.bmi || null;
    });
    const filledBmi = fillNulls(bmiValues, data.profile?.bmi);
    Charts.lineChart(document.getElementById('bmiLineChart'), labels, filledBmi);

    const weightHist = data.weightHistory || [];
    const weightValues = dayKeys.map(d => {
      const entry = weightHist.find(h => h.date === d);
      return entry?.weight || null;
    });
    const filledWeight = fillNulls(weightValues, data.profile?.weightKg);
    Charts.areaChart(document.getElementById('weightAreaChart'), labels, filledWeight);

    const calValues = dayKeys.map(d => data.calorieHistory?.[d] || data.profile?.dailyCalories || 0);
    Charts.barChart(document.getElementById('calorieBarChart'), labels, calValues);

    const waterValues = dayKeys.map(d => {
      if (d === data.water?.date) return data.water.today;
      return data.water?.history?.[d] || 0;
    });
    Charts.barChart(document.getElementById('waterBarChart'), labels, waterValues, '#06B6D4');

    const goalPct = Tracker.getGoalProgress(data);
    Charts.circularChart(document.getElementById('goalCircularChart'), goalPct, 'Complete');

    const legend = document.getElementById('goalLegend');
    if (legend) {
      legend.innerHTML = `
        <div class="legend-item"><span class="legend-color" style="background:var(--primary)"></span> Goal: ${goalPct}%</div>
        <div class="legend-item"><span class="legend-color" style="background:var(--accent)"></span> Water avg: ${avgArr(waterValues).toFixed(1)}</div>
        <div class="legend-item"><span class="legend-color" style="background:var(--warning)"></span> BMI: ${data.profile?.bmi || '--'}</div>
      `;
    }

    const summary = document.getElementById('weeklySummary');
    if (summary) {
      const week = Tracker.getWeeklySummary(data);
      summary.innerHTML = week.map(d => `
        <div class="weekly-summary-item">
          <span>${d.date}</span>
          <span>💧 ${d.water} | ⚖ ${d.weight ? d.weight + 'kg' : '--'}</span>
        </div>
      `).join('');
    }
  }

  function fillNulls(arr, fallback) {
    let last = fallback || 0;
    return arr.map(v => {
      if (v != null) { last = v; return v; }
      return last;
    });
  }

  function avgArr(arr) {
    const valid = arr.filter(v => v > 0);
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  }

  function updateAnalyticsSummary() {
    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('avgBmi', data.profile?.bmi || '--');
    const change = Tracker.getWeightChange(data, 30);
    el('weightChange', `${change >= 0 ? '+' : ''}${change} kg`);
    const waterHist = Object.values(data.water?.history || {});
    const allWater = [...waterHist, data.water?.today || 0];
    el('avgWater', avgArr(allWater).toFixed(1) + ' glasses');
    el('goalCompletion', Tracker.getGoalProgress(data) + '%');
  }

  /* Reports Page */
  function initReportsPage() {
    data = Storage.get();
    initShell();

    const p = data.profile;
    const unit = data.settings?.units === 'imperial' ? 'lbs' : 'kg';

    document.getElementById('reportDate').textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    setText('rptBmi', p?.bmi || '--');
    setText('rptCategory', p?.bmi ? BMI.getCategory(p.bmi).label : '--');

    if (p?.heightCm) {
      const ideal = BMI.idealWeightRange(p.heightCm);
      setText('rptIdeal', `${ideal.min} – ${ideal.max} kg`);
    }

    if (p?.weightKg) {
      const w = unit === 'lbs' ? Math.round(BMI.kgToLbs(p.weightKg) * 10) / 10 : p.weightKg;
      setText('rptWeight', `${w} ${unit}`);
    }
    setText('rptTarget', data.goals?.targetWeight ? `${data.goals.targetWeight} kg` : '--');
    setText('rptChange', `${Tracker.getWeightChange(data, 30)} kg`);
    setText('rptCalories', p?.dailyCalories ? `${p.dailyCalories} kcal` : '--');
    setText('rptBmr', p?.bmr ? `${p.bmr} kcal` : '--');
    setText('rptWater', `${data.water?.today || 0} / ${data.water?.goal || 8} glasses`);
    setText('rptSteps', data.steps?.today || 0);
    setText('rptStreak', `${data.streak?.days || 0} days`);
    setText('rptGoal', Tracker.getGoalProgress(data) + '%');

    const hist = document.getElementById('reportWeightHistory');
    if (hist) {
      hist.innerHTML = (data.weightHistory || []).slice(0, 10).map(e =>
        `<div class="history-item"><span>${e.date}</span><span>${e.weight} kg</span></div>`
      ).join('') || '<p class="text-muted">No entries</p>';
    }

    const recs = document.getElementById('reportRecommendations');
    if (recs && p?.bmiCategory) {
      recs.innerHTML = BMI.getRecommendations(p.bmiCategory).map(r => `<li>${r}</li>`).join('');
    }

    document.getElementById('exportReport')?.addEventListener('click', exportReport);
    document.getElementById('printReport')?.addEventListener('click', () => window.print());
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function exportReport() {
    const report = {
      generated: new Date().toISOString(),
      profile: data.profile,
      weightHistory: data.weightHistory,
      water: data.water,
      steps: data.steps,
      goals: data.goals,
      streak: data.streak
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `health-report-${Storage.todayKey()}.json`;
    a.click();
    Notifications.show('Report Exported', 'Health report downloaded as JSON', 'success');
  }

  /* Settings Page */
  function initSettingsPage() {
    data = Storage.get();
    initShell();

    const s = data.settings;
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === s.theme);
      btn.addEventListener('click', () => Themes.apply(btn.dataset.theme));
    });

    document.getElementById('settingsUnits').value = s.units || 'metric';
    document.getElementById('settingsStepsGoal').value = s.stepsGoal || 10000;
    document.getElementById('settingsWaterGoal').value = s.waterGoal || 8;
    document.getElementById('settingsTargetWeight').value = data.goals?.targetWeight || '';
    document.getElementById('settingsFitnessGoal').value = data.goals?.fitnessGoal || 'maintain';

    document.getElementById('notifWater').checked = s.notifications?.water !== false;
    document.getElementById('notifWeight').checked = s.notifications?.weight !== false;
    document.getElementById('notifGoals').checked = s.notifications?.goals !== false;
    document.getElementById('notifHealth').checked = s.notifications?.health !== false;

    document.getElementById('saveSettings')?.addEventListener('click', () => {
      data.settings.units = document.getElementById('settingsUnits').value;
      data.settings.stepsGoal = parseInt(document.getElementById('settingsStepsGoal').value, 10);
      data.settings.waterGoal = parseInt(document.getElementById('settingsWaterGoal').value, 10);
      data.water.goal = data.settings.waterGoal;
      data.steps.goal = data.settings.stepsGoal;
      data.goals.targetWeight = parseFloat(document.getElementById('settingsTargetWeight').value) || null;
      data.goals.fitnessGoal = document.getElementById('settingsFitnessGoal').value;
      data.settings.notifications = {
        water: document.getElementById('notifWater').checked,
        weight: document.getElementById('notifWeight').checked,
        goals: document.getElementById('notifGoals').checked,
        health: document.getElementById('notifHealth').checked
      };
      Storage.set(data);
      Notifications.show('Settings Saved', 'Your preferences have been updated.', 'success');
    });

    document.getElementById('exportData')?.addEventListener('click', () => {
      const blob = new Blob([Storage.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'healthpulse-backup.json';
      a.click();
      Notifications.show('Data Exported', 'Backup file downloaded', 'success');
    });

    document.getElementById('importData')?.addEventListener('click', () => {
      document.getElementById('importFile')?.click();
    });

    document.getElementById('importFile')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (Storage.importJSON(reader.result)) {
          data = Storage.get();
          Notifications.show('Import Success', 'Data restored from backup', 'success');
        } else {
          Notifications.show('Import Failed', 'Invalid JSON file', 'danger');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('clearData')?.addEventListener('click', () => {
      if (confirm('Clear all health data? This cannot be undone.')) {
        data = Storage.clear();
        Notifications.show('Data Cleared', 'All local data has been removed', 'warning');
        setTimeout(() => location.reload(), 1500);
      }
    });
  }

  return { init, initShell, initDashboard, initAnalyticsPage, initReportsPage, initSettingsPage };
})();

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || Nav?.getActiveId?.();
  if (document.getElementById('chartPeriod')) App.initAnalyticsPage();
  else if (document.getElementById('reportContent')) App.initReportsPage();
  else if (document.getElementById('themePicker')) App.initSettingsPage();
  else if (page && page !== 'index' && typeof Pages !== 'undefined') Pages.init();
  else App.init();
});
