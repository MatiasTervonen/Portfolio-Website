// Gameboard variables

const grid = document.querySelector(" .grid");

let squares = Array.from(document.querySelectorAll(" .grid div"));

let displaySquares = Array.from(document.querySelectorAll(".mini-grid div"));

const scoreDisplay = document.querySelectorAll("#score, #score2");

const startBtn = document.querySelectorAll("#start, #start2");

const width = 10;

let nextRandom = 0;

// Score, Paused, Gameover

let score = 0;

let isPaused = false;

let isGameOver = false;

// Tetromino Colors

const colors = ["orange", "red", "purple", "green", "blue"];

// Music

const backgroundMusic = document.getElementById("backgroundMusic");

const hit = document.getElementById("hit");

const levelChange = document.getElementById("levelChange");

const volumeControl = document.getElementById("volumeControl");

const gameEndMusic = document.getElementById("gameEndMusic");

let savedVolume = localStorage.getItem("volume") || volumeControl.value;

// Level

const levelDisplay = document.querySelectorAll("#level, #level2");

let level = 1;

// Timer

const timerDisplay = document.querySelectorAll("#timer, #timer2 ");

let timeElapsed = 0;

let timerInterval;

let timerId;

// Moved leaderboardlist away from game page to menu. Works only when this is before any code

document.addEventListener("DOMContentLoaded", function () {
  displayLeaderboard();
});

// Movement for mobile by touching

let startX = 0;
let startY = 0;

let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;

// Save coordinates when touch starts
grid.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent the default movements like scrolling, page reload etc.. While moving
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  touchStartTime = new Date().getTime();
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

// Follow the movement of finger
document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const currentX = touch.clientX;
  const currentY = touch.clientY;

  // Count the direction of move
  const diffX = currentX - startX;
  const diffY = currentY - startY;

  // Movement direction
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 30) {
      moveRight();
      startX = currentX;
    } else if (diffX < -30) {
      moveLeft();
      startX = currentX;
    }
  } else {
    if (diffY > 30) {
      moveDown();
      startY = currentY;
    }
  }
});

// When you tap screen it rotates Tetromnino
document.addEventListener("touchend", (e) => {
  const touchEndTime = new Date().getTime();
  const touchDuration = touchEndTime - touchStartTime;

  const touch = e.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const diffX = Math.abs(touchEndX - touchStartX);
  const diffY = Math.abs(touchEndY - touchStartY);

  // If touch is small and short it is counted as rotate
  if (touchDuration < 200 && diffX < 10 && diffY < 10) {
    rotate();
  }
  // If touch is long and down move fast down
});

//Audio for game

const audio = [
  document.getElementById("backgroundMusic"),
  document.getElementById("full"),
  document.getElementById("gameVoice"),
  document.getElementById("hit"),
  document.getElementById("levelChange"),
  document.getElementById("gameEndMusic"),
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
  if (isAnimating) return;
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
  ghostDraw();
}

//undraw the Tetromino

function undraw() {
  undrawGhost();
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
    squares[currentPosition + index].style.backgroundColor = "";
  });
}

// Draw ghost tetromino where it is going to land

function ghostDraw() {
  let ghostPosition = currentPosition;

  while (
    !current.some((index) =>
      squares[ghostPosition + index + width].classList.contains("taken")
    )
  ) {
    ghostPosition += width;
  }

  current.forEach((index) => {
    squares[ghostPosition + index].classList.add("ghost-tetromino");
  });
}

// undraw ghost tetromino

function undrawGhost() {
  let ghostPosition = currentPosition;
  while (
    !current.some((index) =>
      squares[ghostPosition + index + width].classList.contains("taken")
    )
  ) {
    ghostPosition += width;
  }
  current.forEach((index) => {
    squares[ghostPosition + index].classList.remove("ghost-tetromino");
  });
}

// assing functions to keyCodes

function control(e) {
  if (isPaused) return;
  if (isAnimating) return;
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
  if (!timerId) return;
  if (isAnimating) return;
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Show the glow of the color that is coming next

function updateGlowColor() {
  const nextColor = colors[nextRandom];
  grid.style.boxShadow = `0 0 15px 5px ${nextColor}, 0 0 30px 10px ${nextColor}`;
}

//freeze function

let isAnimating = false;

async function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) => {
      let currentSquare = squares[currentPosition + index];
      squares[currentPosition + index].classList.add("taken");
      isAnimating = true;
      currentSquare.classList.add("hit");
      hit.volume = savedVolume * 0.3;
      hit.play();
    });

    undrawGhost();

    await sleep(200);

    isAnimating = false;

    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("hit");
    });

    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    addScore();
    draw();
    displayShape();
    gameOver();
    updateGlowColor();
  }
}

