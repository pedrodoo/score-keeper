/**
 * TRON-style streamlines: lines crossing the viewport behind the scoreboard.
 * Random direction, duration (2s–6s), and spawn; 3–6 lines at a time.
 */
(function () {
  const LAYER_ID = 'streamlines-layer';
  const MIN_LINES = 3;
  const MAX_LINES = 6;
  const MIN_DURATION = 2;
  const MAX_DURATION = 6;
  const LINE_LENGTH = 150;
  const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createLine() {
    const duration = randomBetween(MIN_DURATION, MAX_DURATION);
    const angle = pick(ANGLES);
    const el = document.createElement('div');
    el.className = 'streamline';
    el.style.setProperty('--streamline-duration', duration + 's');
    el.style.setProperty('--streamline-angle', angle + 'deg');
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
