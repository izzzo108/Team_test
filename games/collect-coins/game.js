// Мини пиксель-арт игра: собери как можно больше "монеток".
// Использует общий движок из /shared (Engine.loop, Engine.Input, Engine.Canvas).

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const TILE = 16;
const COLS = canvas.width / TILE;
const ROWS = canvas.height / TILE;

const COLORS = {
  background: "#1c1c28",
  grid: "#26263a",
  player: "#7ee787",
  coin: "#ffd23f",
};

const player = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) };
let coin = randomEmptyTile();
let score = 0;
let moveTimer = 0;
const MOVE_INTERVAL = 0.12; // сек между шагами при зажатой клавише

function randomEmptyTile() {
  let tile;
  do {
    tile = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (tile.x === player.x && tile.y === player.y);
  return tile;
}

function movePlayer(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;

  player.x = nx;
  player.y = ny;

  if (player.x === coin.x && player.y === coin.y) {
    score += 1;
    scoreEl.textContent = score;
    coin = randomEmptyTile();
  }
}

function readMove() {
  const { Input } = window.Engine;
  if (Input.isAnyDown(["ArrowUp", "w"])) return [0, -1];
  if (Input.isAnyDown(["ArrowDown", "s"])) return [0, 1];
  if (Input.isAnyDown(["ArrowLeft", "a"])) return [-1, 0];
  if (Input.isAnyDown(["ArrowRight", "d"])) return [1, 0];
  return null;
}

function update(dt) {
  moveTimer -= dt;
  if (moveTimer > 0) return;

  const move = readMove();
  if (!move) return;

  movePlayer(move[0], move[1]);
  moveTimer = MOVE_INTERVAL;
}

function render() {
  const { Canvas } = window.Engine;
  Canvas.clear(ctx, COLORS.background, canvas.width, canvas.height);
  Canvas.drawGrid(ctx, TILE, COLS, ROWS, COLORS.grid);
  Canvas.drawTile(ctx, TILE, coin.x, coin.y, COLORS.coin);
  Canvas.drawTile(ctx, TILE, player.x, player.y, COLORS.player);
}

window.Engine.loop({ update, render });
