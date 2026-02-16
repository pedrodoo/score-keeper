/**
 * TRON-style streamlines: 90° angles only, direction change ±90°,
 * horizontal streaks in top half, vertical in bottom half — no crossing.
 */
(function () {
  const LAYER_ID = 'streamlines-layer';
  const MIN_LINES = 4;
  const MAX_LINES = 8;
  const MIN_DURATION = 2.5;
  const MAX_DURATION = 6;
  const MIN_OPACITY = 0.2;
  const MAX_OPACITY = 0.9;

  const ANGLES = [0, 90, 180, 270];
  const H_LANES_Y = [12, 24, 36, 48];
  const V_LANES_X = [20, 40, 60, 80];
  const H_LANE_COUNT = H_LANES_Y.length;
  const V_LANE_COUNT = V_LANES_X.length;

  const horizontalLanesInUse = new Set();
  const verticalLanesInUse = new Set();

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

    const useHorizontal = Math.random() < 0.5;
    let laneIndex;
    let startX;
    let startY;
    let angle1;
    let angle2;

    if (useHorizontal) {
      const available = [];
      for (let i = 0; i < H_LANE_COUNT; i++) {
        if (!horizontalLanesInUse.has(i)) available.push(i);
      }
      if (available.length === 0) {
        laneIndex = Math.floor(Math.random() * H_LANE_COUNT);
      } else {
        laneIndex = pick(available);
      }
      horizontalLanesInUse.add(laneIndex);
      startX = 50;
      startY = H_LANES_Y[laneIndex];
      angle1 = pick([0, 180]);
      angle2 = angle1 + pick([-90, 90]);
      if (angle2 < 0) angle2 += 360;
      if (angle2 >= 360) angle2 -= 360;
    } else {
      const available = [];
      for (let i = 0; i < V_LANE_COUNT; i++) {
        if (!verticalLanesInUse.has(i)) available.push(i);
      }
      if (available.length === 0) {
        laneIndex = Math.floor(Math.random() * V_LANE_COUNT);
      } else {
        laneIndex = pick(available);
      }
      verticalLanesInUse.add(laneIndex);
      startX = V_LANES_X[laneIndex];
      startY = 55 + Math.random() * 35;
      angle1 = pick([90, 270]);
      angle2 = angle1 + pick([-90, 90]);
      if (angle2 < 0) angle2 += 360;
      if (angle2 >= 360) angle2 -= 360;
    }

    const el = document.createElement('div');
    el.className = 'streamline';
    el.dataset.horizontal = useHorizontal ? '1' : '0';
    el.dataset.laneIndex = String(laneIndex);
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

  function releaseLane(el) {
    const isHorizontal = el.dataset.horizontal === '1';
    const laneIndex = parseInt(el.dataset.laneIndex || '0', 10);
    if (isHorizontal) {
      horizontalLanesInUse.delete(laneIndex);
    } else {
      verticalLanesInUse.delete(laneIndex);
    }
  }

  function startLine(line) {
    const layer = document.getElementById(LAYER_ID);
    if (!layer) return;
    layer.appendChild(line);
    line.addEventListener('animationend', function onEnd() {
      line.removeEventListener('animationend', onEnd);
      releaseLane(line);
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
