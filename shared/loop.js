// Общий игровой цикл. Подключать как обычный <script>, без сборки/модулей —
// чтобы проект открывался двойным кликом по index.html без локального сервера.
window.Engine = window.Engine || {};

// loop({ update, render }) — update(dt) обновляет состояние, render() рисует кадр.
window.Engine.loop = function loop({ update, render }) {
  let last = performance.now();

  function frame(now) {
    const dt = (now - last) / 1000;
    last = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
};
