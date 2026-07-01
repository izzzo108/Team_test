(function () {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const overlayTitle = overlay.querySelector('.overlay-title');
  const overlayHint = overlay.querySelector('.overlay-hint');
  const startBtn = document.getElementById('startBtn');
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');

  const W = canvas.width;
  const H = canvas.height;
  const WALL_H = 10;

  const COLORS = {
    bg: '#241407',
    wall: '#6b4226',
    wallShadow: '#3b2415',
    paddle: '#3e5c3a',
    paddleEdge: '#2a3f27',
    ball: '#d4af37',
    ballShadow: '#8a6d1f'
  };

  const paddle = { w: 34, h: 7, x: (W - 34) / 2, y: H - 18, speed: 3.2 };
  const ball = { x: 0, y: 0, size: 5, vx: 0, vy: 0, speed: 1.9 };

  let score = 0;
  let lives = 3;
  let state = 'idle'; // idle | serve | playing | gameover
  const keys = { left: false, right: false };

  function resetBallToServe() {
    ball.x = paddle.x + paddle.w / 2 - ball.size / 2;
    ball.y = paddle.y - ball.size - 1;
    ball.vx = 0;
    ball.vy = 0;
  }

  function launchBall() {
    const dir = Math.random() < 0.5 ? -1 : 1;
    ball.vx = dir * (0.6 + Math.random() * 0.6);
    ball.vy = -ball.speed;
    state = 'playing';
  }

  function updateHud() {
    scoreEl.textContent = String(score);
    livesEl.textContent = '❤'.repeat(Math.max(lives, 0)) + '♡'.repeat(Math.max(3 - lives, 0));
  }

  function showOverlay(title, hint, btnLabel) {
    overlayTitle.textContent = title;
    overlayHint.innerHTML = hint;
    startBtn.textContent = btnLabel;
    overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
  }

  function startNewGame() {
    score = 0;
    lives = 3;
    paddle.x = (W - paddle.w) / 2;
    updateHud();
    hideOverlay();
    state = 'serve';
    resetBallToServe();
  }

  startBtn.addEventListener('click', function () {
    if (state === 'idle' || state === 'gameover') {
      startNewGame();
    } else if (state === 'serve') {
      hideOverlay();
      launchBall();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') {
      e.preventDefault();
      if (state === 'serve') launchBall();
    }
  });
  document.addEventListener('keyup', function (e) {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
  });

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    paddle.x = Math.min(Math.max(mouseX - paddle.w / 2, 0), W - paddle.w);
  });

  function update() {
    if (keys.left) paddle.x -= paddle.speed;
    if (keys.right) paddle.x += paddle.speed;
    paddle.x = Math.min(Math.max(paddle.x, 0), W - paddle.w);

    if (state === 'serve') {
      resetBallToServe();
      return;
    }
    if (state !== 'playing') return;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x <= 0) {
      ball.x = 0;
      ball.vx *= -1;
    } else if (ball.x + ball.size >= W) {
      ball.x = W - ball.size;
      ball.vx *= -1;
    }

    if (ball.y <= WALL_H) {
      ball.y = WALL_H;
      ball.vy *= -1;
    }

    if (
      ball.vy > 0 &&
      ball.y + ball.size >= paddle.y &&
      ball.y + ball.size <= paddle.y + paddle.h + 6 &&
      ball.x + ball.size >= paddle.x &&
      ball.x <= paddle.x + paddle.w
    ) {
      ball.y = paddle.y - ball.size;
      const hitPos = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      ball.vx = hitPos * 2.2;
      ball.vy = -Math.abs(ball.vy) - 0.05;
      if (Math.abs(ball.vy) > 4) ball.vy = -4;
      score += 1;
      updateHud();
    }

    if (ball.y > H) {
      lives -= 1;
      updateHud();
      if (lives <= 0) {
        state = 'gameover';
        showOverlay('ПОРАЖЕНИЕ', 'Счёт: ' + score + '<br>Стена оказалась сильнее...', 'Начать заново');
      } else {
        state = 'serve';
        resetBallToServe();
        showOverlay('ЖИЗНЬ ПОТЕРЯНА', 'Осталось жизней: ' + lives + '<br>Нажми ПРОБЕЛ или кнопку, чтобы подать мяч', 'Подать мяч');
      }
    }
  }

  function drawPixelRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function render() {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    drawPixelRect(0, 0, W, WALL_H, COLORS.wall);
    drawPixelRect(0, WALL_H - 3, W, 3, COLORS.wallShadow);
    for (let i = 0; i < W; i += 8) {
      drawPixelRect(i, 0, 4, WALL_H - 3, COLORS.wallShadow);
    }

    drawPixelRect(paddle.x, paddle.y, paddle.w, paddle.h, COLORS.paddle);
    drawPixelRect(paddle.x, paddle.y + paddle.h - 2, paddle.w, 2, COLORS.paddleEdge);

    drawPixelRect(ball.x, ball.y, ball.size, ball.size, COLORS.ball);
    drawPixelRect(ball.x, ball.y + ball.size - 2, ball.size, 2, COLORS.ballShadow);
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  resetBallToServe();
  updateHud();
  showOverlay('PIXEL SQUASH', '← → или мышь — двигать ракетку<br>ПРОБЕЛ — подать мяч', 'Начать бой');
  requestAnimationFrame(loop);
})();
