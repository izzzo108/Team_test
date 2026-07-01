# Как добавить игру на сайт

Каждая игра — отдельная папка в `games/<slug>/`. Это специально сделано так, чтобы
разные участники команды могли делать разные игры одновременно, в разных ветках,
не задевая чужие файлы и не создавая конфликтов в git.

## Структура одной игры

```
games/<slug>/
  index.html   # своя страница игры
  game.js      # вся логика игры
  style.css    # стили именно этой игры (можно оставить почти пустым)
```

`<slug>` — короткое имя латиницей через дефис, например `tractor-road`.

## Общий мини-движок (`/shared`)

Чтобы не копировать одно и то же в каждую игру, есть общие хелперы — обычные
`<script>`, без сборки и модулей:

- `shared/loop.js` — `Engine.loop({ update, render })`, игровой цикл на `requestAnimationFrame`.
- `shared/input.js` — `Engine.Input.isDown("ArrowUp")` / `Engine.Input.isAnyDown([...])`.
- `shared/canvas.js` — `Engine.Canvas.clear/drawTile/drawGrid` — пиксельные хелперы для canvas.
- `shared/game.css` — общий каркас страницы игры (`.game-page`, `.back-link`, `.hud`, стили canvas).

Использовать их необязательно — если вашей игре они не подходят, пишите как удобно.
Но если структура похожа на `games/collect-coins`, они сэкономят время.

## Шаги, чтобы добавить новую игру

1. Создайте папку `games/<slug>/` и три файла: `index.html`, `game.js`, `style.css`.
   Проще всего скопировать `games/collect-coins/` как основу и переписать логику.
2. В `index.html` подключите (при желании) `../../shared/game.css` и нужные
   `shared/*.js`, затем свой `style.css` и `game.js` — как в примере ниже.
3. Добавьте свою игру в реестр `games.js` в корне проекта — один объект в массиве
   `GAMES`:

   ```js
   {
     slug: "tractor-road",
     icon: "🚜",
     title: "Трактор на дороге",
     description: "Веди трактор по дороге и объезжай ямы.",
   }
   ```

   Это единственное место в корне, которое вы трогаете — конфликт с чужой игрой
   тут маловероятен (разные строки одного массива).
4. Готово — карточка появится на главной странице (`index.html`) автоматически.

## Пример `index.html` для новой игры

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Название игры — Pixel Team Games</title>
  <link rel="stylesheet" href="../../shared/game.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body class="game-page">
  <a class="back-link" href="../../index.html">← Все игры</a>
  <div class="game-header">
    <h1>Название игры</h1>
  </div>
  <canvas id="game" width="320" height="240"></canvas>

  <script src="../../shared/loop.js"></script>
  <script src="../../shared/input.js"></script>
  <script src="../../shared/canvas.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

## Тема сайта — не трогайте её ради своей игры

Цвета шапки/меню сайта живут в `/theme.css`, а не в играх. Игры используют только
`/shared/game.css` и свой `style.css`. Так смена дизайна сайта (см. `templates/`)
не требует переписывать игры, а работа над игрой не требует трогать общую тему.
