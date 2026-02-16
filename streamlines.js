/**
 * TRON-style streamlines: enter from outside one of four edges (top, bottom, left, right),
 * make a single 90° bend inside the viewport, exit toward adjacent edge.
 */
(function () {
  const LAYER_ID = 'streamlines-layer';
  const MIN_LINES = 4;
  const MAX_LINES = 8;
  const MIN_DURATION = 2.5;
  const MAX_DURATION = 6;
  const MIN_OPACITY = 0.2;
  const MAX_OPACITY = 0.9;

  const EDGES = [
    { edge: 'left', angle1: 0, angle2Options: [90, 270] },
    { edge: 'right', angle1: 180, angle2Options: [90, 270] },
    { edge: 'top', angle1: 90, angle2Options: [0, 180] },
    { edge: 'bottom', angle1: 270, angle2Options: [0, 180] }
  ];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createLine() {
    const duration = randomBetween(MIN_DURATION, MAX_DURATION);
    const opacity = randomBetween(MIN_OPACITY, MAX_OPACITY);
    const glowStrength = randomBetween(0.4, 1.2);

    const config = pick(EDGES);
    const angle1 = config.angle1;
    const angle2 = pick(config.angle2Options);

    let startX;
    let startY;
    switch (config.edge) {
      case 'left':
        startX = 0;
        startY = randomBetween(5, 95);
        break;
      case 'right':
        startX = 100;
        startY = randomBetween(5, 95);
        break;
      case 'top':
        startX = randomBetween(5, 95);
        startY = 0;
        break;
      case 'bottom':
        startX = randomBetween(5, 95);
        startY = 100;
        break;
    }

    const el = document.createElement('div');
    el.className = 'streamline';
    el.style.setProperty('--streamline-duration', duration + 's');
    el.style.setProperty('--streamline-angle1', angle1 + 'deg');
    el.style.setProperty('--streamline-angle2', angle2 + 'deg');
    el.style.setProperty('--streamline-start-x', startX + '%');
    el.style.setProperty('--streamline-start-y', startY + '%');
    el.style.setProperty('--streamline-opacity', String(opacity.toFixed(2)));
    el.style.setProperty('--streamline-glow', String(glowStrength.toFixed(2)));
    el.style.setProperty('--streamline-delay', Math.random() * 2 + 's');
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
