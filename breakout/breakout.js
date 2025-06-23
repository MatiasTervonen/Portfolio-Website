const canvas = document.getElementById("game-board"); // get the canvas element
const ctx = canvas.getContext("2d"); // Tool to write on the canvas

// define the starting point instead of hard coding it.

let x = canvas.width / 2;
let y = canvas.height - 30;

// add little value to coordinates after every frame

let dx = 2;
let dy = -2;

// Radius of the ball/circle

const ballRadius = 10;

// paddle that hits the ball

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// right and left movement variables

let rightPressed = false;
let leftPressed = false;

let interval = 0;

// Variables for bricks

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;

let lives = 3;

// Loop through colums and rows and create new bricks

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Draw brick on canvas

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      if (bricks[c][r].status === 1) {
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// draw ball on canvas

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // draw ball. x,y coordinates where ball is. 10 = radius of the circle, 0 start angle and math.PI * 2 end angle. (makes perfect circle)
  ctx.fillStyle = "#0095DD"; // Color of the ball
  ctx.fill(); // fills the ball with color
  ctx.closePath();
}

// draw paddle on canvas

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// move the ball on canvas. By drawinng it on different postion on every frame.

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Empty the canvas from everything
  drawBricks(); // draw bricks
  drawBall(); // draw ball
  drawPaddle(); // draw paddle
  collisionDetection(); // Check if ball hits brick
  drawScore(); // add scrore every time brick is hit
  drawLives(); // add lives

  // move paddle 7px right and left when keys are pushed

  if (rightPressed) {
    paddleX = Math.min(paddleX + 4, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 4, 0);
  }

  // Bounce ball from left and right walls

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // Bounce ball from top and bottom walls and from paddle. if missed game over alert

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  x += dx; // add little value to coordinates where ball is.
  y += dy;
  requestAnimationFrame(draw);
}

// Event listeners if right or left key is pushed

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Event listener for mouse movements

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// function if key is pushed down

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

// function if key is released

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// check if the ball hits brick

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// draw score on canvas

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// draw live on canvas

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// Start Game function. Ball will be painted on different postion every 10 ms

function startGame() {
  draw();
}

// Add button to start game

const start = document.getElementById("start-game");

start.addEventListener("click", () => {
  startGame();
  start.disabled = true; // prevent clicking start button again after game is started
});
