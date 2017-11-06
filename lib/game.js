const Util = require('./util.js');

const Square = require('./square.js');
const Shape = require('./shape.js');
const MovingObject = require('./moving_object.js');

const Sprite = require('./sprite.js');

const Level = require('./levels/test.js');

const redSquare = {x: 170, y: 275, width: 32, height: 56, color: 'rgba(200,170,255,0.8)'};

const util = new Util();

//---

var offsetX = 0;
var offsetY = 0;

class Game {
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
  }

  moveViewport(ctx, canvasEl, target) {
    let cameraCenter = [-target.shape.pos.x + canvasEl.width / 2, -target.shape.pos.y + canvasEl.height / 2];
    offsetX = util.lerp(offsetX, cameraCenter[0], 0.075);
    offsetY = util.lerp(offsetY, cameraCenter[1], 0.075);

    ctx.setTransform(1, 0, 0, 1, offsetX, offsetY);
  }

  render(ctx) {
    //i have no idea why offset x and offset y have to be multiplied by -1
    ctx.clearRect(-offsetX, -offsetY, this.xDim, this.yDim);
    ctx.scale(2, 2);
  }

  start(canvasEl) {
    const ctx = canvasEl.getContext("2d");

    const colliders = new Level(ctx).colliders;
    const player = new MovingObject(redSquare, colliders, ctx);

    let image = new Image();
    image.src = 'assets/images/mario.png';
    let mario = new Sprite({ctx: ctx, width: 64, height: 64, image: image, target: player});

    const animateCallback = () => {
      //clear canvas then render objects
      this.render(ctx);

      this.moveViewport(ctx, canvasEl, player);
      player.update();

      colliders.forEach((collider) => {
        collider.render(ctx);
      });

      mario.update();


      requestAnimationFrame(animateCallback);
    };

    animateCallback();
  }
}

module.exports = Game;
