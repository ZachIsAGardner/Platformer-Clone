const Util = require('./util.js');

const Square = require('./square.js');
const Shape = require('./shape.js');
const MovingObject = require('./moving_object.js');

const Input = require('./input.js');


// const colliders = [];

const redSquare = {x: 170, y: 375, width: 30, height: 50, color: 'red'};

const util = new Util();

//---

var offsetX = 0;
var offsetY = 0;

class Game {
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
  }

  moveViewport(ctx, canvasEl) {
    // let cameraCenter = [-square.centerX + canvasEl.width / 2, -square.centerY + canvasEl.height / 2];
    // offsetX = util.lerp(offsetX, cameraCenter[0], 0.075);
    // offsetY = util.lerp(offsetY, cameraCenter[1], 0.075);
    //
    // ctx.setTransform(1, 0, 0, 1, offsetX, offsetY);
  }

  render(ctx) {
    //i have no idea why offset x and offset y have to be multiplied by -1
    ctx.clearRect(-offsetX, -offsetY, this.xDim, this.yDim);
  }

  start(canvasEl) {
    const ctx = canvasEl.getContext("2d");

    const ground = new Shape({x: 200, y: 450, width: 200, height: 30, color: 'black'}, ctx);
    const ground2 = new Shape({x: 120, y: 300, width: 30, height: 600, color: 'black'}, ctx);
    const ground3 = new Shape({x: 200, y: 320, width: 200, height: 30, color: 'black'}, ctx);

    const colliders = [ground, ground2, ground3];

    const mover = new MovingObject(redSquare, colliders, ctx);

    const animateCallback = () => {
      //clear canvas then render objects
      this.render(ctx);

      this.moveViewport(ctx, canvasEl);
      // square.update(ctx);
      mover.update();

      colliders.forEach((collider) => {
        collider.render(ctx);
      });

      requestAnimationFrame(animateCallback);
    };

    animateCallback();
  }
}

module.exports = Game;
