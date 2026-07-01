// Мини пиксель-арт игра: собери как можно больше "монеток".
// Это отправная точка для команды — расширяйте геймплей как захотите.

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

const KEY_MOVES = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
};

window.addEventListener("keydown", (event) => {
  const move = KEY_MOVES[event.key];
  if (!move) return;
  event.preventDefault();
  movePlayer(move[0], move[1]);
});

function drawGrid() {
  ctx.strokeStyle = COLORS.grid;
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * TILE, 0);
    ctx.lineTo(x * TILE, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * TILE);
    ctx.lineTo(canvas.width, y * TILE);
    ctx.stroke();
  }
}

function drawTile(tile, color) {
  ctx.fillStyle = color;
  ctx.fillRect(tile.x * TILE + 2, tile.y * TILE + 2, TILE - 4, TILE - 4);
}

function render() {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawTile(coin, COLORS.coin);
  drawTile(player, COLORS.player);

  requestAnimationFrame(render);
}

render();
