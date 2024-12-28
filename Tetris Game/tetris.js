const grid = document.querySelector(" .grid");

let squares = Array.from(document.querySelectorAll(" .grid div"));

const scoreDisplay = document.getElementById("score");

const startBtn = document.getElementById("start");

const width = 10;

let nextRandom = 0;

let timerId;

let score = 0;

const colors = ["orange", "red", "purple", "green", "blue"];

const backgroundMusic = document.getElementById("background-music");

let isPaused = false;

let isGameOver = false;

const volumeControl = document.getElementById("volumeControl");

let savedVolume = localStorage.getItem("volume") || volumeControl.value;

const levelDisplay = document.getElementById("level");

let level = 1;

const timerDisplay = document.getElementById("timer");

let timeElapsed = 0;

let timerInterval;

// Eventlisteners For mobile touch movements

//Audio for game

const audio = [
  document.getElementById("background-music"),
  document.getElementById("full"),
  document.getElementById("gameVoice"),
];

// Volume control for all game voices

audio.forEach((audio) => {
  audio.volume = savedVolume;
});
volumeControl.value = savedVolume;

volumeControl.addEventListener("input", (event) => {
  savedVolume = event.target.value;
  localStorage.setItem("volume", savedVolume);
  audio.forEach((audio) => {
    audio.volume = savedVolume;
  });
});

//The Tetrominoes

const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theTetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
];
let currentPosition = 4;
let currentRotation = 0;

let random = Math.floor(Math.random() * theTetrominoes.length);

let current = theTetrominoes[random][currentRotation];

// draw random tetromino and its firts rotation

function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
}

//undraw the Tetromino

function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
    squares[currentPosition + index].style.backgroundColor = "";
  });
}

// assing functions to keyCodes

function control(e) {
  if (isPaused) return;
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}

document.addEventListener("keyup", control);

//mmove down function

function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Show the glow of the color that is coming next

function updateGlowColor() {
  const nextColor = colors[nextRandom]; // Hae seuraavan Tetrimino-väri
  grid.style.boxShadow = `0 0 15px 5px ${nextColor}, 0 0 30px 10px ${nextColor}`;
}

//freeze function

function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    //Start new tetromino falling
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    addScore();
    gameOver();

    updateGlowColor();
  }
}

// move the tetromino left, unless is at the edge or there is blockage

function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );

  if (!isAtLeftEdge) currentPosition -= 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }

  draw();
}

// Move the tetromino right, unless is at the edge or there is blockage

function moveRight() {
  undraw();

  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === 9
  );

  if (!isAtRightEdge) currentPosition += 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }

  draw();
}

// rotate the tetromino

function rotate() {
  undraw();
  let nextRotation = (currentRotation + 1) % current.length;
  let nextTetromino = theTetrominoes[random][nextRotation];

  const isAtLeftEdge = nextTetromino.some(
    (index) => (currentPosition + index) % width === 0
  );
  const isAtRightEdge = nextTetromino.some(
    (index) => (currentPosition + index) % width === width - 1
  );

  // Estä siirtyminen reunan yli
  if (!isAtLeftEdge && !isAtRightEdge) {
    currentRotation = nextRotation;
    current = nextTetromino;
  }

  draw();
}

//show up next tetromino in mini grid

const displaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
let displayIndex = 0;

// The tetrominoes without rotations

const upNextTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
  [0, 1, displayWidth, displayWidth + 1], //oTetromino
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
];

// Display the shape in the mini-grid display

function displayShape() {
  displaySquares.forEach((square) => {
    square.classList.remove("tetromino");
    square.style.backgroundColor = "";
  });
  upNextTetrominoes[nextRandom].forEach((index) => {
    displaySquares[displayIndex + index].classList.add("tetromino");
    displaySquares[displayIndex + index].style.backgroundColor =
      colors[nextRandom];
  });
}

//Add start and pause for the game

startBtn.addEventListener("click", () => {
  if (isGameOver) {
    // prevent the start game function if game has ended
    alert("The game has ended! Start a new game by pressing 'Start New Game'.");
    return;
  }

  if (timerId) {
    // Stop
    clearInterval(timerId);
    clearInterval(timerInterval);
    timerId = null;
    backgroundMusic.pause();
    isPaused = true;
  } else {
    // Start
    draw();
    if (!nextRandom) {
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    }
    updateGlowColor();
    timerId = setInterval(moveDown, 1000);
    timerInterval = setInterval(updateTimer, 1000);
    displayShape();
    backgroundMusic.play();
    isPaused = false; //Prevent continuous key presses during pause
  }
});

