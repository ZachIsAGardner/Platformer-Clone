const Util = require('./util.js');
const Shape = require('./shape.js');
const MovingObject = require('./moving_object.js');
const AnimatedSprite = require('./sprite/animated_sprite.js');
const Sprite = require('./sprite/sprite.js');
const Level = require('./levels/test.js');

const playerSquare = {x: 600, y: -200, width: 32, height: 56, color: 'rgba(200,170,255,0)'};
const redSquare = {x: 220, y: 275, width: 32, height: 32, color: 'red'};

const util = new Util();

//---

var offset = {x: 0, y: 0};
var border = {
  x: {min: -16, max: 10000}, y: {min:-1024, max: 256}
};

class Game {
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.dev = true;
  }

  checkBoundaries() {
    if (-offset.x < border.x.min) {
      offset.x = -border.x.min;
    }
    if (-offset.x + this.xDim > border.x.max) {
      offset.x = -(border.x.max - this.xDim);
    }
    if (-offset.y < border.y.min) {
      offset.y = -border.y.min;
    }
    if (-offset.y + this.yDim > border.y.max) {
      offset.y = -(border.y.max - this.yDim);
    }
  }

  moveViewport(ctx, canvasEl, target) {
    let cameraCenter = [-target.shape.pos.x + canvasEl.width / 2, (-target.shape.pos.y + canvasEl.height / 2) + 150];
    offset.x = util.lerp(offset.x, cameraCenter[0], 0.075);
    offset.y = util.lerp(offset.y, cameraCenter[1], 0.075);
    this.checkBoundaries();

    //for pixel perfect movement round up or down whatever
    ctx.setTransform(1, 0, 0, 1, Math.round(offset.x), Math.round(offset.y));
  }

  createBackground(player, ctx) {
    let background = new Image();
    background.src = 'assets/images/background.png';

    let parallax = -offset.x / 30;

    for (var i = 0; i < 3; i++) {
      ctx.drawImage(
        background,
        0,
        0,
        1024,
        896,
        (-offset.x + (1024 * i) - parallax) - 1024,
        -offset.y - 174, 1024,
        896
      );
    }
  }

  render(ctx) {
    //i have no idea why offset x and offset y have to be multiplied by -1
    ctx.clearRect(-offset.x, -offset.y, this.xDim, this.yDim);
    ctx.scale(2, 2);
  }

  devMethods(player) {
    if (player.shape.pos.y > border.y.max) {
      player.vel.x, player.vel.y = 0;
      player.shape.pos = {x: 0, y: -200};
    }
  }

  startAudio() {
    var audioIntro = new Audio('assets/audio/music/overworld_intro.wav');
    var audioMain = new Audio('assets/audio/music/overworld_main.wav');
    audioIntro.play();
    const songs = [audioIntro, audioMain];
    if (this.dev) {
      songs.forEach((song) => {
        song.volume = 0;
      });
    }
    return songs;
  }

  handleAudio(audioIntro, audioMain) {
    if (audioIntro.currentTime >= audioIntro.duration  -0.075 ||
      audioMain.currentTime >= audioMain.duration - 0.075) {
        audioIntro.currentTime = 0;
        audioIntro.pause();
        audioMain.currentTime = 0;
        audioMain.play();
    }
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

    const songs = this.startAudio();

    const animateCallback = () => {
      this.handleAudio(songs[0], songs[1]);
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

      if (this.dev) {
        this.devMethods(player);
      }

      requestAnimationFrame(animateCallback);
    };

    animateCallback();
  }
}

module.exports = Game;
