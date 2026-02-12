const drawMessageElement = document.getElementById('draw-message');

// Team A
const scoreAElement = document.getElementById('score-a');
const incrementAButton = document.getElementById('increment-a');
const decrementAButton = document.getElementById('decrement-a');
let scoreA = 0;

// Team B
const scoreBElement = document.getElementById('score-b');
const incrementBButton = document.getElementById('increment-b');
const decrementBButton = document.getElementById('decrement-b');
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
        scoreAElement.textContent = scoreA;
    }

    if (storedB !== null) {
        scoreB = parseInt(storedB, 10) || 0;
        scoreBElement.textContent = scoreB;
    }

    updateDrawMessage();
}

function updateDrawMessage() {
    if (scoreA === scoreB && scoreA > 0) {
        drawMessageElement.classList.add('show');
    } else {
        drawMessageElement.classList.remove('show');
    }
}

function incrementScoreA() {
    scoreA++;
    scoreAElement.textContent = scoreA;
    saveScores();
    updateDrawMessage();
}

function decrementScoreA() {
    if (scoreA > 0) {
        scoreA--;
        scoreAElement.textContent = scoreA;
        saveScores();
        updateDrawMessage();
    }
}

function incrementScoreB() {
    scoreB++;
    scoreBElement.textContent = scoreB;
    saveScores();
    updateDrawMessage();
}

function decrementScoreB() {
    if (scoreB > 0) {
        scoreB--;
        scoreBElement.textContent = scoreB;
        saveScores();
        updateDrawMessage();
    }
}

incrementAButton.addEventListener('click', incrementScoreA);
decrementAButton.addEventListener('click', decrementScoreA);
incrementBButton.addEventListener('click', incrementScoreB);
decrementBButton.addEventListener('click', decrementScoreB);

// Load saved scores when the page loads
loadScores();
updateDrawMessage();

