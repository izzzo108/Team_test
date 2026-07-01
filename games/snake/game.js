// Классическая змейка. Использует общий движок из /shared
// (Engine.loop, Engine.Input, Engine.Canvas).

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const TILE = 16;
const COLS = canvas.width / TILE;
const ROWS = canvas.height / TILE;
const TICK_INTERVAL = 0.12; // сек между шагами змейки
const GAME_OVER_PAUSE = 1.5; // сек паузы перед автоматическим рестартом

const COLORS = {
  background: "#1c1c28",
  grid: "#26263a",
  snake: "#7ee787",
  snakeHead: "#a6f3b8",
  food: "#ff6b6b",
  text: "#f0f0f5",
};

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

let snake;
let direction;
let pendingDirection;
let food;
let score;
let tickTimer;
let gameOver;
let gameOverTimer;

resetGame();

function resetGame() {
  const startX = Math.floor(COLS / 2);
  const startY = Math.floor(ROWS / 2);
  snake = [
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
    { x: startX - 3, y: startY },
  ];
  direction = DIRECTIONS.right;
  pendingDirection = direction;
  score = 0;
  scoreEl.textContent = score;
  tickTimer = TICK_INTERVAL;
  gameOver = false;
  gameOverTimer = 0;
  food = randomFreeTile();
}

function randomFreeTile() {
  let tile;
  do {
    tile = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((seg) => seg.x === tile.x && seg.y === tile.y));
  return tile;
}

function isOpposite(a, b) {
  return a.dx === -b.dx && a.dy === -b.dy;
}

function readDirectionInput() {
  const { Input } = window.Engine;
  let next = null;
  if (Input.isAnyDown(["ArrowUp", "w"])) next = DIRECTIONS.up;
  else if (Input.isAnyDown(["ArrowDown", "s"])) next = DIRECTIONS.down;
  else if (Input.isAnyDown(["ArrowLeft", "a"])) next = DIRECTIONS.left;
  else if (Input.isAnyDown(["ArrowRight", "d"])) next = DIRECTIONS.right;

  if (next && !isOpposite(next, direction)) {
    pendingDirection = next;
  }
}

function step() {
  direction = pendingDirection;
  const head = snake[0];
  const newHead = { x: head.x + direction.dx, y: head.y + direction.dy };

  const hitsWall =
    newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS;
  const hitsSelf = snake.some(
    (seg) => seg.x === newHead.x && seg.y === newHead.y
  );

  if (hitsWall || hitsSelf) {
    gameOver = true;
    return;
  }

  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    score += 1;
    scoreEl.textContent = score;
    food = randomFreeTile();
  } else {
    snake.pop();
  }
}

function update(dt) {
  if (gameOver) {
    gameOverTimer += dt;
    if (gameOverTimer >= GAME_OVER_PAUSE) resetGame();
    return;
  }

  readDirectionInput();

  tickTimer -= dt;
  if (tickTimer > 0) return;
  tickTimer = TICK_INTERVAL;
  step();
}

function render() {
  const { Canvas } = window.Engine;
  Canvas.clear(ctx, COLORS.background, canvas.width, canvas.height);
  Canvas.drawGrid(ctx, TILE, COLS, ROWS, COLORS.grid);
  Canvas.drawTile(ctx, TILE, food.x, food.y, COLORS.food);

  snake.forEach((seg, i) => {
    Canvas.drawTile(ctx, TILE, seg.x, seg.y, i === 0 ? COLORS.snakeHead : COLORS.snake);
  });

  if (gameOver) {
    ctx.fillStyle = COLORS.text;
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Игра окончена", canvas.width / 2, canvas.height / 2);
  }
}

window.Engine.loop({ update, render });
