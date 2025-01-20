const canvas = document.getElementById("gameBoard");

const ctx = canvas.getContext("2d");

const timerDisplay = document.getElementById("timer");

const scoreDisplay = document.getElementById("score");

canvas.width = 400;

canvas.height = 400;

const square = 20; // width of one square on gameBoard

let snake = [{ x: 20, y: 200 }]; // snake starting position

let direction = "RIGHT"; // Track the moving direction

let timerId;

let timeElapsed = 0;

let timerInterval;

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = "lime";
    } else {
      ctx.fillStyle = "green";
    }
    ctx.fillRect(segment.x, segment.y, square, square);
  });

  if (checkCollision()) {
    gameOver(); //
  }
}

const foodImage = new Image();
foodImage.src = "/Snake Game/images/apple.png";

let food = {
  x: Math.floor(Math.random() * (canvas.width / square)) * square,
  y: Math.floor(Math.random() * (canvas.height / square)) * square,
};

function drawFood() {
  ctx.drawImage(foodImage, food.x, food.y, square, square);
}

function undrawFood() {
  ctx.clearRect(food.x, food.y, square, square);
}

let score = 0;

function addScore() {
  // if saneke head is in same place than food add score
  if (snake[0].x === food.x && snake[0].y === food.y) {
    score += 200;
    scoreDisplay.innerHTML = score;

    // Check food dosent overlap the the snake when its drwan again.
    while (true) {
      // Draw food in a new random location
      food = {
        x: Math.floor(Math.random() * (canvas.width / square)) * square,
        y: Math.floor(Math.random() * (canvas.height / square)) * square,
      };

      const overlaps = snake.some((segment) => {
        return segment.x === food.x && segment.y === food.y;
      });

      if (!overlaps) {
        drawFood();
        break; // Exit the while loop if no overlaps
      } else {
        undrawFood();
      }
    }

    // add new segment to snake
    let newSegment = { ...snake[snake.length - 1] };
    snake.push(newSegment);
  }
}

// movement PC

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  }
  if (event.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  }
  if (event.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  }
  if (event.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  }
});

function moveSnake() {
  // Loop through segments of snake, expect head. Add every segment one index higher.
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = { ...snake[i - 1] };
  }

  if (direction === "RIGHT") {
    snake[0].x += square;
  }
  if (direction === "LEFT") {
    snake[0].x -= square;
  }
  if (direction === "UP") {
    snake[0].y -= square;
  }
  if (direction === "DOWN") {
    snake[0].y += square;
  }
}

let startX = 0;
let startY = 0;

// Movement mobile

document.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const currentX = touch.clientX;
  const currentY = touch.clientY;

  // Count the direction of move
  const diffX = currentX - startX;
  const diffY = currentY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal movement
    if (diffX > 30 && direction !== "LEFT") {
      direction = "RIGHT";
      startX = currentX;
    } else if (diffX < -30 && direction !== "RIGHT") {
      direction = "LEFT";
      startX = currentX;
    }
  } else {
    // Vertical movement
    if (diffY > 30 && direction !== "UP") {
      direction = "DOWN";
      startY = currentY;
    } else if (diffY < -30 && direction !== "DOWN") {
      direction = "UP";
      startY = currentY;
    }
  }
});

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  addScore();
  drawFood();
  moveSnake();
  drawSnake();
}

function checkCollision() {
  // Check wall collision
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    return true;
  }

  // Check snake collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

// start and pause game

const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
  if (timerId) {
    pauseGame();
  } else {
    startGame();
  }
});

function startGame() {
  clearInterval(timerId);
  clearInterval(timerInterval);
  updateGame();
  timerId = setInterval(updateGame, 100);
  timerInterval = setInterval(updateTimer, 1000);
  score = 0;
  isPaused = false;
}

let isPaused = false;

function pauseGame() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isPaused = true;
}

function gameOver() {
  clearInterval(timerId);
  clearInterval(timerInterval);
  timerId = null;
  timerInterval = null;
  resetGame();
}

function resetGame() {
  isPaused = true;
  snake = [{ x: 20, y: 200 }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * 20) * square,
    y: Math.floor(Math.random() * 20) * square,
  };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Timer for the game time

function updateTimer() {
  timeElapsed += 1;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  timerDisplay.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function resizeCanvas() {
  canvas.width = window.innerWidth; // Match the width of the viewport
  canvas.height = window.innerHeight; // Match the height of the viewport
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
