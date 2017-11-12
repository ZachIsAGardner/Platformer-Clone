const Game = require('./lib/game.js');

const canvasEl = document.getElementsByTagName("canvas")[0];

// canvasEl.width = window.innerWidth;
// canvasEl.height = window.innerHeight;
canvasEl.width = 768;
canvasEl.height = 588;

new Game(canvasEl);
