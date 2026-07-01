// Общие пиксель-хелперы для canvas. Обычный <script>, без модулей.
window.Engine = window.Engine || {};

window.Engine.Canvas = {
  clear(ctx, color, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  },

  // Прямоугольник с небольшим отступом внутри клетки — для "пиксельного" вида на сетке.
  drawTile(ctx, tileSize, tileX, tileY, color, padding = 2) {
    ctx.fillStyle = color;
    ctx.fillRect(
      tileX * tileSize + padding,
      tileY * tileSize + padding,
      tileSize - padding * 2,
      tileSize - padding * 2
    );
  },

  drawGrid(ctx, tileSize, cols, rows, color) {
    ctx.strokeStyle = color;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize, 0);
      ctx.lineTo(x * tileSize, rows * tileSize);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * tileSize);
      ctx.lineTo(cols * tileSize, y * tileSize);
      ctx.stroke();
    }
  },
};
