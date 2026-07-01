// Общий помощник клавиатурного ввода. Обычный <script>, без модулей.
window.Engine = window.Engine || {};

window.Engine.Input = (function () {
  const pressed = new Set();

  window.addEventListener("keydown", (e) => pressed.add(e.key));
  window.addEventListener("keyup", (e) => pressed.delete(e.key));

  return {
    // isDown("ArrowUp") / isDown("w")
    isDown(key) {
      return pressed.has(key);
    },
    // isAnyDown(["ArrowUp", "w"]) — удобно для WASD + стрелки одновременно
    isAnyDown(keys) {
      return keys.some((key) => pressed.has(key));
    },
  };
})();