//add score

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function addScore() {
  let rowsCleared = 0;

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
      rowsCleared++;

      hit.volume = 0;
      full.currentTime = 0;
      full.play();
      isAnimating = true;

      row.forEach((index) => {
        squares[index].classList.add("full-row");
      });

      await sleep(500);

      isAnimating = false;

      row.forEach((index) => {
        squares[index].classList.remove("taken", "tetromino", "full-row");
        squares[index].style.backgroundColor = "";
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
  if (rowsCleared == 4) {
    score += 100;
  } else if (rowsCleared == 3) {
    score += 50;
  } else if (rowsCleared == 2) {
    score += 30;
  } else if (rowsCleared == 1) {
    score += 10;
  }
  scoreDisplay.forEach((display) => (display.innerHTML = score));
  addLevel();
}

// move the tetromino left, unless it is at the edge or there is blockage

function moveLeft() {
  if (!timerId) return;
  if (isAnimating) return;
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
  if (!timerId) return;
  if (isAnimating) return;
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
  if (!timerId) return;
  if (isAnimating) return;
  undraw();
  let nextRotation = (currentRotation + 1) % current.length;
  let nextTetromino = theTetrominoes[random][nextRotation];

  const isAtLeftEdge = nextTetromino.some(
    (index) => (currentPosition + index) % width === 0
  );
  const isAtRightEdge = nextTetromino.some(
    (index) => (currentPosition + index) % width === width - 1
  );

  // prevent moving over the edge
  if (!isAtLeftEdge && !isAtRightEdge) {
    currentRotation = nextRotation;
    current = nextTetromino;
  }

  draw();
}

//show up next tetromino in mini grid

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

  const miniGrids = document.querySelectorAll(".mini-grid");

  miniGrids.forEach((grid) => {
    const gridSquares = Array.from(grid.querySelectorAll("div"));

    upNextTetrominoes[nextRandom].forEach((index) => {
      if (gridSquares[displayIndex + index]) {
        gridSquares[displayIndex + index].classList.add("tetromino");
        gridSquares[displayIndex + index].style.backgroundColor =
          colors[nextRandom];
      }
    });
  });
}

//Add start and pause for the game

startBtn.forEach((startBtn) => {
  startBtn.addEventListener("click", () => {
    if (isAnimating) return;
    if (timerId) {
      pauseGame();
    } else {
      startGame();
    }
  });
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

// Game Over

const menu2 = document.querySelector(".menu2");
const gameEnd = document.querySelector(".gameEnd");

function gameOver() {
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    isPaused = true;
    isGameOver = true;

    pauseGame();
    resetGame();

    gameVoice.play();
    gameEnd.classList.remove("hidden");
    gameEnd.classList.add("flex");

    menu2.classList.remove("hidden");
    menu2.classList.add("flex");
    gameEndMusic.play();

    startBtn.forEach((btn) => {
      btn.classList.add("button-disabled");
      btn.disabled = true;
    });
  }
}

function resetGame() {
  squares.forEach((square) => {
    square.classList.remove(
      "tetromino",
      "levelCompleted",
      "hit",
      "ghost-tetromino"
    );
    square.style.backgroundColor = "";
    if (!square.classList.contains("taken2")) {
      square.classList.remove("taken");
    }
  });

  displaySquares.forEach((square) => {
    square.classList.remove("tetromino");
    square.style.backgroundColor = "";
  });
}

// Start New Game

function startGame() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  draw();
  if (!nextRandom) {
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  }
  updateGlowColor();
  timerId = setInterval(moveDown, 1000);
  timerInterval = setInterval(updateTimer, 1000);
  displayShape();
  backgroundMusic.play();
  isPaused = false;
}

function pauseGame() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  backgroundMusic.pause();
  isPaused = true;
}
// Make the speed of tetromino and music faster every 100 points

let newInterval = 1000;
let currentPlaybackRate = 1.0;

function updateSpeedAndMusic() {
  newInterval *= 0.95;

  clearInterval(timerId);

  timerId = setInterval(moveDown, newInterval);

  currentPlaybackRate *= 1.02;
  backgroundMusic.playbackRate = currentPlaybackRate;
}

// Inceare Level points by 1 every 100 Score

const nextLevelButton = document.querySelector(".nextLevelButton");
const levelText = document.querySelector(".levelText");
let level1 = 10;

async function addLevel() {
  if (score >= level1) {
    level++;
    score = 0;
    level1 += 10;
    levelDisplay.forEach((display) => (display.innerHTML = level));
    scoreDisplay.forEach((display) => (display.innerHTML = score));
    backgroundMusic.pause();
    full.pause();
    hit.pause();
    isAnimating = true;
    levelCompletedAnimation();
    pauseGame();
    await sleep(3000);
    nextLevel();
    updateLeaderboard();
  }
}

function levelCompletedAnimation() {
  squares.forEach((square) => {
    if (square.classList.contains("taken")) {
      square.classList.add("levelCompleted");
    }
  });

  levelText.classList.remove("hidden");
  levelText.classList.add("flex");

  levelChange.play();
}

function nextLevel() {
  nextLevelButton.classList.remove("hidden");
  nextLevelButton.classList.add("flex");

  nextLevelButton.addEventListener("click", function () {
    isAnimating = false;

    nextLevelButton.classList.add("hidden");
    nextLevelButton.classList.remove("flex");
    levelText.classList.add("hidden");
    levelText.classList.remove("flex");
    resetGame();
    startGame();
    updateSpeedAndMusic();
  });
}

// Timer for the Game Time

function updateTimer() {
  timeElapsed += 1;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  timerDisplay.forEach((display) => (display.innerHTML = formattedTime));
}

// Get Leaderboard list from logalStorage

function testAddLeaderboardEntry() {
  const leaderboardList = document.getElementById("leaderboard-list");
  if (leaderboardList) {
    const testEntry = document.createElement("li");
    testEntry.textContent = "Test Entry - Score: 100, Level: 1, Time: 00:01:30";
    leaderboardList.appendChild(testEntry);
  } else {
    console.log("Leaderboard list element not found.");
  }
}

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

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "<li>No scores available</li>";
  } else {
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
