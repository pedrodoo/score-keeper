/**
 * TRON-style streamlines: streaks from all around the viewport, 360°,
 * erratic direction changes, variable brightness, multiple at once.
 */
(function () {
  const LAYER_ID = 'streamlines-layer';
  const MIN_LINES = 4;
  const MAX_LINES = 10;
  const MIN_DURATION = 2.5;
  const MAX_DURATION = 6;
  const MIN_OPACITY = 0.2;
  const MAX_OPACITY = 0.9;

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createLine() {
    const duration = randomBetween(MIN_DURATION, MAX_DURATION);
    const angle1 = randomBetween(0, 360);
    const angle2 = angle1 + randomBetween(-80, 80); // mudança errática a meio
    const startX = randomBetween(0, 100);
    const startY = randomBetween(0, 100);
    const opacity = randomBetween(MIN_OPACITY, MAX_OPACITY);
    const glowStrength = randomBetween(0.4, 1.2);
    const el = document.createElement('div');
    el.className = 'streamline';
    el.style.setProperty('--streamline-duration', duration + 's');
    el.style.setProperty('--streamline-angle1', angle1 + 'deg');
    el.style.setProperty('--streamline-angle2', angle2 + 'deg');
    el.style.setProperty('--streamline-start-x', startX + '%');
    el.style.setProperty('--streamline-start-y', startY + '%');
    el.style.setProperty('--streamline-opacity', String(opacity.toFixed(2)));
    el.style.setProperty('--streamline-glow', String(glowStrength.toFixed(2)));
    el.style.setProperty('--streamline-delay', Math.random() * 3 + 's');
    return el;
  }

  function startLine(line) {
    const layer = document.getElementById(LAYER_ID);
    if (!layer) return;
    layer.appendChild(line);
    line.addEventListener('animationend', function onEnd() {
      line.removeEventListener('animationend', onEnd);
      line.remove();
      startLine(createLine());
    });
  }

  function init() {
    const layer = document.getElementById(LAYER_ID);
    if (!layer) return;
    const count = MIN_LINES + Math.floor(Math.random() * (MAX_LINES - MIN_LINES + 1));
    for (let i = 0; i < count; i++) {
      startLine(createLine());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
