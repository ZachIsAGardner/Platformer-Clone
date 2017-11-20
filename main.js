const Game = require('./lib/game.js');
const TileEditor = require('./lib/tile_editor.js');

const canvasBG = document.getElementById("background-canvas");
const canvasMain = document.getElementById("main-canvas");
const canvasEntities = document.getElementById("entities-canvas");
const canvasFG = document.getElementById("foreground-canvas");
const canvasUI = document.getElementById("ui-canvas");
let canvases = {
  bg: canvasBG,
  main: canvasMain,
  entities: canvasEntities,
  fg: canvasFG,
  ui: canvasUI
};

const volume = document.getElementById('volume');

Object.entries(canvases).forEach((key) => {
  key[1].width = 768;
  key[1].height = 588;
});

new Game(canvases, volume);
// new TileEditor(canvases);
