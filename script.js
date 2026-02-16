(function () {
  const board = document.querySelector('score-board');
  const teamA = document.querySelector('team-card[team-id="a"]');
  const teamB = document.querySelector('team-card[team-id="b"]');
  const drawMessage = document.querySelector('draw-message');

  let scoreA = 0;
  let scoreB = 0;

  function saveScores() {
    localStorage.setItem('scoreA', scoreA.toString());
    localStorage.setItem('scoreB', scoreB.toString());
  }

  function loadScores() {
    const storedA = localStorage.getItem('scoreA');
    const storedB = localStorage.getItem('scoreB');

    if (storedA !== null) {
      scoreA = parseInt(storedA, 10) || 0;
      if (teamA) teamA.setAttribute('score', scoreA);
    }
    if (storedB !== null) {
      scoreB = parseInt(storedB, 10) || 0;
      if (teamB) teamB.setAttribute('score', scoreB);
    }
    updateDrawMessage();
    updateGlowIntensity();
  }

  function onScoreReset() {
    scoreA = 0;
    scoreB = 0;
    if (teamA) teamA.setAttribute('score', '0');
    if (teamB) teamB.setAttribute('score', '0');
    saveScores();
    updateDrawMessage();
    updateGlowIntensity();
  }

  function updateDrawMessage() {
    if (!drawMessage) return;
    const isDraw = scoreA === scoreB && scoreA > 0;
    const wasVisible = drawMessage.hasAttribute('visible');
    if (isDraw) {
      drawMessage.setAttribute('visible', '');
      if (!wasVisible && window.audioManager) window.audioManager.playSfx('draw');
    } else {
      drawMessage.removeAttribute('visible');
    }
  }

  function updateGlowIntensity() {
    if (!board) return;
    const diff = Math.abs(scoreA - scoreB);
    const intensity = 1 / (1 + diff * 0.25);
    board.style.setProperty('--glow-intensity', String(intensity));
    // Quanto mais perto, maior e mais rápido o glow; quanto mais longe, mais suave e lento
    const pulseDuration = 0.85 + 2.65 * (1 - intensity); // 0.85s (perto) → 3.5s (longe)
    const sizeMultiplier = 0.5 + 1.2 * intensity;        // 0.5 (longe) → 1.7 (perto)
    board.style.setProperty('--glow-pulse-duration', pulseDuration.toFixed(2) + 's');
    board.style.setProperty('--glow-size-multiplier', String(sizeMultiplier.toFixed(2)));
  }

  function onScoreIncrement(e) {
    if (window.audioManager) window.audioManager.playSfx('clickIncrement');
    const teamId = e.detail && e.detail.teamId;
    if (teamId === 'a') {
      scoreA++;
      if (teamA) teamA.setAttribute('score', scoreA);
    } else {
      scoreB++;
      if (teamB) teamB.setAttribute('score', scoreB);
    }
    saveScores();
    updateDrawMessage();
    updateGlowIntensity();
  }

  function onScoreDecrement(e) {
    if (window.audioManager) window.audioManager.playSfx('clickDecrement');
    const teamId = e.detail && e.detail.teamId;
    if (teamId === 'a') {
      if (scoreA > 0) {
        scoreA--;
        if (teamA) teamA.setAttribute('score', scoreA);
      }
    } else {
      if (scoreB > 0) {
        scoreB--;
        if (teamB) teamB.setAttribute('score', scoreB);
      }
    }
    saveScores();
    updateDrawMessage();
    updateGlowIntensity();
  }

  if (board) {
    board.addEventListener('score-increment', onScoreIncrement);
    board.addEventListener('score-decrement', onScoreDecrement);
    board.addEventListener('score-reset', onScoreReset);
  }

  loadScores();
  updateDrawMessage();
  updateGlowIntensity();
})();
