const Util = require('./util.js');
const Shape = require('./shape.js');
const MovingObject = require('./moving_object.js');
const AnimatedSprite = require('./sprite/animated_sprite.js');
const Sprite = require('./sprite/sprite.js');
const Level = require('./levels/test.js');

const playerSquare = {x: 0, y: -100, width: 32, height: 56, color: 'rgba(200,170,255,0.8)'};
const redSquare = {x: 220, y: 275, width: 32, height: 32, color: 'red'};

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
    let cameraCenter = [-target.shape.pos.x + canvasEl.width / 2, (-target.shape.pos.y + canvasEl.height / 2) + 150];
    offsetX = util.lerp(offsetX, cameraCenter[0], 0.075);
    offsetY = util.lerp(offsetY, cameraCenter[1], 0.075);

    ctx.setTransform(1, 0, 0, 1, offsetX, offsetY);
  }

  createBackground(player, ctx) {
    let background = new Image();
    background.src = 'assets/images/background.png';

    let parallax = player.shape.pos.x / 30;

    for (var i = 0; i < 2; i++) {
      ctx.drawImage(
        background, 0, 0, 1024, 896, -offsetX + (1024 * i) - parallax, -offsetY - 174, 1024, 896
      );
    }
  }

  render(ctx) {
    //i have no idea why offset x and offset y have to be multiplied by -1
    ctx.clearRect(-offsetX, -offsetY, this.xDim, this.yDim);
    ctx.scale(2, 2);
  }

  start(canvasEl) {
    const ctx = canvasEl.getContext("2d");

    const level = new Level(ctx);
    const colliders = level.colliders;
    const tiles = level.tiles;

    const player = new MovingObject(playerSquare, colliders, ctx);


    let image = new Image();
    image.src = 'assets/images/mario.png';
    let mario = new AnimatedSprite({ctx: ctx, width: 64, height: 64, image: image, target: player});

    const animateCallback = () => {
      //clear canvas then render objects
      this.render(ctx);

      this.moveViewport(ctx, canvasEl, player);
      this.createBackground(player, ctx);

      player.update();
      mario.update();

      colliders.forEach((collider) => {
        collider.render(ctx);
      });

      tiles.forEach((tile) => {
        tile.render(ctx);
      });


      requestAnimationFrame(animateCallback);
    };

    animateCallback();
  }
}

module.exports = Game;
