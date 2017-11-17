const Util = require('./util.js');
const Shape = require('./shape.js');

const MovingObject = require('./entities/moving_object.js');
const Player = require('./entities/player.js');

const AnimatedSprite = require('./sprite/animated_sprite.js');
const Sprite = require('./sprite/sprite.js');

const Level1 = require('./levels/level_1.js');
const Level2 = require('./levels/level_2.js');
const Level3 = require('./levels/level_3.js');
const levels = [Level1, Level2];

const util = new Util();

//---

var offset = {x: 0, y: 0};
var border = {
  x: {min: -16, max: 1000000}, y: {min: -512, max: 356}
};

class Game {
  constructor(canvases, volume) {
    this.canvasMain = canvases.main;
    this.canvases = canvases;

    this.volume = volume;
    this.xDim = this.canvasMain.width;
    this.yDim = this.canvasMain.height;
    this.req = null;
    this.dev = true;
    this.pause = true;

    this.songs = [];
    this.currentSong = null;

    this.level = null;
    this.colliders = [];
    this.tiles = [];
    this.entities = {player: null, enemies: []};
    this.ui = [];

    this.screen = {alpha: 3, rate: -0.075, loading: true};

    this.currentLevel = 0;

    this.start();
    this.gameStart = true;

    this.levelEnded = false;
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

  moveViewport(ctx, canvasMain, target) {
    let cameraCenter = [-target.shape.pos.x + canvasMain.width / 2, (-target.shape.pos.y + canvasMain.height / 2) + 150];
    if (target.status.alive) {
      offset.x = util.lerp(offset.x, cameraCenter[0], 0.075);
      // offset.y = util.lerp(offset.y, cameraCenter[1], 0.075);
    }
    this.checkBoundaries();

    //for pixel perfect movement round up or down whatever
    Object.entries(this.canvases).forEach((canvas) => {
      canvas[1].getContext('2d').setTransform(1, 0, 0, 1, offset.x, offset.y);
    });
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
    Object.entries(this.canvases).forEach((canvas) => {
      canvas[1].getContext('2d').clearRect(-offset.x, -offset.y, this.xDim, this.yDim);
    });
    // ctx.clearRect(-offset.x, -offset.y, this.xDim, this.yDim);
    // ctx.scale(2, 2);
  }

  devMethods(player) {
    if (player.shape.pos.y > border.y.max) {
      player.vel.x, player.vel.y = 0;
      // player.shape.pos = {x: 0, y: 200};
    }
  }

  //---

  getSongs() {
    var intro = new Audio('assets/audio/music/overworld_intro.wav');
    var main = new Audio('assets/audio/music/overworld_main.wav');
    var playerDown = new Audio('assets/audio/music/player_down.wav');
    var courseClear = new Audio('assets/audio/music/course_clear_fanfare.wav');
    this.songs = [intro, main, playerDown, courseClear];
  }

  changeSong(newSong, loop) {
    if (this.currentSong === newSong && !loop) {
      return;
    }
    this.currentSong.pause();
    this.currentSong = newSong;
    this.currentSong.currentTime = 0;
    this.currentSong.play();
  }

  startAudio() {
    this.currentSong = this.songs[0];
    this.currentSong.play();
  }

  pauseAudio() {
    this.currentSong.pause();
  }
  unpauseAudio() {
    this.currentSong.play();
  }

  handleAudio() {
    const audioIntro = this.songs[0];
    const audioMain = this.songs[1];

    if (this.currentSong.currentTime >= this.currentSong.duration  -0.25) {
      if (this.songs[0].src === this.currentSong.src || this.songs[1].src === this.currentSong.src) {
        this.changeSong(this.songs[1], true);
      }
    }
  }

  //---

  destroyEverything() {
    this.level = null;
    this.colliders = [];
    this.tiles = [];
    this.entities = {player: null, enemies: []};
    this.ui = [];
  }

  loadScreen(ctx) {
    this.screen.alpha += this.screen.rate;
    if (this.screen.alpha > 2) {
      this.screen.rate *= -1;
      this.screen.alpha = 1;
      this.restart();
    }
    if (this.screen.alpha < 0) {
      this.screen.loading = false;
      this.screen.rate *= -1;
      this.screen.alpha = 0;
    }
    ctx.fillStyle = `rgba(0,0,0,${this.screen.alpha})`;
    ctx.fillRect(-offset.x, -offset.y, this.xDim, this.yDim);
  }

  restart() {
    if (this.levelEnded) {
      this.endLevel();
    }
    this.destroyEverything();
    this.start(this.canvasMain);
    cancelAnimationFrame(this.req);
  }

  handlePause(ctx, animateCallback) {
    if (this.pause) {

      if (this.input.pausePressed || (this.input.keyPressed && this.gameStart)) {
        if (this.gameStart) {
          this.levelStart();
        } else {
          this.unpauseAudio();
        }
        this.gameStart = false;
        this.pause = false;
        //lazy lazy bad :(
        this.input.pausePressed = false;
        this.input.keyPressed = false;
      }

      ctx.fillStyle = `rgba(0,0,0,1)`;
      ctx.fillRect(-offset.x + this.xDim / 3, -offset.y + this.xDim / 6, this.xDim / 3, this.yDim / 3);
    } else {
      if (this.input.pausePressed) {
        this.pause = true;
        this.pauseAudio();
        //bad dont change input from outside
        this.input.pausePressed = false;
        this.input.keyPressed = false;
      }
    }
  }

  waitForUser(ctx) {
    ctx.fillStyle = `rgba(0,0,0,1)`;
    ctx.fillRect(-offset.x, -offset.y, this.xDim, this.yDim);
    let image = new Image();
    image.src = 'assets/images/prompt.png';
    ctx.drawImage(
      image,
      0,
      0,
      256,
      64,
      -offset.x + (this.xDim / 2) - 128,
      -offset.y + (this.yDim / 2) - 32,
      256,
      64
    );
  }

  //---

  createImage(ctx, imageStr) {
    let image = new Image();
    // image.src = `assets/images/${imageStr}`;
    image.src = 'assets/images/thanks_for_playing.png';
    ctx = this.canvases.ui.getContext('2d');
    this.ui.push(new Sprite({
      ctx,
      width: 256,
      height: 64,
      pos: {x: -offset.x + (this.xDim / 2), y: -offset.y + (this.yDim / 2)},
      image
    }));
  }

  levelStart() {
    this.startAudio();
  }

  beginEndLevel(ctx) {
    this.currentLevel = 0;
    this.levelEnded = true;
    this.changeSong(this.songs[3]);
    setTimeout(() => {
      this.createImage(ctx);
      border.x.max = -offset.x + this.xDim;
      this.screen = {alpha: 0, rate: 0.004, loading: true};
    }, 7253);
  }

  nextLevel() {
    this.currentLevel += 1;
    this.screen.loading = true;
  }

  endLevel() {
    this.entities.player.status.victory = false;
    this.input.pausePressed = false;
    this.input.keyPressed = false;
    this.levelEnded = false;
    this.gameStart = true;
    this.pause = true;
    this.screen = {alpha: 3, rate: -0.075, loading: true};
  }

  start() {
    const ctx = this.canvasMain.getContext("2d");

    // this.level = new Level(this.canvases);
    this.level = new levels[this.currentLevel](this.canvases);
    this.colliders = this.level.colliders;
    this.tiles = this.level.tiles;
    this.entities = this.level.entities;
    this.input = this.entities.player.inputFetcher.inputs;

    border.x.max = 100000;
    border.y.min = 32;
    border.y.max = (this.level.border.y * 32);

    this.getSongs();

    let alpha2 = 0;

    const animateCallback = () => {
      //Level conditions

      if (!this.levelEnded) {
        this.handlePause(this.canvases.ui.getContext('2d'), animateCallback);
      }
      if (this.pause) {
        if (this.gameStart) {
          this.waitForUser(this.canvases.ui.getContext('2d'));
        }
        this.req = requestAnimationFrame(animateCallback);
        return;
      }

      if (this.entities.player.status.victory && !this.levelEnded && !this.screen.loading) {
        if (this.currentLevel >= levels.length - 1) {
          this.beginEndLevel(ctx);
        } else {
          this.nextLevel(ctx);
        }
      }

      if (this.entities.player.status.remove) {
        this.levelEnded = true;
        this.screen.loading = true;
      }

      //---
      //Music

      this.currentSong.volume = (this.volume.className === "active") ? 0.5 : 0;
      this.songs.forEach((song) => {
        song.volume = (this.volume.className === "active") ? 0.5 : 0;
      });
      this.handleAudio(this.songs[0], this.songs[1]);

      if (!this.entities.player.status.alive) {
        this.changeSong(this.songs[2]);
      }

      //---
      //Main canvas operations

      this.render(ctx);

      this.moveViewport(ctx, this.canvasMain, this.entities.player);
      this.createBackground(this.entities.player, this.canvases.bg.getContext("2d"));

      //---
      //Update level elements

      this.colliders.forEach((collider, i) => {
        if (collider.status.remove) {
          this.colliders.splice(i, 1);
        }
        collider.render(ctx);
      });

      this.tiles.forEach((tile) => {
        tile.update(ctx);
      });

      this.entities.enemies.forEach((entity, i) => {
        if (entity.status.remove || this.entities.player.status.victory) {
          this.entities.enemies.splice(i, 1);
        }
        entity.update();
      });

      this.entities.items.forEach((entity, i) => {
        if (entity.status.remove) {
          this.entities.items.splice(i, 1);
        }
        entity.update();
      });

      //Special case for end of level
      if (this.levelEnded) {
        alpha2 += 0.005;
        this.canvases.main.getContext('2d').fillStyle = `rgba(0,0,0,${alpha2})`;
        this.canvases.main.getContext('2d').fillRect(-offset.x, -offset.y, this.xDim, this.yDim);
      } else {
        alpha2 = 0;
      }

      this.entities.player.update();


      //---
      //Update ui elements

      this.ui.forEach((el) => {
        el.update();
      });

      if (this.screen.loading) {
        this.loadScreen(this.canvases.ui.getContext('2d'));
      }

      //---
      //Get new frame

      this.req = requestAnimationFrame(animateCallback);

    };

    //Start getting frames
    animateCallback();
  }
}

module.exports = Game;
