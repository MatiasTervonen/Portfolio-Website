// Gameboard

const grid = document.querySelector(".grid");

// Intitialize gameboard

const gameContainer = document.getElementById("gameBoard");

for (let i = 0; i < 210; i++) {
  const newDiv = document.createElement("div");
  gameContainer.appendChild(newDiv);
  if (i >= 200) {
    newDiv.classList.add("taken");
    gameContainer.appendChild(newDiv);
  }
}

// Array of all divs/squares inside gameboard

let squares = Array.from(document.querySelectorAll(".grid div"));

// array of all divs/squares indsise displayShape

let displaySquares = Array.from(document.querySelectorAll(".mini-grid div"));

// Score, Level and Time displays. Start/Pause buttons

const levelDisplay = document.querySelectorAll("#level, #level2");

const scoreDisplay = document.querySelectorAll("#score, #score2");

const timerDisplay = document.querySelectorAll("#timer, #timer2 ");

const startBtn = document.querySelectorAll("#start, #start2");

// Tetromino Colors

const colors = ["orange", "red", "purple", "green", "blue"];

// Music

const backgroundMusic = document.getElementById("backgroundMusic");

const hit = document.getElementById("hit");

const levelChange = document.getElementById("levelChange");

const volumeControl = document.getElementById("volumeControl");

const gameEndMusic = document.getElementById("gameEndMusic");

const tetris = document.getElementById("tetris");

let savedVolume = localStorage.getItem("volume") || volumeControl.value;

// pause, gameover

let isPaused;
let isGameOver;

// async function. When you add "await spleep(ms)" in function it stops at the given time and continues after that. This is used with animations.

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Moved leaderboardlist away from game page to menu. Works only when this is before any code

document.addEventListener("DOMContentLoaded", function () {
  displayLeaderboard();
});

//The Tetrominoes and rotations. One array is rotation

const width = 10; // width of the gameboard. 10 squares/div elements

// each number represents index in gameboard and shape is drawn to these. from the start of the gameboard.

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

// draw random tetromino variables

let currentPosition = 4;
let currentRotation = 0;
let nextRandom = 0;

let random = Math.floor(Math.random() * theTetrominoes.length); // pick one random numeber and max is tetromino rotations length

let current = theTetrominoes[random][currentRotation]; // Pick one random tetromino and its first rotation

// draw random tetromino and its firts rotation

function draw() {
  if (isAnimating) return; // If animation is happening return

  //  Add tetromino class to all squares/divs where the tetromino should be drawn, with random background color

  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
  ghostDraw(); // Draw ghost tetromino
}

//undraw the Tetromino

function undraw() {
  undrawGhost(); // undraw ghost tetromino
  // Removwe tetromino class from all squares/divs, and clear background color.

  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
    squares[currentPosition + index].style.backgroundColor = "";
  });
}

// Draw ghost tetromino where tetromino is going to land

function ghostDraw() {
  let ghostPosition = currentPosition; // Ghost position is same where the tetromino starts

  // Loop through as long as some part of the current tetromino is not touching taken square/div.

  while (
    !current.some((index) =>
      squares[ghostPosition + index + width].classList.contains("taken")
    )
  ) {
    ghostPosition += width; // then add 10 index to next ghost position
  }

  // Add ghost-tetromino class to all squares/divs where the ghost tetromino should be drawn.

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

//freeze function. Freezes the tetromino in its place.

let isAnimating = false;

async function freeze() {
  if (isAnimating) return;
  isAnimating = true;

  current.forEach((index) => {
    let currentSquare = squares[currentPosition + index];
    squares[currentPosition + index].classList.add("taken");
    currentSquare.classList.add("hit");
  });

  hit.volume = savedVolume * 0.3;
  hit.play();

  undrawGhost();

  await sleep(200);

  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("hit");
  });

  random = nextRandom;
  nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  current = theTetrominoes[random][currentRotation];
  currentPosition = 4;

  isAnimating = false;

  addScore();
  draw();
  displayShape();
  gameOver();
  updateGlowColor();
}

//add score if you get a full row and score depending how many full rows you get.

let score = 0;

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
    tetris.play();
    score += 1000;
    fillProgresBar(canvas, 1);
  } else if (rowsCleared == 3) {
    score += 500;
    fillProgresBar(canvas, 0.5);
  } else if (rowsCleared == 2) {
    score += 300;
    fillProgresBar(canvas, 0.3);
  } else if (rowsCleared == 1) {
    score += 100;
    fillProgresBar(canvas, 0.1);
  }
  scoreDisplay.forEach((display) => (display.innerHTML = score));
  addLevel();
}

