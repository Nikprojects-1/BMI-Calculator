/**
 * Canvas chart rendering (line, bar, area, circular)
 */
const Charts = (() => {
  function getColors() {
    const style = getComputedStyle(document.documentElement);
    return {
      primary: style.getPropertyValue('--primary').trim() || '#10B981',
      accent: style.getPropertyValue('--accent').trim() || '#06B6D4',
      warning: style.getPropertyValue('--warning').trim() || '#F59E0B',
      danger: style.getPropertyValue('--danger').trim() || '#EF4444',
      text: style.getPropertyValue('--text-secondary').trim() || '#94A3B8',
      grid: 'rgba(148, 163, 184, 0.1)'
    };
  }

  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.parentElement?.clientWidth || 400;
    const h = parseInt(canvas.getAttribute('height'), 10) || 280;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, w, h };
  }

  function drawGrid(ctx, w, h, padding) {
    const colors = getColors();
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const y = padding.top + ((h - padding.top - padding.bottom) / steps) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }
  }

  function lineChart(canvas, labels, values, options = {}) {
    if (!canvas || !values?.length) return;
    const { ctx, w, h } = setupCanvas(canvas);
    const colors = getColors();
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);
    drawGrid(ctx, w, h, padding);

    const max = Math.max(...values, 1) * 1.1;
    const min = Math.min(...values, 0) * 0.9;
    const range = max - min || 1;

    const points = values.map((v, i) => ({
      x: padding.left + (i / Math.max(values.length - 1, 1)) * chartW,
      y: padding.top + chartH - ((v - min) / range) * chartH
    }));

    const gradient = ctx.createLinearGradient(0, padding.top, 0, h);
    gradient.addColorStop(0, colors.primary + '40');
    gradient.addColorStop(1, colors.primary + '00');

    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors.primary;
      ctx.fill();
    });

    ctx.fillStyle = colors.text;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((l, i) => {
      if (i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1) {
        ctx.fillText(l, points[i].x, h - 10);
      }
    });
  }

  function areaChart(canvas, labels, values) {
    lineChart(canvas, labels, values);
  }

  function barChart(canvas, labels, values, color) {
    if (!canvas || !values?.length) return;
    const { ctx, w, h } = setupCanvas(canvas);
    const colors = getColors();
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);
    drawGrid(ctx, w, h, padding);

    const max = Math.max(...values, 1) * 1.15;
    const barW = chartW / values.length * 0.6;
    const gap = chartW / values.length;

    values.forEach((v, i) => {
      const barH = (v / max) * chartH;
      const x = padding.left + i * gap + (gap - barW) / 2;
      const y = padding.top + chartH - barH;

      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, color || colors.accent);
      grad.addColorStop(1, (color || colors.accent) + '80');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW, barH);
    });

    ctx.fillStyle = colors.text;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((l, i) => {
      if (i % Math.ceil(labels.length / 6) === 0) {
        ctx.fillText(l, padding.left + i * gap + gap / 2, h - 10);
      }
    });
  }

  function circularChart(canvas, percent, label) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 15;
    const colors = getColors();

    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 12;
    ctx.stroke();

    const start = -Math.PI / 2;
    const end = start + (Math.min(100, percent) / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(center, center, radius, start, end);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 24px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(percent) + '%', center, center - 8);

    if (label) {
      ctx.fillStyle = colors.text;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(label, center, center + 18);
    }
  }

  function updateCircularProgress(el, percent) {
    if (!el) return;
    const circle = el.querySelector('.fill');
    if (!circle) return;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (Math.min(100, percent) / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    const text = el.querySelector('.circle-text');
    if (text) text.textContent = Math.round(percent) + '%';
    el.dataset.progress = percent;
  }

  function getLastNDays(n) {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }

  function formatLabels(dates) {
    return dates.map(d => {
      const parts = d.split('-');
      return `${parts[1]}/${parts[2]}`;
    });
  }

  return {
    lineChart,
    areaChart,
    barChart,
    circularChart,
    updateCircularProgress,
    getLastNDays,
    formatLabels,
    setupCanvas
  };
})();
