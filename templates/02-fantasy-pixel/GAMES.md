# Как добавить игру на сайт

Привет! Это гайд для того, кто добавляет новую игру в `Pixel Quest Guild`.

## Структура

Каждая игра — отдельная папка в `games/`:

```
games/
  pixel-squash/       <- пример (тенис от стены)
    index.html
    game.js
    page.css
```

## Шаги

1. Создай папку `games/<название-игры>/`.
2. Скопируй `games/pixel-squash/index.html` и `page.css` как основу — там уже подключены шрифты, `../../style.css` и обёртка страницы (`.game-page`, `.back-link`).
3. Замени содержимое `<canvas>` / игровую разметку и напиши свою логику в `game.js`.
4. Используй общие переменные и классы из корневого `style.css`, чтобы игра выглядела частью сайта:
   - Цвета: `--wood`, `--parchment`, `--parchment-2`, `--green`, `--gold`, `--ink`.
   - Рамки: класс `.pixel-frame` + вложенный `.pixel-frame-inner` — рубленые пиксельные углы, никаких скруглений/градиентов.
   - Шрифты: `Press Start 2P` для заголовков/кнопок, `VT323` для текста.
   - Для canvas-игр держи низкое внутреннее разрешение (например 160×200) и растягивай через CSS с `image-rendering: pixelated`.
5. Добавь ссылку "← Назад в гильдию" на `../../index.html#games`.
6. Добавь карточку своей игры в `index.html` (секция `#games`, блок `.games-grid`) — замени один из `game-card empty` слотов:

```html
<a href="games/<название-игры>/index.html" class="pixel-frame game-card">
  <div class="pixel-frame-inner">
    <div class="game-card-icon">🔥</div>
    <h3>Название игры</h3>
    <p>Короткое описание в одно предложение.</p>
    <span class="play-tag">▶ Играть</span>
  </div>
</a>
```

Готово — игра появится на доске.
