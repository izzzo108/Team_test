// Реестр игр сайта. Чтобы добавить свою игру — допишите один объект сюда
// и создайте папку games/<slug>/ (подробности в GAMES.md). Больше нигде
// регистрировать игру не нужно.
const GAMES = [
  {
    slug: "collect-coins",
    icon: "🪙",
    title: "Собери монетки",
    description: "Первая игра проекта — ходи по сетке и собирай монетки.",
  },
];

function renderGames() {
  const list = document.getElementById("games-list");
  list.innerHTML = GAMES.map(
    (game) => `
      <a class="game-card" href="games/${game.slug}/index.html">
        <div class="icon">${game.icon}</div>
        <h3>${game.title}</h3>
        <p>${game.description}</p>
        <span class="play-tag">▶ Играть</span>
      </a>
    `
  ).join("");
}

renderGames();
