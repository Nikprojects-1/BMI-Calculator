# HealthPulse — BMI Calculator & Health Tracker

A premium, futuristic health tracking web application built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Track BMI, weight, water intake, calories, fitness goals, and more — all stored locally in your browser.

---

## Features

### BMI Calculator
- Height, weight, age, and gender inputs
- Metric (kg/cm) and Imperial (lbs/ft) unit switcher
- Instant BMI calculation with category detection
- Animated BMI gauge and progress meter
- Ideal weight range display
- Personalized health recommendations

### Health Dashboard
- Animated statistic cards with glassmorphism design
- Circular progress indicators (BMI, steps, hydration)
- Real-time dashboard updates
- Goal completion tracking

### Weight Tracking
- Add, view, and delete weight entries
- Weight trend mini-chart
- Target weight goals
- Weekly weight change analysis
- LocalStorage persistence

### Progress Charts & Analytics (`analytics.html`)
- **Line chart** — BMI progress over time
- **Area chart** — Weight trend graph
- **Bar chart** — Calorie and water intake history
- **Circular chart** — Goal completion percentage
- Weekly health summary
- Configurable date range (7 / 30 / 90 days)

### Water Intake Tracker
- Glass counter with animated water wave effect
- Circular hydration meter
- Customizable daily goal
- Reset and reminder UI

### Calorie & Fitness
- BMR (Basal Metabolic Rate) calculator
- Daily calorie estimator based on activity level
- Body fat percentage estimator
- Fitness goals: weight loss, maintain, gain, muscle

### Daily Health Tips
- Rotating tips (exercise, nutrition, sleep, hydration)
- Motivational quotes
- Auto-rotating tip slider

### Additional Premium Features
- Fitness streak tracker
- Daily mood tracker
- Workout timer
- Health achievement badges
- Weekly challenge cards
- AI-style health recommendation card
- Sleep tracking UI
- Voice assistant UI (simulated)
- Animated onboarding screens
- Fullscreen dashboard mode

### Themes
- **Dark** — Default futuristic dashboard
- **Light** — Clean light mode
- **Neon Health** — Vibrant neon accents
- **Nature Green** — Organic green palette

### Notifications
- Toast notifications for water, goals, weight, and health alerts
- Configurable in Settings

### Reports (`reports.html`)
- Printable health summary report
- Export report as JSON

### Settings (`settings.html`)
- Theme switcher
- Unit preferences
- Goal configuration
- Notification toggles
- Export / Import / Clear data

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure, forms, accessibility |
| CSS3 | Variables, Grid, Flexbox, animations, glassmorphism |
| Vanilla JavaScript | Modules, LocalStorage, Canvas charts, Intersection Observer |
| Google Fonts | Inter & Space Grotesk typography |
| Canvas API | Custom charts (no external chart libraries) |

---

## All Pages (35 Total)

| # | Page | Description |
|---|------|-------------|
| 1 | `index.html` | Main health dashboard |
| 2 | `analytics.html` | Charts & health analytics |
| 3 | `reports.html` | Health report export & print |
| 4 | `settings.html` | Themes, goals, data management |
| 5 | `bmi-calculator.html` | Dedicated BMI calculator |
| 6 | `weight-tracker.html` | Weight logging & chart |
| 7 | `water-tracker.html` | Hydration tracker |
| 8 | `calorie-calculator.html` | BMR & calorie estimates |
| 9 | `body-fat.html` | Body fat estimator |
| 10 | `fitness-goals.html` | Goal setting & progress |
| 11 | `workout-plans.html` | Workout program library |
| 12 | `exercise-library.html` | Exercise reference |
| 13 | `meal-planner.html` | Daily meal planning |
| 14 | `nutrition-guide.html` | Nutrition fundamentals |
| 15 | `sleep-tracker.html` | Sleep logging |
| 16 | `mood-journal.html` | Daily mood tracking |
| 17 | `health-tips.html` | Rotating wellness tips |
| 18 | `achievements.html` | Badges & milestones |
| 19 | `challenges.html` | Weekly fitness challenges |
| 20 | `heart-rate.html` | Heart rate log |
| 21 | `blood-pressure.html` | Blood pressure log |
| 22 | `medications.html` | Medication reminders |
| 23 | `appointments.html` | Health appointments |
| 24 | `profile.html` | Health profile overview |
| 25 | `activity-log.html` | Full activity history |
| 26 | `step-counter.html` | Daily step tracking |
| 27 | `workout-timer.html` | Workout stopwatch |
| 28 | `progress-gallery.html` | Progress notes gallery |
| 29 | `health-score.html` | Overall wellness score |
| 30 | `weekly-summary.html` | 7-day health summary |
| 31 | `monthly-report.html` | 30-day overview |
| 32 | `data-export.html` | Data backup center |
| 33 | `notifications-center.html` | Alerts & reminders |
| 34 | `help.html` | Help & FAQ |
| 35 | `privacy.html` | Privacy information |

