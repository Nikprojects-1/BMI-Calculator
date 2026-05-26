/**
 * Health tracking: weight, water, steps, tips, streaks
 */
const Tracker = (() => {
  const TIPS = [
    { category: 'Exercise', text: 'Aim for at least 30 minutes of moderate activity most days of the week.', quote: 'The only bad workout is the one that didn\'t happen.' },
    { category: 'Nutrition', text: 'Fill half your plate with vegetables and fruits for balanced nutrition.', quote: 'Let food be thy medicine.' },
    { category: 'Sleep', text: 'Maintain a consistent sleep schedule — 7 to 9 hours is ideal for most adults.', quote: 'Sleep is the best meditation.' },
    { category: 'Hydration', text: 'Drink a glass of water first thing in the morning to kickstart hydration.', quote: 'Water is life\'s matter and matrix.' },
    { category: 'Fitness', text: 'Mix cardio and strength training for optimal health and body composition.', quote: 'Strength does not come from physical capacity alone.' },
    { category: 'Mental Health', text: 'Take short breaks during work to reduce stress and improve focus.', quote: 'Almost everything will work again if you unplug it for a few minutes.' },
    { category: 'Walking', text: 'Take the stairs instead of the elevator — small choices add up.', quote: 'Walking is man\'s best medicine.' },
    { category: 'Recovery', text: 'Allow rest days for muscle recovery and injury prevention.', quote: 'Rest when you\'re weary. Refresh and renew yourself.' }
  ];

  const ACHIEVEMENTS = [
    { id: 'first_bmi', name: '🎯 First BMI', desc: 'Calculated your first BMI' },
    { id: 'water_8', name: '💧 Hydrated', desc: 'Drank 8 glasses in a day' },
    { id: 'streak_7', name: '🔥 Week Warrior', desc: '7-day activity streak' },
    { id: 'weight_5', name: '📊 Tracker', desc: 'Logged 5 weight entries' },
    { id: 'steps_10k', name: '👟 Step Master', desc: 'Hit 10,000 steps' },
    { id: 'sleep_week', name: '😴 Sleep Pro', desc: 'Logged sleep 7 days' }
  ];

  function addWeight(data, weightKg, date) {
    const entry = { weight: weightKg, date: date || Storage.todayKey(), id: Date.now() };
    data.weightHistory = data.weightHistory || [];
    data.weightHistory.unshift(entry);
    data.weightHistory = data.weightHistory.slice(0, 100);
    if (data.profile) data.profile.weightKg = weightKg;
    return data;
  }

  function removeWeight(data, id) {
    data.weightHistory = (data.weightHistory || []).filter(e => e.id !== id);
    return data;
  }

  function getWeightChange(data, days = 7) {
    const history = data.weightHistory || [];
    if (history.length < 2) return 0;
    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sorted[0]?.weight;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const old = sorted.find(e => new Date(e.date) <= cutoff);
    if (!old || !latest) return 0;
    return Math.round((latest - old.weight) * 10) / 10;
  }

  function addWater(data) {
    data = Storage.resetDailyIfNeeded(data);
    data.water.today = Math.min((data.water.today || 0) + 1, 30);
    data.water.date = Storage.todayKey();
    return data;
  }

  function removeWater(data) {
    data = Storage.resetDailyIfNeeded(data);
    data.water.today = Math.max((data.water.today || 0) - 1, 0);
    return data;
  }

  function resetWater(data) {
    data = Storage.resetDailyIfNeeded(data);
    if (data.water.today > 0) {
      data.water.history[Storage.todayKey()] = data.water.today;
    }
    data.water.today = 0;
    return data;
  }

  function getWaterPercent(data) {
    const goal = data.water?.goal || data.settings?.waterGoal || 8;
    const today = data.water?.today || 0;
    return Math.min(100, (today / goal) * 100);
  }

  function addSteps(data, steps) {
    data = Storage.resetDailyIfNeeded(data);
    data.steps.today = Math.min((data.steps.today || 0) + steps, 100000);
    data.steps.date = Storage.todayKey();
    return data;
  }

  function resetSteps(data) {
    data.steps.today = 0;
    data.steps.date = Storage.todayKey();
    return data;
  }

  function getStepsPercent(data) {
    const goal = data.steps?.goal || data.settings?.stepsGoal || 10000;
    return Math.min(100, ((data.steps?.today || 0) / goal) * 100);
  }

  function logStreak(data) {
    const today = Storage.todayKey();
    if (data.streak.lastLog === today) return data;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split('T')[0];
    if (data.streak.lastLog === yKey) {
      data.streak.days = (data.streak.days || 0) + 1;
    } else {
      data.streak.days = 1;
    }
    data.streak.lastLog = today;
    return data;
  }

  function setMood(data, mood) {
    data = Storage.resetDailyIfNeeded(data);
    data.mood.today = mood;
    data.mood.date = Storage.todayKey();
    data.mood.history[Storage.todayKey()] = mood;
    return data;
  }

  function logSleep(data, hours) {
    data.sleep.history = data.sleep.history || [];
    data.sleep.history.unshift({ hours, date: Storage.todayKey() });
    data.sleep.history = data.sleep.history.slice(0, 30);
    return data;
  }

  function getSleepAvg(data) {
    const hist = data.sleep?.history || [];
    if (!hist.length) return null;
    const sum = hist.reduce((a, b) => a + b.hours, 0);
    return Math.round((sum / hist.length) * 10) / 10;
  }

  function getRandomTip() {
    return TIPS[Math.floor(Math.random() * TIPS.length)];
  }

  function getGoalProgress(data) {
    const target = data.goals?.targetWeight;
    const current = data.profile?.weightKg;
    if (!target || !current) return 0;
    const start = data.weightHistory?.[data.weightHistory.length - 1]?.weight || current;
    const total = Math.abs(start - target);
    if (total === 0) return 100;
    const progress = Math.abs(start - current) / total * 100;
    return Math.min(100, Math.round(progress));
  }

  function checkAchievements(data) {
    const earned = new Set(data.achievements || []);
    if (data.profile?.bmi) earned.add('first_bmi');
    if (data.water?.today >= 8) earned.add('water_8');
    if (data.streak?.days >= 7) earned.add('streak_7');
    if ((data.weightHistory?.length || 0) >= 5) earned.add('weight_5');
    if (data.steps?.today >= 10000) earned.add('steps_10k');
    if ((data.sleep?.history?.length || 0) >= 7) earned.add('sleep_week');
    data.achievements = [...earned];
    return data;
  }

  function getAchievementList(data) {
    const earned = new Set(data.achievements || []);
    return ACHIEVEMENTS.map(a => ({ ...a, unlocked: earned.has(a.id) }));
  }

  function getWeeklySummary(data) {
    const days = Charts.getLastNDays(7);
    const summary = [];
    days.forEach(d => {
      const water = d === data.water?.date ? data.water.today : (data.water?.history?.[d] || 0);
      const weight = data.weightHistory?.find(w => w.date === d);
      summary.push({
        date: d,
        water,
        weight: weight?.weight || null,
        label: d.slice(5)
      });
    });
    return summary;
  }

  function getChallengeProgress(data) {
    const weekSteps = (data.steps?.today || 0);
    const target = 50000;
    return Math.min(100, Math.round((weekSteps / target) * 100));
  }

  return {
    TIPS,
    ACHIEVEMENTS,
    addWeight,
    removeWeight,
    getWeightChange,
    addWater,
    removeWater,
    resetWater,
    getWaterPercent,
    addSteps,
    resetSteps,
    getStepsPercent,
    logStreak,
    setMood,
    logSleep,
    getSleepAvg,
    getRandomTip,
    getGoalProgress,
    checkAchievements,
    getAchievementList,
    getWeeklySummary,
    getChallengeProgress
  };
})();