//Game Movement

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
  } else if (e.keyCode === 16) {
    moveDownFast();
  }
}

document.addEventListener("keyup", control);

//mmove down function

function moveDown() {
  if (!timerId) return;
  if (isAnimating) return;

  if (
    !current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    undraw();
    currentPosition += width;
    draw();
  } else {
    freeze();
  }
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
  if (!timerId || isAnimating) return;
  undraw();

  let nextRotation = (currentRotation + 1) % current.length; // Determine the next rotation index
  let nextTetromino = theTetrominoes[random][nextRotation]; // Get the next rotation shape

  // Check if the rotation is valid

  const isValid = nextTetromino.some((index) => {
    const newPosition = currentPosition + index;
    const position = newPosition % width;
    const isAtLeftEdge = position === 0;
    const isAtRightEdge = position === width - 1;

    if (isAtLeftEdge && index % width > 0) {
      // Checks if it's on the left edge and the part of the tetromino is not the first block
      return true;
    }
    if (isAtRightEdge) {
      // Checks if any part of the tetromino after rotation will exceed the right edge
      return nextTetromino.some(
        (index) => (currentPosition + index) % width === 0
      );
    }

    if (squares[newPosition]?.classList.contains("taken")) {
      return true;
    }

    return false;
  });

  // Apply the rotation if it's valid
  if (!isValid) {
    currentRotation = nextRotation;
    current = nextTetromino;
  }

  draw(); //
}

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

// Movement for mobile by touching

let startX = 0;
let startY = 0;

let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;

let longPressTimer;
let isLongPress = false;

// Save coordinates when touch starts
document.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault(); // Prevent the default movements like scrolling, page reload etc.. While moving
    if (isPaused) return;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    touchStartTime = new Date().getTime();
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    isLongPress = false;
    longPressTimer = setTimeout(() => {
      isLongPress = true;
    }, 300);
  },
  { passive: false }
);

// Follow the movement of finger
document.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    if (isPaused) return;
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    // Count the direction of move
    const diffX = currentX - startX;
    const diffY = currentY - startY;

    // Movement direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 2 || diffY > 2) {
        clearTimeout(longPressTimer);
        isLongPress = false;
      }
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
  },
  { passive: false }
);

// When you tap screen it rotates Tetromnino
document.addEventListener("touchend", (e) => {
  if (isPaused) return;
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

  // If touch long, move fast down
  clearTimeout(longPressTimer);
  if (isLongPress) {
    moveDownFast();
    isLongPress = false;
  }
});

// Move Fast Down functio and leave animation behind when falling.

async function moveDownFast() {
  if (isPaused || isGameOver) return;
  undraw();

  let newPosition = currentPosition;
  while (
    !current.some((index) =>
      squares[newPosition + index + width].classList.contains("taken")
    )
  ) {
    newPosition += width;
  }

  let position = currentPosition;
  while (position < newPosition) {
    current.forEach((index) => {
      const trailSquare = squares[position + index];
      const trailDiv = document.createElement("div");
      trailDiv.style.backgroundColor = colors[random];
      trailDiv.className = "tetromino-trail";
      trailSquare.appendChild(trailDiv);
    });
    position += width;
  }

  currentPosition = newPosition;
  draw();
  freeze();

  await sleep(500);

  squares.forEach((square) => {
    while (square.firstChild) {
      square.removeChild(square.firstChild);
    }
  });
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
    updateLeaderboard(score, level, timeElapsed);
  }
}

// Reset gameboard. Remove all tetromoinos from gameboard, mini display and assigned animations from them.

function resetGame() {
  squares.forEach((square, i) => {
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

    if (i >= 200) {
      square.classList.add("taken");
    }
  });

  displaySquares.forEach((square) => {
    square.classList.remove("tetromino");
    square.style.backgroundColor = "";
  });
}

// Start Game. Function that start the tetromino drop

let timerId;
let timerInterval;

function startGame() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  // if (autoDropTimeoutId) {
  //   clearTimeout(autoDropTimeoutId);
  //   autoDropTimeoutId = null;
  // }
  draw();
  if (!nextRandom) {
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  }
  updateGlowColor();
  timerId = setInterval(moveDown, 1000);
  // autoDrop();
  timerInterval = setInterval(updateTimer, 1000);
  displayShape();
  backgroundMusic.play();
  isPaused = false;
  isGameOver = false;
  isLongPress = false;
}

//  Pause Game

function pauseGame() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  // if (autoDropTimeoutId) {
  //   clearTimeout(autoDropTimeoutId);
  //   autoDropTimeoutId = null;
  // }

  backgroundMusic.pause();
  isPaused = true;
}

// Make the speed of tetromino and music faster when level changes

