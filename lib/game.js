const Square = require('./square.js');
const Input = require('./input.js');

const ground = new Square(0, 450, 500, 500, 'black', []);
const ground2 = new Square(0, 0, 40, 800, 'black', []);
const ground3 = new Square(600, 450, 500, 400, 'black', []);
const ground4 = new Square(200, 400, 100, 50, 'black', []);
const ground5 = new Square(800, 350, 150, 25, 'black', []);
const colliders = [ground, ground2, ground3, ground4, ground5];

const square = new Square(50, 375, 30, 50, 'pink', colliders);

const input = new Input(square);

//---

var offsetX = 0;
var offsetY = 0;

Game = function (xDim, yDim) {
  this.xDim = xDim;
  this.yDim = yDim;
};

Game.prototype.lerp = function(from, to, time) {
  return from + time * (to - from);
};

Game.prototype.moveViewport = function(ctx) {
  // ctx.translate(-1, 0);
};

Game.prototype.render = function(ctx) {
  ctx.clearRect(0, 0, this.xDim, this.yDim);
};

Game.prototype.start = function (canvasEl) {
  const ctx = canvasEl.getContext("2d");

  const animateCallback = () => {
    this.moveViewport(ctx);
    //clear canvas then render objects
    this.render(ctx);

    square.update(ctx);

    colliders.forEach((collider) => {
      collider.render(ctx);
    });

    requestAnimationFrame(animateCallback);
  };

  animateCallback();
};

module.exports = Game;
