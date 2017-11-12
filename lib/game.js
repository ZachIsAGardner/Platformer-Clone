const Util = require('./util.js');
const Shape = require('./shape.js');

const MovingObject = require('./entities/moving_object.js');
const Player = require('./entities/player.js');

const AnimatedSprite = require('./sprite/animated_sprite.js');
const Sprite = require('./sprite/sprite.js');
const Level = require('./levels/level_1.js');

const util = new Util();

//---

var offset = {x: 0, y: 0};
var border = {
  x: {min: -16, max: 10000}, y: {min: -512, max: 356}
};

class Game {
  constructor(canvasEl, volume) {
    this.canvasEl = canvasEl;
    this.volume = volume;
    this.xDim = this.canvasEl.width;
    this.yDim = this.canvasEl.height;
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

  moveViewport(ctx, canvasEl, target) {
    let cameraCenter = [-target.shape.pos.x + canvasEl.width / 2, (-target.shape.pos.y + canvasEl.height / 2) + 150];
    if (target.status.alive) {
      offset.x = util.lerp(offset.x, cameraCenter[0], 0.075);
      // offset.y = util.lerp(offset.y, cameraCenter[1], 0.075);
    }
    this.checkBoundaries();

    //for pixel perfect movement round up or down whatever
    ctx.setTransform(1, 0, 0, 1, offset.x, offset.y);
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
      player.shape.pos = {x: 0, y: 200};
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

    if (this.currentSong.currentTime >= this.currentSong.duration  -0.075) {
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
    this.start(this.canvasEl);
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

  levelStart() {
    this.startAudio();
  }

  beginEndLevel(ctx) {
    this.levelEnded = true;
    this.changeSong(this.songs[3]);
    setTimeout(() => {
      this.createImage(ctx);
      border.x.max = -offset.x + this.xDim;
      this.screen = {alpha: 0, rate: 0.004, loading: true};
    }, 7253);
  }

  createImage(ctx, imageStr) {
    let image = new Image();
    // image.src = `assets/images/${imageStr}`;
    image.src = 'assets/images/thanks_for_playing.png';
    this.ui.push(new Sprite({
      ctx,
      width: 256,
      height: 64,
      pos: {x: -offset.x + (this.xDim / 2), y: -offset.y + (this.yDim / 2)},
      image
    }));
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
    const ctx = this.canvasEl.getContext("2d");

    this.level = new Level(ctx);
    this.colliders = this.level.colliders;
    this.tiles = this.level.tiles;
    this.entities = this.level.entities;
    this.input = this.entities.player.inputFetcher.inputs;

    this.getSongs();

    let alpha2 = 0;

    const animateCallback = () => {

      if (!this.levelEnded) {
        this.handlePause(ctx, animateCallback);
      }
      if (this.pause) {
        if (this.gameStart) {
          this.waitForUser(ctx);
        }
        this.req = requestAnimationFrame(animateCallback);
        return;
      }

      this.currentSong.volume = (this.volume.className === "active") ? 1 : 0;
      this.songs.forEach((song) => {
        song.volume = (this.volume.className === "active") ? 1 : 0;
      });
      this.handleAudio(this.songs[0], this.songs[1]);

      this.render(ctx);

      this.moveViewport(ctx, this.canvasEl, this.entities.player);
      this.createBackground(this.entities.player, ctx);

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
        entity.update(ctx);
      });
      this.entities.items.forEach((entity, i) => {
        if (entity.status.remove) {
          this.entities.items.splice(i, 1);
        }
        entity.update();
      });

      if (this.levelEnded) {
        alpha2 += 0.005;
        ctx.fillStyle = `rgba(0,0,0,${alpha2})`;
        ctx.fillRect(-offset.x, -offset.y, this.xDim, this.yDim);
      } else {
        alpha2 = 0;
      }
      if (this.entities.player.status.victory && !this.levelEnded) {
        this.beginEndLevel(ctx);
      }
      this.ui.forEach((el) => {
        el.update();
      });
      this.entities.player.update();

      if (!this.entities.player.status.alive) {
        this.changeSong(this.songs[2]);
      }
      if (this.entities.player.status.remove) {
        this.levelEnded = true;
        this.screen.loading = true;
      }
      if (this.screen.loading) {
        this.loadScreen(ctx);
      }
      this.req = requestAnimationFrame(animateCallback);

    };

    animateCallback();
  }
}

module.exports = Game;
