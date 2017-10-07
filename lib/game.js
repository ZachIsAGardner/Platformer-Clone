const Square = require('./square.js');
const Input = require('./input.js');

const ground = new Square(0, 450, 500, 20, 'black');
const square = new Square(50, 150, 25, 50, 'pink', [ground]);

const input = new Input(square);

Game = function (xDim, yDim) {
  this.xDim = xDim;
  this.yDim = yDim;
};

Game.prototype.render = function(ctx) {
  ctx.clearRect(0, 0, this.xDim, this.yDim);
};

Game.prototype.start = function (canvasEl) {
  const ctx = canvasEl.getContext("2d");

  const animateCallback = () => {
    square.movePos();
    square.raycast();

    //clear canvas then render objects
    this.render(ctx);
    square.render(ctx);
    square.renderRaycast(ctx);
    ground.render(ctx);

    requestAnimationFrame(animateCallback);
  };

  animateCallback();
};

module.exports = Game;
