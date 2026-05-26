const fs = require('fs');
const path = require('path');

const pages = [
  { id: 'bmi-calculator', title: 'BMI Calculator', subtitle: 'Calculate body mass index and health metrics', body: 'bmi' },
  { id: 'weight-tracker', title: 'Weight Tracker', subtitle: 'Log and monitor your weight over time', body: 'weight' },
  { id: 'water-tracker', title: 'Water Tracker', subtitle: 'Track daily hydration goals', body: 'water' },
  { id: 'calorie-calculator', title: 'Calorie Calculator', subtitle: 'BMR and daily calorie estimates', body: 'calorie' },
  { id: 'body-fat', title: 'Body Fat Estimator', subtitle: 'Estimated body fat percentage', body: 'bodyfat' },
  { id: 'fitness-goals', title: 'Fitness Goals', subtitle: 'Set and track your health targets', body: 'goals' },
  { id: 'workout-plans', title: 'Workout Plans', subtitle: 'Structured training programs', body: 'workouts' },
  { id: 'exercise-library', title: 'Exercise Library', subtitle: 'Browse exercises by muscle group', body: 'exercises' },
  { id: 'meal-planner', title: 'Meal Planner', subtitle: 'Plan balanced daily meals', body: 'meals' },
  { id: 'nutrition-guide', title: 'Nutrition Guide', subtitle: 'Healthy eating fundamentals', body: 'nutrition' },
  { id: 'sleep-tracker', title: 'Sleep Tracker', subtitle: 'Monitor sleep duration and quality', body: 'sleep' },
  { id: 'mood-journal', title: 'Mood Journal', subtitle: 'Track your daily emotional wellness', body: 'mood' },
  { id: 'health-tips', title: 'Health Tips', subtitle: 'Daily wellness advice and motivation', body: 'tips' },
  { id: 'achievements', title: 'Achievements', subtitle: 'Unlock health milestones and badges', body: 'achievements' },
  { id: 'challenges', title: 'Challenges', subtitle: 'Weekly fitness challenges', body: 'challenges' },
  { id: 'heart-rate', title: 'Heart Rate', subtitle: 'Log resting and active heart rate', body: 'heartrate' },
  { id: 'blood-pressure', title: 'Blood Pressure', subtitle: 'Track blood pressure readings', body: 'bp' },
  { id: 'medications', title: 'Medications', subtitle: 'Medication schedule and reminders', body: 'meds' },
  { id: 'appointments', title: 'Appointments', subtitle: 'Health appointment scheduler', body: 'appts' },
  { id: 'profile', title: 'Health Profile', subtitle: 'Your health overview', body: 'profile' },
  { id: 'activity-log', title: 'Activity Log', subtitle: 'Complete history of health activities', body: 'activity' },
  { id: 'step-counter', title: 'Step Counter', subtitle: 'Track daily steps and movement', body: 'steps' },
  { id: 'workout-timer', title: 'Workout Timer', subtitle: 'Interval and workout timing', body: 'timer' },
  { id: 'progress-gallery', title: 'Progress Gallery', subtitle: 'Document your fitness journey', body: 'gallery' },
  { id: 'health-score', title: 'Health Score', subtitle: 'Overall wellness rating', body: 'score' },
  { id: 'weekly-summary', title: 'Weekly Summary', subtitle: 'Your week in review', body: 'weekly' },
  { id: 'monthly-report', title: 'Monthly Report', subtitle: '30-day health overview', body: 'monthly' },
  { id: 'data-export', title: 'Data Export', subtitle: 'Backup and export your health data', body: 'export' },
  { id: 'notifications-center', title: 'Notifications', subtitle: 'Alerts and reminders center', body: 'notif' },
  { id: 'help', title: 'Help & FAQ', subtitle: 'How to use HealthPulse', body: 'help' },
  { id: 'privacy', title: 'Privacy', subtitle: 'Data and privacy information', body: 'privacy' }
];