// Functions for tetrominoes move continiously when key is pushed down

let downIntervalId;
let rightIntervalId;
let leftIntervalId;

//  Down key

document.addEventListener("keydown", (e) => {
  if (isPaused) return; //  Prevent continuous key presses during pause
  if (e.keyCode === 40) {
    if (!downIntervalId) {
      downIntervalId = setInterval(() => {
        moveDown();
      }, 100);
    }
  } else if (e.keyCode === 39) {
    if (!rightIntervalId) {
      rightIntervalId = setInterval(() => {
        moveRight();
      }, 100);
    }
  } else if (e.keyCode === 37) {
    if (!leftIntervalId) {
      leftIntervalId = setInterval(() => {
        moveLeft();
      }, 100);
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode === 40) {
    clearInterval(downIntervalId);
    downIntervalId = null;
  } else if (e.keyCode === 39) {
    clearInterval(rightIntervalId);
    rightIntervalId = null;
  } else if (e.keyCode === 37) {
    clearInterval(leftIntervalId);
    leftIntervalId = null;
  }
});

//add score

function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains("taken"))) {
      full.currentTime = 0;
      full.play();
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
        squares[index].classList.remove("taken");
        squares[index].classList.remove("tetromino");
        squares[index].style.backgroundColor = "";
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }

  updateSpeedAndMusic();
  addLevel();
}

// Game Over

function gameOver() {
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    scoreDisplay.innerHTML = "Game Over";
    clearInterval(timerId);
    clearInterval(timerInterval);
    backgroundMusic.pause();
    gameVoice.play();
    isPaused = true;
    isGameOver = true;

    updateLeaderboard(score, level, timeElapsed);

    displayLeaderboard();

    // Empty the Mini Grid from all tetrominoes
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });

    // Empty the Grid from all tetrominoes
    squares.forEach((square) => {
      square.classList.remove("tetromino");
      square.classList.remove("taken");
      square.style.backgroundColor = "";
    });
  }
}

// Start New Game button

const startNewGame = document.getElementById("startNewGame");

startNewGame.addEventListener("click", () => {
  location.reload();
  audio.forEach((audio) => {
    audio.volume = savedVolume;
  });
  clearInterval(timerInterval);
  timeElapsed = 0;
  timerDisplay.innerHTML = "00:00";
});

// Make the speed of tetromino and music faster every 100 points

let speedLevel = 1;

function updateSpeedAndMusic() {
  const newSpeedLevel = Math.floor(score / 100) + 1;
  if (newSpeedLevel > speedLevel) {
    speedLevel = newSpeedLevel;

    clearInterval(timerId);
    const newInterval = 1000 / speedLevel;
    timerId = setInterval(moveDown, newInterval);

    backgroundMusic.playbackRate = 1 + (speedLevel - 1) * 0.1;
  }
}

// Inceare Level points by 1 every 100 Score

let nextLevelScore = 100;

function addLevel() {
  if (score >= nextLevelScore) {
    level = level + 1;
    nextLevelScore = nextLevelScore + 100;
    levelDisplay.innerHTML = level;
  }
}

// Timer for the Game Time

function updateTimer() {
  timeElapsed += 1;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  timerDisplay.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

// Get Leaderboard list from logalStorage

function getLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  return leaderboard;
}

// Update Leaderboard with new scores
function updateLeaderboard(score, level, timeElapsed) {
  const leaderboard = getLeaderboard();

  // Update current game scores to list
  leaderboard.push({ score, level, timeElapsed });

  // sort scores by highest scores to down
  leaderboard.sort((a, b) => b.score - a.score);

  // Show only top 10
  const top10 = leaderboard.slice(0, 10);

  // save the updated list to logal storage
  localStorage.setItem("leaderboard", JSON.stringify(top10));

  displayLeaderboard();
}

// Show leaderboardlist on HTML
function displayLeaderboard() {
  const leaderboard = getLeaderboard();
  const leaderboardList = document.getElementById("leaderboard-list");

  leaderboardList.innerHTML = "";

  // add every score to list
  leaderboard.forEach((entry, index) => {
    const { score, level, timeElapsed } = entry;
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    const li = document.createElement("li");
    li.textContent = `${
      index + 1
    }: Score: ${score}, Level: ${level}, Time: ${formattedTime}`;
    leaderboardList.appendChild(li);
  });
}
document.addEventListener("DOMContentLoaded", displayLeaderboard);

// Stop the default page scroll when keys are pushed

document.addEventListener("keydown", function (event) {
  if (
    event.key === "ArrowDown" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  ) {
    event.preventDefault();
  }
});
