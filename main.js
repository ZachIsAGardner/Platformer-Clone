const Game = require('./lib/game.js');
const TileEditor = require('./lib/tile_editor.js');
const Input = require('./lib/input.js');
const input = new Input();

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

let editor = true;

const getGameType = () => {
  let frame = 0;
  const animate = () => {
    if (frame > 30) {
        if (input.inputs.eHeld) {
          document.getElementById("editor").style.display = "block";
          new TileEditor(canvases, input);
          return;
        } else {
          document.getElementById("editor").style.display = "none";
          new Game(canvases, volume, input);
          return;
        }
    }

    frame ++;
    requestAnimationFrame(animate);
  };

  animate();
};

getGameType();