All pages share a unified sidebar navigation (via `js/nav.js`) with grouped menu sections.

---

## Folder Structure

```
BMI Calculator/
├── index.html              # Main dashboard
├── analytics.html          # Charts & analytics
├── reports.html            # Reports
├── settings.html           # Settings
├── [31 additional .html pages — see table above]
├── README.md
├── css/
│   ├── style.css
│   ├── themes.css
│   └── responsive.css
├── js/
│   ├── app.js              # Main controller
│   ├── nav.js              # Shared sidebar navigation
│   ├── pages.js            # Per-page initialization
│   ├── bmi.js
│   ├── charts.js
│   ├── tracker.js
│   ├── themes.js
│   ├── storage.js
│   └── notifications.js
├── scripts/
│   └── generate-pages.js   # Page generator utility
└── assets/
    └── images/
```

---

## How to Run the Project in VS Code

### Step 1: Install Visual Studio Code

1. Download VS Code from [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Run the installer and follow the setup wizard
3. Launch VS Code

### Step 2: Open the Project Folder

1. Open VS Code
2. Go to **File → Open Folder**
3. Select the `BMI Calculator` project folder
4. Click **Select Folder**

### Step 3: Install Live Server Extension

1. Click the **Extensions** icon in the left sidebar (or press `Ctrl+Shift+X`)
2. Search for **Live Server**
3. Install **Live Server** by Ritwick Dey

### Step 4: Launch the Application

1. In the Explorer panel, locate `index.html`
2. **Right-click** on `index.html`
3. Click **"Open with Live Server"**
4. Your default browser will open at `http://127.0.0.1:5500` (or similar port)

### Alternative: Open Without Live Server

You can also open `index.html` directly in a browser, but some features work best with a local server. Double-click `index.html` or drag it into your browser.

---

## Usage Guide

1. **First visit** — Complete the onboarding slides or click Skip
2. **Calculate BMI** — Enter height, weight, age, select gender, then click **Calculate BMI**
3. **Log weight** — Use the Weight Tracking section to add daily entries
4. **Track water** — Click **+ Add Glass** to increment your hydration count
5. **Add steps** — Enter steps in the Step Counter section
6. **View analytics** — Navigate to **Analytics** for full charts
7. **Export data** — Use **Reports** or **Settings → Export JSON** to backup data
8. **Change theme** — Use the quick theme dots in the header or visit **Settings**

---

## Theme Customization

Themes are defined in `css/themes.css` using CSS custom properties:

```css
[data-theme="dark"] {
  --bg-primary: #0F172A;
  --primary: #10B981;
  --accent: #06B6D4;
}
```

To create a custom theme:

1. Add a new `[data-theme="yourtheme"]` block in `themes.css`
2. Add the theme name to `THEMES` array in `js/themes.js`
3. Add a theme button in `settings.html`

---

## Local Storage System

All data is stored under the key `healthpulse_data` in `localStorage`:

| Data | Description |
|------|-------------|
| `profile` | BMI, height, weight, BMR, calories |
| `weightHistory` | Array of weight log entries |
| `bmiHistory` | BMI values over time |
| `water` | Daily water count and history |
| `steps` | Daily step count |
| `goals` | Target weight and fitness goal |
| `settings` | Theme, units, notifications |
| `streak` | Activity streak data |
| `achievements` | Unlocked badge IDs |

Use **Settings → Export JSON** to backup and **Import JSON** to restore.

---

## Charts & Analytics

Charts are rendered with the HTML5 Canvas API in `js/charts.js`:

- **Line chart** — Connected points with gradient fill
- **Area chart** — Same as line with filled area
- **Bar chart** — Vertical bars with gradient
- **Circular chart** — SVG-style progress ring on canvas

Charts automatically resize and use theme CSS variables for colors.

---

## Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome 90+ | ✅ |
| Firefox 88+ | ✅ |
| Safari 14+ | ✅ |
| Edge 90+ | ✅ |

Requires: LocalStorage, CSS Grid, Intersection Observer, Canvas 2D

---

## Performance Optimization

- Efficient DOM updates (targeted element refresh)
- Debounced chart rendering on resize
- CSS `will-change` avoided; GPU-friendly transforms used
- Intersection Observer for scroll reveal (no scroll listeners)
- `prefers-reduced-motion` respected in `responsive.css`
- Canvas charts use device pixel ratio for sharp rendering

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Live Server won't start | Ensure port 5500 is free; try another port in Live Server settings |
| Data not saving | Check browser privacy settings; disable "Block third-party cookies" for localhost |
| Charts appear blank | Log some weight/BMI data first; refresh the analytics page |
| Styles look broken | Confirm `css/` folder paths are correct; hard-refresh with `Ctrl+Shift+R` |
| Fonts not loading | Ensure internet connection for Google Fonts CDN |

---

## License

This project is provided as-is for educational and portfolio use. No personal information or third-party branding is included.

---

## Credits

Built with modern web standards. Inspired by health dashboard UX patterns from leading fitness applications.
