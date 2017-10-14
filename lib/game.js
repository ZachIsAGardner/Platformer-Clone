const Square = require('./square.js');
const Input = require('./input.js');

const ground = new Square(0, 450, 500, 40, 'black', []);
const ground2 = new Square(0, 315, 400, 40, 'black', []);
const ground3 = new Square(500, 150, 40, 400, 'black', []);
const ground4 = new Square(50, 150, 40, 400, 'black', []);

const square = new Square(100, 375, 25, 50, 'pink', [ground, ground2, ground3, ground4]);

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

    //clear canvas then render objects
    this.render(ctx);

    square.render(ctx);
    square.collisions(ctx);


    ground.render(ctx);
    ground2.render(ctx);
    ground3.render(ctx);
    ground4.render(ctx);

    requestAnimationFrame(animateCallback);
  };

  animateCallback();
};

module.exports = Game;