function bodyContent(type) {
  const bodies = {
    bmi: `<section class="section reveal"><div class="bmi-grid">
      <div class="card glass"><form id="bmiForm" class="bmi-form">
        <div class="form-row"><div class="form-group"><label>Height (cm)</label><input type="number" id="heightCm" placeholder="170"></div>
        <div class="form-group"><label>Weight (kg)</label><input type="number" id="weight" placeholder="70"></div></div>
        <div class="form-row"><div class="form-group"><label>Age</label><input type="number" id="age" placeholder="25"></div>
        <div class="form-group"><label>Gender</label><div class="gender-select">
          <button type="button" class="gender-btn active" data-gender="male">Male</button>
          <button type="button" class="gender-btn" data-gender="female">Female</button></div></div></div>
        <div class="form-group"><label>Activity</label><select id="activity"><option value="1.2">Sedentary</option><option value="1.55" selected>Moderate</option><option value="1.9">Athlete</option></select></div>
        <div class="form-group"><label>Goal</label><select id="fitnessGoal"><option value="loss">Loss</option><option value="maintain" selected>Maintain</option><option value="gain">Gain</option></select></div>
        <button type="submit" class="btn btn-primary btn-glow">Calculate BMI</button>
      </form></div>
      <div class="card glass bmi-result-card"><div class="bmi-score-display"><span class="bmi-number" id="bmiScore">--</span><span class="bmi-label">BMI</span></div>
      <div class="category-badge" id="categoryBadge">Enter details</div><p class="health-message" id="healthMessage">Fill in your details to calculate BMI.</p></div></div></section>`,
    weight: `<section class="section reveal"><div class="card glass"><form id="weightForm" class="inline-form">
      <input type="number" id="logWeight" placeholder="Weight kg" step="0.1" required><input type="date" id="logDate" required>
      <button type="submit" class="btn btn-primary">Add Entry</button></form>
      <canvas id="weightPageChart" height="200" class="page-chart"></canvas></div>
      <div id="weightList" class="list-grid"></div></section>`,
    water: `<section class="section reveal"><div class="water-grid"><div class="card glass water-card">
      <div class="water-wave-container"><div class="water-wave" id="waterPageWave"></div>
      <div class="water-circle-content"><span class="water-count" id="waterPageCount">0</span><span class="water-label">/ <span id="waterPageGoal">8</span> glasses</span></div></div>
      <div class="water-controls"><button class="btn btn-water" id="addWaterBtn">+ Glass</button>
      <button class="btn btn-secondary" id="removeWaterBtn">−</button><button class="btn btn-ghost" id="resetWaterBtn">Reset</button></div></div>
      <div class="card glass"><div class="circular-progress large" id="waterPageCircle"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="45"/><circle class="fill water-fill" cx="50" cy="50" r="45"/></svg>
      <span class="circle-text" id="waterPagePct">0%</span></div></div></div></section>`,
    calorie: `<section class="stats-grid reveal"><div class="stat-card glass"><span class="stat-label">BMR</span><span class="stat-value" id="pageBmr">--</span></div>
      <div class="stat-card glass"><span class="stat-label">Daily Calories</span><span class="stat-value" id="pageCalories">--</span></div>
      <div class="stat-card glass"><span class="stat-label">Body Fat</span><span class="stat-value" id="pageBodyFat">--</span></div></section>
      <p class="text-muted page-note">Calculate BMI on the BMI Calculator page to populate these values.</p>`,
    bodyfat: `<section class="section reveal"><div class="card glass page-hero"><span class="hero-value" id="bfValue">--</span><p>Estimated Body Fat %</p>
      <p class="text-muted">Based on BMI: <span id="bfBmi">--</span></p></div></section>`,
    goals: `<section class="section reveal"><div class="card glass"><div class="setting-row"><label>Target Weight (kg)</label><input type="number" id="goalTarget" step="0.1"></div>
      <div class="setting-row"><label>Fitness Goal</label><select id="goalFitness"><option value="loss">Weight Loss</option><option value="maintain">Maintain</option><option value="gain">Gain</option><option value="muscle">Muscle</option></select></div>
      <button class="btn btn-primary" id="saveGoalsBtn">Save Goals</button>
      <p class="page-stat">Progress: <strong id="goalProgressPct">0%</strong></p></div></section>`,
    sleep: `<section class="section reveal"><div class="card glass"><form id="sleepForm" class="inline-form">
      <input type="number" id="sleepInput" placeholder="Hours" min="0" max="24" step="0.5" required>
      <button type="submit" class="btn btn-primary">Log Sleep</button></form>
      <p>Average: <strong id="sleepAvgDisplay">--</strong> hours</p></div><div id="sleepHistory" class="list-grid"></div></section>`,
    mood: `<section class="section reveal"><div class="card glass"><p id="moodToday">How are you feeling?</p>
      <div class="mood-picker"><button class="mood-btn" data-mood="great">😄</button><button class="mood-btn" data-mood="good">🙂</button>
      <button class="mood-btn" data-mood="okay">😐</button><button class="mood-btn" data-mood="low">😔</button><button class="mood-btn" data-mood="bad">😢</button></div></div></section>`,
    tips: `<section class="section reveal"><div class="card glass tip-card"><span class="tip-category" id="tipPageCategory">—</span>
      <p class="tip-text" id="tipPageText">—</p><blockquote class="tip-quote" id="tipPageQuote">—</blockquote>
      <button class="btn btn-secondary" id="nextTipBtn">New Tip</button></div></section>`,
    achievements: `<section class="section reveal"><div id="achievementsGrid" class="achievements-grid"></div></section>`,
    challenges: `<section class="section reveal"><div class="card glass"><h3>Walk 50,000 Steps This Week</h3>
      <div class="challenge-progress"><div class="challenge-fill" id="challengeBar"></div></div>
      <p><strong id="challengePercent">0%</strong> complete</p></div></section>`,
    heartrate: `<section class="section reveal"><div class="card glass"><form id="hrForm" class="inline-form">
      <input type="number" id="hrBpm" placeholder="BPM" min="30" max="220" required><button type="submit" class="btn btn-primary">Log</button></form></div>
      <div id="vitalsList" class="list-grid"></div></section>`,
    bp: `<section class="section reveal"><div class="card glass"><form id="bpForm" class="inline-form">
      <input type="number" id="bpSys" placeholder="Systolic" required><input type="number" id="bpDia" placeholder="Diastolic" required>
      <button type="submit" class="btn btn-primary">Log</button></form></div><div id="vitalsList" class="list-grid"></div></section>`,
    meds: `<section class="section reveal"><div class="card glass"><form id="medForm" class="bmi-form">
      <input type="text" id="medName" placeholder="Medication name" required><input type="text" id="medDose" placeholder="Dose">
      <input type="time" id="medTime"><button type="submit" class="btn btn-primary">Add</button></form></div><div id="medList" class="list-grid"></div></section>`,
    appts: `<section class="section reveal"><div class="card glass"><form id="apptForm" class="bmi-form">
      <input type="text" id="apptTitle" placeholder="Appointment title" required><input type="date" id="apptDate" required>
      <textarea id="apptNotes" placeholder="Notes" rows="2"></textarea><button type="submit" class="btn btn-primary">Add</button></form></div><div id="apptList" class="list-grid"></div></section>`,
    profile: `<section class="stats-grid reveal"><div class="stat-card glass"><span class="stat-label">BMI</span><span class="stat-value" id="profileBmi">--</span></div>
      <div class="stat-card glass"><span class="stat-label">Weight</span><span class="stat-value" id="profileWeight">--</span></div>
      <div class="stat-card glass"><span class="stat-label">Height</span><span class="stat-value" id="profileHeight">--</span></div>
      <div class="stat-card glass"><span class="stat-label">Age</span><span class="stat-value" id="profileAge">--</span></div>
      <div class="stat-card glass"><span class="stat-label">Streak</span><span class="stat-value" id="profileStreak">--</span></div></section>`,
    activity: `<section class="section reveal"><div id="activityList" class="list-grid"></div></section>`,
    steps: `<section class="section reveal"><div class="card glass page-hero"><span class="hero-value" id="stepsPageCount">0</span><p>Steps today (goal: <span id="stepsPageGoal">10000</span>)</p>
      <div class="inline-form"><input type="number" id="stepsPageInput" placeholder="Add steps"><button class="btn btn-primary" id="addStepsBtn">Add</button></div></div></section>`,
    timer: `<section class="section reveal"><div class="card glass"><div class="timer-display" id="timerPageDisplay">00:00</div>
      <div class="timer-controls"><button class="btn btn-primary" id="timerPageStart">Start</button>
      <button class="btn btn-secondary" id="timerPagePause">Pause</button><button class="btn btn-ghost" id="timerPageReset">Reset</button></div></div></section>`,
    gallery: `<section class="section reveal"><div class="card glass"><form id="galleryForm"><textarea id="galleryNote" placeholder="Add a progress note..." rows="3"></textarea>
      <button type="submit" class="btn btn-primary" style="margin-top:0.75rem">Save Note</button></form></div>
      <div id="galleryList" class="gallery-grid"></div></section>`,
    score: `<section class="section reveal"><div class="card glass" style="text-align:center"><div class="circular-progress large" id="healthScoreCircle">
      <svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="45"/><circle class="fill" cx="50" cy="50" r="45"/></svg>
      <span class="circle-text" id="healthScoreValue">--</span></div><p class="text-muted">Overall wellness score based on your tracked data</p></div></section>`,
    weekly: `<section class="section reveal"><div id="weeklyList" class="list-grid"></div></section>`,
    monthly: `<section class="stats-grid reveal"><div class="stat-card glass"><span class="stat-label">BMI</span><span class="stat-value" id="monthBmi">--</span></div>
      <div class="stat-card glass"><span class="stat-label">Weight</span><span class="stat-value" id="monthWeight">--</span></div>
      <div class="stat-card glass"><span class="stat-label">30d Change</span><span class="stat-value" id="monthChange">--</span></div>
      <div class="stat-card glass"><span class="stat-label">Streak</span><span class="stat-value" id="monthStreak">--</span></div></section>`,
    export: `<section class="section reveal"><div class="card glass"><p>Export all locally stored health data as JSON.</p>
      <button class="btn btn-primary" id="exportJsonBtn">Download Backup</button>
      <p class="text-muted" style="margin-top:1rem">Import data from Settings page.</p></div></section>`,
    notif: `<section class="section reveal"><div id="notifHistory" class="list-grid"></div></section>`,
    help: `<section class="section reveal"><div class="card glass faq-card"><h3>How do I calculate BMI?</h3><p>Go to BMI Calculator, enter height, weight, age, and tap Calculate.</p></div>
      <div class="card glass faq-card"><h3>Where is my data stored?</h3><p>All data is stored locally in your browser via LocalStorage.</p></div>
      <div class="card glass faq-card"><h3>How do I change themes?</h3><p>Use Settings or the theme dots in the header.</p></div>
      <div class="card glass faq-card"><h3>How do I export data?</h3><p>Visit Data Export or Settings → Export JSON.</p></div></section>`,
    privacy: `<section class="section reveal"><div class="card glass"><h3>Local Data Only</h3><p>HealthPulse stores all data in your browser. Nothing is sent to external servers.</p>
      <h3 style="margin-top:1rem">No Personal Branding</h3><p>This app does not collect personal identifiers or third-party branding.</p>
      <h3 style="margin-top:1rem">Clear Data</h3><p>You can delete all data anytime from Settings → Clear All Data.</p></div></section>`,
    workouts: `<section class="section reveal"><div class="content-grid">
      <div class="card glass content-card"><h3>Beginner Full Body</h3><p>3 days/week — Squats, push-ups, planks, walking</p><span class="tag">Beginner</span></div>
      <div class="card glass content-card"><h3>HIIT Cardio</h3><p>20 min sessions — Burpees, jumping jacks, mountain climbers</p><span class="tag">Intermediate</span></div>
      <div class="card glass content-card"><h3>Strength Builder</h3><p>4 days/week — Progressive overload focus</p><span class="tag">Advanced</span></div></div></section>`,
    exercises: `<section class="section reveal"><div class="content-grid">
      <div class="card glass content-card"><h3>🏃 Cardio</h3><p>Running, cycling, swimming, jump rope</p></div>
      <div class="card glass content-card"><h3>💪 Upper Body</h3><p>Push-ups, pull-ups, rows, presses</p></div>
      <div class="card glass content-card"><h3>🦵 Lower Body</h3><p>Squats, lunges, deadlifts, calf raises</p></div>
      <div class="card glass content-card"><h3>🧘 Flexibility</h3><p>Stretching, yoga, mobility drills</p></div></div></section>`,
    meals: `<section class="section reveal"><div class="card glass"><h3>Sample Day Plan</h3>
      <div class="meal-row"><span>Breakfast</span><span>Oatmeal, berries, protein</span></div>
      <div class="meal-row"><span>Lunch</span><span>Grilled chicken, salad, quinoa</span></div>
      <div class="meal-row"><span>Dinner</span><span>Salmon, vegetables, brown rice</span></div>
      <div class="meal-row"><span>Snacks</span><span>Nuts, yogurt, fruit</span></div></div></section>`,
    nutrition: `<section class="section reveal"><div class="content-grid">
      <div class="card glass content-card"><h3>Protein</h3><p>Essential for muscle repair. Aim for lean sources.</p></div>
      <div class="card glass content-card"><h3>Carbohydrates</h3><p>Primary energy source. Prefer complex carbs.</p></div>
      <div class="card glass content-card"><h3>Fats</h3><p>Healthy fats support hormones and brain health.</p></div>
      <div class="card glass content-card"><h3>Hydration</h3><p>8+ glasses of water daily for optimal function.</p></div></div></section>`
  };
  return bodies[type] || '<section class="section reveal"><div class="card glass"><p>Content loading...</p></div></section>';
}

