const Util = require('./util.js');
const Square = require('./square.js');
const Input = require('./input.js');

const ground = new Square(0, 450, 500, 500, 'black', []);
const ground2 = new Square(0, 0, 40, 800, 'black', []);
const ground3 = new Square(600, 450, 500, 400, 'black', []);
const ground4 = new Square(200, 400, 100, 50, 'black', []);
const ground5 = new Square(800, 350, 150, 25, 'black', []);
const ground6 = new Square(0, 1800, 1200, 25, 'black', []);
const colliders = [ground, ground2, ground3, ground4, ground5, ground6];
// const colliders = [];

const square = new Square(50, 375, 30, 50, 'pink', colliders);

const input = new Input(square);
const util = new Util();

//---

var offsetX = 0;
var offsetY = 0;

Game = function (xDim, yDim) {
  this.xDim = xDim;
  this.yDim = yDim;
};

Game.prototype.moveViewport = function(ctx, canvasEl) {
  let cameraCenter = [-square.centerX + canvasEl.width / 2, -square.centerY + canvasEl.height / 2];
  offsetX = util.lerp(offsetX, cameraCenter[0], 0.075);
  offsetY = util.lerp(offsetY, cameraCenter[1], 0.075);

  ctx.setTransform(1, 0, 0, 1, offsetX, offsetY);
};

Game.prototype.render = function(ctx) {
  //i have no idea why offset x and offset y have to be multiplied by -1
  ctx.clearRect(-offsetX, -offsetY, this.xDim, this.yDim);
};

Game.prototype.start = function (canvasEl) {
  const ctx = canvasEl.getContext("2d");

  const animateCallback = () => {
    //clear canvas then render objects
    this.render(ctx);

    this.moveViewport(ctx, canvasEl);
    square.update(ctx);

    colliders.forEach((collider) => {
      collider.render(ctx);
    });

    requestAnimationFrame(animateCallback);
  };

  animateCallback();
};

module.exports = Game;
