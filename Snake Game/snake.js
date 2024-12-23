const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");

const startBtn = document.getElementById("start");

const timerDisplay = document.getElementById("timer");

let timerId;

let timerInterval;

let timeElapsed = 0;

const boxSize = 20;
let snake = [{ x: 20, y: 200 }]; // Snake starting position
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * 20) * boxSize,
  y: Math.floor(Math.random() * 20) * boxSize,
};
let score = 0;

const foodImage = new Image();
foodImage.src = "/Snake Game/images/apple.png";

// Movement logig
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "lime" : "green";
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });
}

function drawFood() {
  ctx.drawImage(foodImage, food.x, food.y, boxSize + 8, boxSize + 8);
}

// add 1 point to score everytime food is eaten

function addScore(head) {
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.innerHTML = score;
    food = {
      x: Math.floor(Math.random() * 20) * boxSize,
      y: Math.floor(Math.random() * 20) * boxSize,
    };
  } else {
    snake.pop();
  }
}

// add start and pause for game

startBtn.addEventListener("click", () => {
  if (timerId) {
    // Pause the game
    clearInterval(timerId);
    clearInterval(timerInterval);
    timerId = null;
    timerInterval = null;
  } else {
    // Start the game
    timerId = setInterval(updateGame, 100);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
  }
});

// Timer for the game time

function updateTimer() {
  timeElapsed += 1;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  timerDisplay.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

// Move snake

function moveSnake() {
  let head = { ...snake[0] };
  if (direction === "UP") head.y -= boxSize;
  if (direction === "DOWN") head.y += boxSize;
  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "RIGHT") head.x += boxSize;

  snake.unshift(head);

  addScore(head);

  // check hit on wall or snake
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    checkCollision()
  ) {
    gameOver();
  }
}

function checkCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  moveSnake();
  drawSnake();
}

function gameOver() {
  clearInterval(timerId);
  clearInterval(timerInterval);
  timerId = null;
  resetGame();
}

function resetGame() {
  snake = [{ x: 20, y: 200 }];
  direction = "RIGHT";
  score = 0;
  scoreDisplay.innerHTML = score;
  timeElapsed = 0;
  timerDisplay.innerHTML = "00:00";
  food = {
    x: Math.floor(Math.random() * 20) * boxSize,
    y: Math.floor(Math.random() * 20) * boxSize,
  };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
}

drawFood();
drawSnake();
