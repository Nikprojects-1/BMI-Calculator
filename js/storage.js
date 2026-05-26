/**
 * LocalStorage persistence layer
 */
const Storage = (() => {
  const KEY = 'healthpulse_data';

  const defaults = {
    profile: {
      heightCm: null,
      weightKg: null,
      age: null,
      gender: 'male',
      unit: 'metric',
      bmi: null,
      bmiCategory: null,
      bmr: null,
      dailyCalories: null,
      bodyFat: null
    },
    weightHistory: [],
    bmiHistory: [],
    water: { today: 0, date: null, goal: 8, history: {} },
    steps: { today: 0, date: null, goal: 10000 },
    goals: { targetWeight: null, fitnessGoal: 'maintain' },
    settings: {
      theme: 'dark',
      units: 'metric',
      stepsGoal: 10000,
      waterGoal: 8,
      notifications: {
        water: true,
        weight: true,
        goals: true,
        health: true
      }
    },
    streak: { days: 0, lastLog: null },
    mood: { today: null, date: null, history: {} },
    sleep: { history: [] },
    achievements: [],
    challenge: { progress: 0 },
    onboardingComplete: false,
    calorieHistory: {},
    vitals: { heartRate: [], bloodPressure: [] },
    medications: [],
    appointments: [],
    gallery: []
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(defaults);
      const data = JSON.parse(raw);
      return deepMerge(structuredClone(defaults), data);
    } catch {
      return structuredClone(defaults);
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  function get() {
    return load();
  }

  function set(data) {
    return save(data);
  }

  function update(path, value) {
    const data = load();
    const keys = path.split('.');
    let obj = data;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = obj[keys[i]] || {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    save(data);
    return data;
  }

  function clear() {
    localStorage.removeItem(KEY);
    return structuredClone(defaults);
  }

  function exportJSON() {
    return JSON.stringify(load(), null, 2);
  }

  function importJSON(json) {
    try {
      const data = JSON.parse(json);
      save(deepMerge(structuredClone(defaults), data));
      return true;
    } catch {
      return false;
    }
  }

  function todayKey() {
    return new Date().toISOString().split('T')[0];
  }

  function resetDailyIfNeeded(data) {
    const today = todayKey();
    if (data.water.date !== today) {
      if (data.water.date && data.water.today > 0) {
        data.water.history[data.water.date] = data.water.today;
      }
      data.water.today = 0;
      data.water.date = today;
    }
    if (data.steps.date !== today) {
      data.steps.today = 0;
      data.steps.date = today;
    }
    if (data.mood.date !== today) {
      if (data.mood.today) data.mood.history[data.mood.date] = data.mood.today;
      data.mood.today = null;
      data.mood.date = today;
    }
    return data;
  }

  return { get, set, update, clear, exportJSON, importJSON, todayKey, resetDailyIfNeeded, defaults };
})();
