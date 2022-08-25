const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const replayBtn = document.getElementById('replay');
const ctx = canvas.getContext('2d');
const replay = document.getElementById('overlay');

let score = 0;
let highScore = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

//create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

//Create Paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

//Create Brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 80,
  visible: true,
};

//Create Bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//Draw a ball on Canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
  ctx.fillStyle = '#ed1f1f';
  ctx.fill();
  ctx.closePath();
}

//Draw paddle on the Canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#c46210';
  ctx.fill();
  ctx.closePath();
}

//Draw score on Canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
  ctx.fillText(`Highsore: ${highScore}`, canvas.width - 127, 50);
}

//Draw bricks on Canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#c46210' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}
//Move ball on the Canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Wall Collision on X axis
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  //Wall Collision (top & Bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Handling paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    score = 0;
    showAllBricks();
    ball.dy = 0;
    ball.dx = 0;
    replay.classList.remove('hide');
    replay.classList.add('unhide');
  }
}

//Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  //Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//Draw Everything
function draw() {
  //Clear Canvas

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function update() {
  movePaddle();
  moveBall();
  //Draw everything
  draw();
  requestAnimationFrame(update);
}

update();
//keydown event
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

function replayGame() {
  replay.style.display = 'none';
  ball.dx = 4;
  ball.dy = -4;
}

//Keyboard event handling
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
replayBtn.addEventListener('click', replayGame);