let newInterval = 1000;
let currentPlaybackRate = 1.0;

function updateSpeedAndMusic() {
  newInterval = Math.max(newInterval * 0.95, 100); // Limit to a minimum of 100ms

  clearInterval(timerId);

  timerId = setInterval(moveDown, newInterval);

  currentPlaybackRate = Math.min(currentPlaybackRate / 0.99, 2.5);
  backgroundMusic.playbackRate = currentPlaybackRate;
}

// Inceare Level points by 1 every 1000 Score

const nextLevelButton = document.querySelector(".nextLevelButton");
const levelText = document.querySelector(".levelText");
let level1 = 1000;
let level = 1;

async function addLevel() {
  if (score >= level1) {
    level++;
    level1 += 1000;
    score = 0;
    levelDisplay.forEach((display) => (display.innerHTML = level));
    scoreDisplay.forEach((display) => (display.innerHTML = score));
    full.pause();
    hit.pause();
    isAnimating = true;
    levelCompletedAnimation();
    pauseGame();
    await sleep(3000);
    resetGame();
    nextLevel();
  }
}

// Animation for level completed

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

// Go to next level when next level button is pushed and game starts automatically.

function nextLevel() {
  nextLevelButton.classList.remove("hidden");
  nextLevelButton.classList.add("flex");

  nextLevelButton.addEventListener("click", function () {
    isAnimating = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentFillPercentage = 0;
    targetFillPercentage = 0;

    nextLevelButton.classList.add("hidden");
    nextLevelButton.classList.remove("flex");
    levelText.classList.add("hidden");
    levelText.classList.remove("flex");
    startGame();
    updateSpeedAndMusic();
  });
}

// Timer for the Game Time

let timeElapsed = 0;

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
  let leaderboard = getLeaderboard();

  // Update current game scores to list
  leaderboard.push({ score, level, timeElapsed });

  // sort levels by highest level to down
  leaderboard.sort((a, b) => {
    if (b.level !== a.level) {
      return b.level - a.level;
    } else if (b.score !== a.score) {
      return b.score - a.score; // Higher scores first
    } else {
      return a.timeElapsed - b.timeElapsed; // Lower times first if scores are the same
    }
  });

  // Show only top 10
  leaderboard = leaderboard.slice(0, 10);

  // save the updated list to logal storage
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  displayLeaderboard();
}

// Show leaderboardlist on HTML
function displayLeaderboard() {
  const leaderboard = getLeaderboard();
  const leaderboardList = document.getElementById("leaderboard-list");
  if (!leaderboardList) return;

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

//Audio for game in array. This is for volume control in PC.

const audio = [
  document.getElementById("backgroundMusic"),
  document.getElementById("full"),
  document.getElementById("gameVoice"),
  document.getElementById("hit"),
  document.getElementById("levelChange"),
  document.getElementById("gameEndMusic"),
  document.getElementById("tetris"),
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

// Progresbar that fills when gets score

const canvas = document.getElementById("progresBar");
const ctx = canvas.getContext("2d");

let currentFillPercentage = 0;
let targetFillPercentage = 0;
let animationSpeed = 0.005;

function fillProgresBar(canvas, additionalPercentage) {
  canvas.getContext("2d");

  // Scale down progress increase based on current level
  const adjustedPercentage = additionalPercentage / level;

  targetFillPercentage += adjustedPercentage;

  if (targetFillPercentage > 1) {
    targetFillPercentage = 1;
  }

  animateProgressBar();
}

//  animation that slowly fills the progresbar
function animateProgressBar() {
  if (currentFillPercentage < targetFillPercentage) {
    currentFillPercentage += animationSpeed;

    if (currentFillPercentage > targetFillPercentage) {
      currentFillPercentage = targetFillPercentage;
    }

    drawProgressBar();
    requestAnimationFrame(animateProgressBar);
  }
}

// Draw progresBar
function drawProgressBar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Tyhjennä vanha

  const fillHeight = canvas.height * currentFillPercentage;
  const y = canvas.height - fillHeight;

  const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);

  gradient.addColorStop(0, "#1E90FF"); // Start color
  gradient.addColorStop(1, "#00BFFF");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, y, canvas.width, fillHeight);
}

// Show the glow of the color that is coming next

function updateGlowColor() {
  const nextColor = colors[nextRandom];
  grid.style.boxShadow = `0 0 5px 4px ${nextColor}, 0 0 5px 4px ${nextColor}`;
}

// Bot that plays the tetris

// let autoDropTimeoutId;

// function autoDrop() {
//   moveDownFast();
//   autoDropTimeoutId = setTimeout(autoDrop, 2000); // Adjust the timing to control the speed of the drop
// }