function scriptsFor(id) {
  const base = `  <script src="js/storage.js"><\/script>
  <script src="js/themes.js"><\/script>
  <script src="js/notifications.js"><\/script>
  <script src="js/nav.js"><\/script>`;
  const extra = ['bmi-calculator', 'weight-tracker', 'calorie-calculator', 'body-fat'].includes(id)
    ? `  <script src="js/bmi.js"><\/script>
  <script src="js/charts.js"><\/script>
  <script src="js/tracker.js"><\/script>
  <script src="js/app.js"><\/script>
  <script src="js/pages.js"><\/script>`
    : `  <script src="js/bmi.js"><\/script>
  <script src="js/charts.js"><\/script>
  <script src="js/tracker.js"><\/script>
  <script src="js/app.js"><\/script>
  <script src="js/pages.js"><\/script>`;
  return base + '\n' + extra;
}

function buildPage(p) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title} | HealthPulse</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/themes.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body data-page="${p.id}">
  <div class="particles" id="particles" aria-hidden="true"></div>
  <nav class="sidebar" id="sidebar" data-active="${p.id}"></nav>
  <main class="main-content">
    <header class="top-bar glass">
      <div class="top-bar-left">
        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">☰</button>
        <h1 class="page-title">${p.title}</h1>
        <p class="page-subtitle">${p.subtitle}</p>
      </div>
      <div class="top-bar-right">
        <div class="theme-quick" id="themeQuick"></div>
      </div>
    </header>
    ${bodyContent(p.body)}
  </main>
  <div class="toast-container" id="toastContainer"></div>
${scriptsFor(p.id)}
</body>
</html>`;
}

const root = path.join(__dirname, '..');
pages.forEach(p => {
  fs.writeFileSync(path.join(root, `${p.id}.html`), buildPage(p));
  console.log('Created', p.id + '.html');
});
console.log('Total new pages:', pages.length);
