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
  }

  function updateDrawMessage() {
    if (!drawMessage) return;
    if (scoreA === scoreB && scoreA > 0) {
      drawMessage.setAttribute('visible', '');
    } else {
      drawMessage.removeAttribute('visible');
    }
  }

  function onScoreIncrement(e) {
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
  }

  function onScoreDecrement(e) {
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
  }

  if (board) {
    board.addEventListener('score-increment', onScoreIncrement);
    board.addEventListener('score-decrement', onScoreDecrement);
  }

  loadScores();
  updateDrawMessage();
})();
