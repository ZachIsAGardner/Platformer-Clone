/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Shape {
  constructor(params, ctx, type, owner) {
    this.width = params.width;
    this.height = params.height;
    this.color = params.color;

    this.pos = {x: 0, y: 0};
    this.setPos(params.pos.x, params.pos.y);

    this.type = type || '';
    this.owner = owner;
    this.status = {remove: false};

    this.ctx = ctx;
  }

  update() {
    this.render();
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }

  setPos(x, y) {
    this.pos = {
      x: x - (this.width / 2),
      y: y - (this.height / 2)
    };
  }

  calcCenter() {
    return {
      x: this.pos.x + (this.width / 2),
      y: this.pos.y + (this.height / 2)
    };
  }

  die() {
    this.status.remove = true;
  }
}

module.exports = Shape;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Sprite = __webpack_require__(3);

class AnimatedSprite {
  constructor({ctx, width, height, image, ticksPerFrame, target, state, face, numberOfFrames, offset, row, col, staticSpeed}) {
    this.ctx = ctx;
    this.width = width || 32;
    this.height = height || 32;
    this.image = image;
    this.row = row || 0;
    this.col = col || 0;
    this.tickCount = 0;
    this.ticksPerFrame = ticksPerFrame || 6;
    this.numberOfFrames = numberOfFrames || 14;
    this.range = {start: 0, end: 3};
    this.target = target;
    this.lastState = '';
    this.currentState = 'idle';
    this.offset = offset || {x: 0, y: 0};
    this.staticSpeed = staticSpeed;
  }

  stateChange() {
    this.row = this.range.start;
  }

  update() {
    if (!this.staticSpeed) {
      this.ticksPerFrame = 16 / Math.abs(this.target.vel.x);
      if (this.ticksPerFrame > 16) {
        this.ticksPerFrame = 16;
      }
    }
    this.tickCount += 1;

    if (this.tickCount > this.ticksPerFrame) {
      this.row += 1;
      this.tickCount = 0;
      if (this.row > this.range.end - 1) {
        this.row = this.range.start;
      }
    }
    this.render();
  }

  render() {
    this.ctx.drawImage(
      this.image,
      this.row * this.width,
      this.col * this.height,
      this.width,
      this.height,
      this.target.shape.pos.x - this.offset.x,
      this.target.shape.pos.y - this.offset.y,
      this.width,
      this.height
    );
  }
}

module.exports = AnimatedSprite;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

class SFX {
  constructor() {
    const jump = new Audio ("assets/audio/sfx/smw_jump.wav");
    const coin = new Audio ("assets/audio/sfx/smw_coin.wav");
    const stomp = new Audio ("assets/audio/sfx/smw_stomp.wav");
    this.sounds = {
      jump,
      coin,
      stomp
    };
  }
}

module.exports = SFX;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

class Sprite {
  constructor({ctx, width, height, image, pos, row, col, special, offset}) {
    this.ctx = ctx;
    this.width = width || 32;
    this.height = height || 32;
    this.image = image;
    this.row = row || 0;
    this.col = col || 0;
    this.pos = pos || {x: 0, y: 0};
    this.offset = offset || {x: 0, y: 0};
    this.special = special;
  }

  update() {
    this.render();
  }

  render() {

    this.ctx.drawImage(
      this.image,
      this.row * 32,
      this.col * 32,
      this.width,
      this.height,
      this.pos.x - (this.width / 2) - this.offset.x,
      this.pos.y - (this.height / 2) - this.offset.y,
      this.width,
      this.height
    );
  }
}

module.exports = Sprite;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(5);
const util = new Util();
const Shape = __webpack_require__(0);

const Collision = __webpack_require__(9);
const SFX = __webpack_require__(2);
const sfx = new SFX();

class MovingObject {
  constructor(shapeParameters, colliders, ctx, enemies) {
    this.shape = new Shape(shapeParameters, ctx, null, this);
    this.vel = {x: 0, y: 0};
    this.input = {x: 0, y: 0, jump: false};

    this.stats = {
      walkSpeed: 3.05,
      runSpeed: 5.05,
      pSpeed: 7.25,
      groundAcc: 0.0525,
      airAcc: 0.035,
      minJump: -4.75,
      jump: -8.45,
      grav: 0.2625
    };
    this.animation = {
      face: 'right',
      state: 'idle'
    };
    this.enemies = enemies;
    this.colliders = colliders;
    this.collision = new Collision(this, ctx);

    this.status = {
      grounded: false,
      running: false,
      pMeter: 0,
      pRun: false,
      alive: true,
      remove: false,
      input: true
    };
  }

  update() {
    this.movePos();
    this.calcVel();
    this.shape.render();
    if (this.status.alive) {
      this.collision.collisions();
    }
  }

  speedType() {
    if (this.collision.grounded && this.status.ducking) {
      this.status.pMeter = 0;
      return 0;
    }
    if (Math.abs(this.vel.x) + 0.2 > this.stats.runSpeed && this.status.running && this.collision.grounded) {
      this.status.pMeter = util.lerp(this.status.pMeter, 1, 0.5);
    } else if (this.collision.grounded){
      this.status.pMeter = util.lerp(this.status.pMeter, 0, 0.75);
    }
    if (this.status.pMeter > 0.9) {
      this.status.pRun = true;
      return this.stats.pSpeed;
    } else {
      this.status.pRun = false;
      return (this.status.running) ? this.stats.runSpeed : this.stats.walkSpeed;
    }
  }

  calcVel() {
    let acc = (this.collision.grounded) ? this.stats.groundAcc : this.stats.airAcc;
    let speed = this.speedType();
    this.vel.x = util.lerp(this.vel.x, (this.input.x * speed), acc);
    this.vel.y += this.stats.grav;
  }

  minJump() {
    this.vel.y = this.stats.minJump;
  }
  jump() {
    this.vel.y = this.stats.jump;
  }

  movePos() {
    this.shape.pos.x += this.vel.x;
    this.shape.pos.y += this.vel.y;
  }

  die() {
    this.status.alive = false;
    setTimeout(() => this.remove(), 3000);
  }

  remove() {
    this.status.remove = true;
  }

}

module.exports = MovingObject;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

const Util = function() {
  //constructor
};

Util.prototype.lerp = function(from, to, time) {
  return from + time * (to - from);
};

Util.prototype.pixelPerfect = function(pos) {
  const x = Math.round(pos.x);
  const y = Math.round(pos.y);
  return {x, y};
};

module.exports = Util;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(4);
const Input = __webpack_require__(10);
const MarioSprite = __webpack_require__(11);

const SFX = __webpack_require__(2);
const sfx = new SFX();

class Player extends MovingObject {
  constructor(shapeParameters, colliders, ctx, enemies) {
    shapeParameters.color = 'rgba(255,255,255,0)';
    shapeParameters.width = 20;
    shapeParameters.height = 56;
    super(shapeParameters, colliders, ctx, enemies);
    this.name = "player";
    this.ctx = ctx;
    this.sprite = this.createSprite();
    this.inputFetcher = new Input();
    this.status.victory = false;
    this.status.move = true;
    this.canUnDuck = false;
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/mario.png';
    return new MarioSprite({ctx: this.ctx, width: 64, height: 64, image: image, target: this, offset:{x:22, y:8}});
  }

  handleAnimation() {
    if (!this.status.alive) {
      this.animation.state = 'die';
      return;
    }
    if (this.status.ducking) {
      this.animation.state = 'duck';
    } else {
      if (this.input.x < -0) {
        this.animation.face = "left";
      } else if (this.input.x > 0) {
        this.animation.face = "right";
      }
      if (!this.collision.grounded) {
        if (this.status.pRun) {
          this.animation.state = "runJump";
        } else {
          if (this.vel.y > 0) {
            this.animation.state = "fall";
          } else {
            this.animation.state = "jump";
          }
        }
      }

      if (this.collision.grounded) {
        if (this.vel.x < 0.25 && this.vel.x > -0.25) {
          if (this.input.y === 1) {
            this.animation.state = "lookUp";
          } else {
            this.animation.state = (!this.status.victory) ? "idle" : "victory";
          }
        }
        if (this.vel.x > 0.25) {
          this.animation.state = (!this.status.pRun) ? "walk" : "run";
        }
        if (this.vel.x < -0.25) {
          this.animation.state = (!this.status.pRun) ? "walk" : "run";
        }
        if (this.vel.x < -0.25 && this.input.x > 0
          || this.vel.x > 0.25 && this.input.x < 0) {
            this.animation.state = "skid";
        }
      }
    }
  }

  handleInput() {
    if (!this.inputFetcher.inputs.leftHeld
      && !this.inputFetcher.inputs.rightHeld) {
      this.input.x = 0;
    }
    if (this.inputFetcher.inputs.leftHeld
      && !this.inputFetcher.inputs.rightHeld) {
      this.input.x = -1;
    }
    if (!this.inputFetcher.inputs.leftHeld
      && this.inputFetcher.inputs.rightHeld) {
      this.input.x = 1;
    }
    if (this.inputFetcher.inputs.jumpPressed
      && this.collision.grounded) {
      this.jump();
      sfx.sounds.jump.play();
    }
    if (this.inputFetcher.inputs.jumpReleased
      && this.vel.y < this.stats.minJump
      && !this.collision.grounded) {
      this.minJump();
    }
    this.status.running = this.inputFetcher.inputs.runHeld;

    if (this.collision.grounded) {
      if (this.inputFetcher.inputs.downHeld) {
        if (!this.status.ducking) {
          this.duck();
        }
        this.status.ducking = true;
      } else {
        if (this.status.ducking) {
          this.unDuck();
        }
        this.status.ducking = false;
      }
    }

    if (this.inputFetcher.inputs.upHeld) {
      this.input.y = 1;
    } else {
      this.input.y = 0;
    }
  }

  update(){
    // this.ctx.fillStyle = 'red';
    // this.ctx.clearRect(this.shape.pos.x - 16, this.shape.pos.y - 16, 128, 128);

    if (this.status.alive && this.status.input) {
      this.handleInput();
      this.inputFetcher.update();
    }
    if (this.status.victory) {
      if (!this.collision.grounded) {
        this.vel.x = .26;
      }
    }
    this.sprite.update();
    this.handleAnimation();
    super.update();
    if (!this.status.move) {
      this.vel.x = 0;
      this.vel.y = 0;
    }
  }

  damage() {
    this.die();
  }

  duck() {
    this.shape.height = 26;
    this.shape.pos.y = this.shape.pos.y + 30;
    this.sprite.offset.y += 30;
    this.canUnDuck = true;
  }

  unDuck() {
    if (this.canUnDuck) {
      this.shape.height = 56;
      this.sprite.offset.y -= 30;
      this.shape.pos.y = this.shape.pos.y - 30;
    }
    this.canUnDuck = false;
  }

  victory() {
    this.status.victory = true;
    this.status.input = false;
    this.input.x = 0.325;
    this.status.running = false;
    this.status.pRun = false;
    this.status.pRun = false;
    setTimeout(() => {
      this.input.x = 0;
    }, 6853);
    setTimeout(() => {
      this.input.x = 0.325;
    }, 8853);
  }

  die() {
    if (this.status.alive) {
      super.die();

      this.status.move = false;
      setTimeout(() => {
        this.jump();
        this.status.move = true;
      }, 500);
      this.input.x = 0;

    }
  }
}

module.exports = Player;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(8);

const canvasBG = document.getElementById("background-canvas");
const canvasMain = document.getElementById("main-canvas");
const canvasEntities = document.getElementById("entities-canvas");
const canvasFG = document.getElementById("foreground-canvas");
const canvasUI = document.getElementById("ui-canvas");
let canvases = {
  bg: canvasBG,
  main: canvasMain,
  entities: canvasEntities,
  fg: canvasFG,
  ui: canvasUI
};

const volume = document.getElementById('volume');

Object.entries(canvases).forEach((key) => {
  key[1].width = 768;
  key[1].height = 588;
});

new Game(canvases, volume);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(5);
const Shape = __webpack_require__(0);

const MovingObject = __webpack_require__(4);
const Player = __webpack_require__(6);

const AnimatedSprite = __webpack_require__(1);
const Sprite = __webpack_require__(3);
const Level = __webpack_require__(12);

const util = new Util();

//---

var offset = {x: 0, y: 0};
var border = {
  x: {min: -16, max: 10000}, y: {min: -512, max: 356}
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
    ctx = this.canvases.ui.getContext('2d');
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
    const ctx = this.canvasMain.getContext("2d");

    this.level = new Level(this.canvases);
    this.colliders = this.level.colliders;
    this.tiles = this.level.tiles;
    this.entities = this.level.entities;
    this.input = this.entities.player.inputFetcher.inputs;

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

      if (this.entities.player.status.victory && !this.levelEnded) {
        this.beginEndLevel(ctx);
      }

      if (this.entities.player.status.remove) {
        this.levelEnded = true;
        this.screen.loading = true;
      }

      //---
      //Music

      this.currentSong.volume = (this.volume.className === "active") ? 1 : 0;
      this.songs.forEach((song) => {
        song.volume = (this.volume.className === "active") ? 1 : 0;
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

      if (this.screen.loading) {
        this.loadScreen(this.canvases.ui.getContext('2d'));
      }


      this.ui.forEach((el) => {
        el.update();
      });


      //---
      //Get new frame

      this.req = requestAnimationFrame(animateCallback);

    };

    //Start getting frames
    animateCallback();
  }
}

module.exports = Game;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

class Collision {
  constructor(object, ctx) {
    this.ctx = ctx;
    this.raycastAmount = 4;
    //Prevents a hit with a collider below the square
    this.skin = 1;

    this.object = object;
    this.shape = object.shape;
    this.vel = object.vel;

    this.enemies = object.enemies || [];
    this.colliders = object.colliders;
    this.grounded = false;
    this.walled = false;

  }

  collisions() {
    this.walled = this.horizontalCollisions();
    this.grounded = this.verticalCollisions();
  }

  //---

  horizontalCollisions() {
    let anyCollisions = false;

    for (var i = 0; i < this.raycastAmount; i++) {
      let startX;
      let endX;

      let spacing = (i * ((this.shape.height - this.skin) / (this.raycastAmount - 1))) + (this.skin / 2);

      if (this.vel.x > 0) {
        startX = {
          x: this.shape.calcCenter().x + (this.shape.width / 2),
          y: this.shape.pos.y + spacing
        };
        endX = {
          x: this.shape.calcCenter().x + (this.shape.width / 2) + Math.abs(this.object.vel.x),
          y: this.shape.pos.y + spacing
        };
      } else {
        startX = {
          x: this.shape.calcCenter().x - (this.shape.width / 2),
          y: this.shape.pos.y + spacing
        };
        endX = {
          x: this.shape.calcCenter().x - (this.shape.width / 2) - Math.abs(this.object.vel.x),
          y: this.shape.pos.y + spacing
        };
      }

      let hit = this.raycast(startX, endX, 'horizontal');
      if (hit) {
        anyCollisions = this.parseHorizontalCollision(hit);
      }
    }
    return anyCollisions;
  }

  parseHorizontalCollision(hit) {
    if (hit.collider) {
      switch (hit.collider.type) {
        case 'block':
          this.handleHorizontalCollision(hit);
          return true;
          case 'itemBlock':
            if (hit.collider.owner.animation.state != 'flip') {
              this.handleHorizontalCollision(hit);
              return true;
            }
            break;
        case 'trigger':
          this.handleTrigger(hit.collider);
          break;
        case 'coin':
          hit.collider.owner.die();
          break;
        case 'kill':
          this.handleTrigger();
          this.object.die();
          break;
        case 'through':
          break;
        default:

      }
    }
    if (hit.enemy) {
      this.object.damage();
    }
  }

  handleHorizontalCollision(hit) {
    if (this.vel.x > 0) {
      this.shape.pos.x = (hit.collider.calcCenter().x - hit.collider.width / 2) - this.shape.width;
    } else {
      this.shape.pos.x = (hit.collider.calcCenter().x + hit.collider.width / 2);
    }
    this.vel.x = 0;
  }

  //---

  verticalCollisions() {
    let anyCollisions = false;

    for (var i = 0; i < this.raycastAmount; i++) {
      let startY;
      let endY;

      let spacing = (i * ((this.shape.width) / (this.raycastAmount - 1)));

      if (this.vel.y > 0) {
        startY = {
          x: this.shape.pos.x + spacing,
          y: this.shape.calcCenter().y + (this.shape.height / 2)
        };
        endY = {
          x: this.shape.pos.x + spacing,
          y: this.shape.calcCenter().y + (this.shape.height / 2) + Math.abs(this.object.vel.y)
        };
      } else {
        startY = {
          x: this.shape.pos.x + spacing,
          y: this.shape.calcCenter().y - (this.shape.height / 2)
        };
        endY = {
          x: this.shape.pos.x + spacing,
          y: this.shape.calcCenter().y - (this.shape.height / 2) - Math.abs(this.object.vel.y)
        };
      }

      let hit = this.raycast(startY, endY, 'vertical');
      if (hit) {
        anyCollisions = this.parseVerticalCollision(hit);
      }
    }

    return anyCollisions;
  }

  parseVerticalCollision(hit) {
    if (hit.collider) {
      switch (hit.collider.type) {
        case 'block':
          this.handleVerticalCollision(hit);
          return true;
        case 'itemBlock':
          if (hit.collider.owner.animation.state != 'flip') {
            if (this.object.vel.y < 0) {
              hit.collider.owner.flip();
            }
            this.handleVerticalCollision(hit);
            return true;
          }
          break;
        case 'trigger':
          this.handleTrigger(hit.collider);
          break;
        case 'coin':
          hit.collider.owner.die();
          break;
        case 'kill':
          this.object.die();
          break;
        case 'through':
          if (this.object.vel.y > 0) {
            this.handleVerticalCollision(hit);
            return true;
          }
        default:

      }
    } else {
      this.handleVerticalCollisionEnemy(hit);
    }
  }

  handleVerticalCollision(hit) {
    if (this.vel.y > 0) {
      this.shape.pos.y = (hit.collider.calcCenter().y - hit.collider.height / 2) - this.shape.height;
    } else {
      this.shape.pos.y = (hit.collider.calcCenter().y + hit.collider.height / 2);
    }

    this.vel.y = 0;
  }

  handleVerticalCollisionEnemy(hit) {
    if (this.vel.y > 0) {
      hit.enemy.die();
      if (this.object.inputFetcher.inputs.jumpHeld) {
        this.object.jump();
      } else {
        this.object.minJump();
      }
    } else {
      this.object.damage();
    }
  }

  //---

  checkCollision(point, type) {
    //checks if point is within any of the colliders
    for (var i = 0; i < this.colliders.length; i++) {

      if (point.y > this.colliders[i].calcCenter().y - (this.colliders[i].height / 2)
       && point.y < this.colliders[i].calcCenter().y + (this.colliders[i].height / 2)) {

        if (point.x > this.colliders[i].calcCenter().x - (this.colliders[i].width / 2)
         && point.x < this.colliders[i].calcCenter().x + (this.colliders[i].width / 2)) {

          return { collider: this.colliders[i]};

        }

      }

    }
  }

  checkCollisionEnemy(point) {
    for (var i = 0; i < this.enemies.length; i++) {
      let collider = this.enemies[i].shape;
      if (point.y > collider.calcCenter().y - (collider.height / 2)
       && point.y < collider.calcCenter().y + (collider.height / 2)) {

        if (point.x > collider.calcCenter().x - (collider.width / 2)
         && point.x < collider.calcCenter().x + (collider.width / 2)) {

          return { enemy: this.enemies[i]};

        }

      }

    }
  }

  handleTrigger(collider) {
    if (this.object.name === 'player') {
      collider.owner.setTrigger(this.object);
      collider.die();
    }
  }

  //---

  raycast(start, end, type) {
    // this.renderRaycast(start, end, 'red');
    return this.checkCollision(end, type) || this.checkCollisionEnemy(end);
  }

  renderRaycast(start, end, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }
}

module.exports = Collision;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

const Input = function (entity) {

  let inputs = {
    leftHeld: false,
    rightHeld: false,
    jumpPressed: false,
    jumpHeld: false,
    jumpReleased: false,
    jumpFresh: true,
    runHeld: false,
    downHeld: false,
    upHeld: false,
    keyPressed: false,
    pausePressed: false
  };

  const update = () => {
    inputs.jumpReleased = false;
    inputs.jumpPressed = false;
    inputs.keyPressed = false;
  };

  window.onmousedown = (e) => {
    // inputs.keyPressed = true;
  };

  window.onkeydown = (e) => {
    if (e.keyCode === 87 || e.keyCode === 38) {
      inputs.upHeld = true;
    }
    if (e.keyCode === 83 || e.keyCode === 40) {
      inputs.downHeld = true;
    }
    if(e.keyCode === 65 || e.keyCode === 37) {
      inputs.leftHeld = true;
    } else if(e.keyCode === 68 || e.keyCode === 39) {
      inputs.rightHeld = true;
    }

    if (e.keyCode === 74 || e.keyCode === 90 || e.keyCode === 32) {
      inputs.jumpHeld = true;
      if (inputs.jumpFresh) {
        inputs.jumpPressed = true;
        inputs.jumpFresh = false;
      }
    }
    if (e.keyCode === 75 || e.keyCode === 88) {
      inputs.runHeld = true;
    }
    //p
    if (e.keyCode === 80) {
      inputs.pausePressed = true;
    }

    inputs.keyPressed = true;
  };

  window.onkeyup = (e) => {
    if (e.keyCode === 87 || e.keyCode === 38) {
      inputs.upHeld = false;
    }
    if (e.keyCode === 83 || e.keyCode === 40) {
      inputs.downHeld = false;
    }
    if (e.keyCode === 65 || e.keyCode === 37) {
      inputs.leftHeld = false;
    }
    if (e.keyCode === 68 || e.keyCode === 39) {
      inputs.rightHeld = false;
    }

    if (e.keyCode === 74 || e.keyCode === 90  || e.keyCode === 32) {
      inputs.jumpHeld = false;
      inputs.jumpReleased = true;
      inputs.jumpFresh = true;
    }
    if (e.keyCode === 75 || e.keyCode === 88) {
      inputs.runHeld = false;
    }
  };

  return {inputs, update};
};

module.exports = Input;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const AnimatedSprite = __webpack_require__(1);

class MarioSprite extends AnimatedSprite {
  parseState() {
    let oldState = this.currentState;
    if (this.target.animation.face === 'right') {
      this.col = 0;
    } else {
      this.col = 2;
    }
    switch (this.target.animation.state) {
      case 'walk':
        this.range = {start: 0, end: 3};
        break;
      case 'idle':
        this.range = {start: 0, end: 0};
        break;
      case 'victory':
        this.range = {start: 15, end: 15};
        break;
      case 'jump':
        this.range = {start: 10, end: 10};
        break;
      case 'fall':
        this.range = {start: 11, end: 11};
        break;
      case 'skid':
        this.range = {start: 6, end: 6};
        break;
      case 'run':
        this.range = {start: 3, end: 6};
        break;
      case 'runJump':
        this.range = {start: 12, end: 12};
        break;
      case 'duck':
        this.range = {start: 9, end: 9};
        break;
      case 'lookUp':
        this.range = {start: 8, end: 8};
        break;
      case 'die':
        this.range = {start: 13, end: 15};
        this.col = 0;
        this.ticksPerFrame = 4;
        break;
      default:

    }

    this.currentState = this.target.animation.state;

    if (this.currentState !== oldState) {
      this.lastState = oldState;
      this.stateChange();
    }
  }

  update() {
    this.parseState();
    super.update();
  }
}

module.exports = MarioSprite;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const LevelCreator = __webpack_require__(13);

class Level1 extends LevelCreator {
  constructor(ctx) {
    super(ctx);
    this.createLevel(this.mapLevel());
  }

  mapLevel() {

    //get keys
    let { pl, en, ki, tl, to, tr, ml, mi,
          mr, bl, bo, br, __, ww, we, wl,
          wr, ch, bt, bm, ft, fm, tt, go,
          gg, ib, co, tw, wt
        } = this.getKeys();

    const m4 = {
      chunk: [
        [__,__,__,__,__,__,__,__,gg,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,ww,to,we,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,bl],
        [__,__,__,wl,mi,wr,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,bl],
        [to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to],
        [mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
        [mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
        [mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
        [mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
        [mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      ]
    };

    const m3 = {
      chunk: [
        [__,__,__,__,__,__,__,__,wt,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,m4],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,wt,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,ib,ib,ib,ib,ib,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,ch,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,ib,ib,ib,ib,ib,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,ww,to,__],
        [__,__,ww,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,we,en,en,en,en,en,en,en,en,en,wl,mi,__],
        [__,__,wl,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,ib,ib,ib,ib,ib,ib,ib,ib,ib,wl,mi,__],
        [__,__,wl,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__,__,__,__,__,__,__,__,__,wl,mi,__],
        [__,__,wl,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__,__,__,__,__,__,__,__,__,wl,mi,__],
        [__,__,wl,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__,__,__,__,__,__,__,__,__,wl,mi,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      ]
    };

    const m2 = {
      chunk: [
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,m3],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,en,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,tw,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,tw,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,tw,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,tw,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,tw,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      ]
    };

    const m1 = {
      chunk: [
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,m2],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,ib,ib,ib,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,pl,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,tl,to,tr,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,ml,mi,mr,tl,to,to,to,to,to,tr,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,ml,mi,mr,ml,mi,mi,mi,mi,mi,mr,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,ml,mi,mr,ml,mi,mi,mi,mi,mi,mr,__,__,__,__,__,__,__,__,en,__,__,__,__,__],
        [tl,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,we,__],
        [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
        [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
        [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
        [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
        [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [ki,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      ]
    };

    const m7 = {
      chunk: [
        [__,__,__,__,__,gg,__,__],
        [__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__],
        [__,__,__,pl,__,__,__,__],
        [__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__],
        [__,__,__,bo,__,bo,bo,__],
      ]
    };

    return m1;
  }
}

module.exports = Level1;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(0);
const Sprite = __webpack_require__(3);

const Coin = __webpack_require__(14);
const ItemBlock = __webpack_require__(16);
const Player = __webpack_require__(6);
const Galoomba = __webpack_require__(18);
const GoalTape = __webpack_require__(20);

class Level {
  constructor(canvases) {
    this.canvases = canvases;
    this.colliders = [];
    this.tiles = [];
    this.entities = {player: null, enemies: [], items: []};
  }

  getKeys() {
    let objectSheet = new Image();
    objectSheet.src = 'assets/images/misc_objects.png';

    const pl = {
      entity: 'player'
    };
    const en = {
      entity: 'enemy'
    };

    const ki = {
      entity: 'kill'
    };

    //main ground tiles
    const tl = { row: 0, col: 0, collider: 'through', height: 16, offset: {x: 0, y: -8}};
    const to = { row: 1, col: 0, collider: 'through', height: 16, offset: {x: 0, y: -8}};
    const tr = { row: 2, col: 0, collider: 'through', height: 16, offset: {x: 0, y: -8}};
    const ml = { row: 0, col: 1, collider: false};
    const mi = { row: 1, col: 1, collider: false};
    const mr = { row: 2, col: 1, collider: false};
    const bl = { row: 0, col: 2, collider: 'block'};
    const bo = { row: 1, col: 2, collider: 'block'};
    const br = { row: 2, col: 2, collider: 'block'};
    const __ = null;

    //walls and and corners
    const ww = { row: 3, col: 0, collider: 'block'};
    const we = { row: 5, col: 0, collider: 'block'};
    const wl = { row: 3, col: 1, collider: 'block'};
    const wr = { row: 5, col: 1, collider: 'block'};
    const wb = { row: 3, col: 2, collider: 'block'};
    const wd = { row: 5, col: 2, collider: 'block'};

    //3 x 3 chunk
    const ch = {
      chunk: [
        [ww,to,we],
        [wl,mi,wr],
        [wb,bo,wd],
      ]
    };

    const tw = {
      chunk: [
        [tl,to,tr],
        [ml,mi,mr],
        [ml,mi,mr],
        [ml,mi,mr],
        [ml,mi,mr],
        [ml,mi,mr],
        [ml,mi,mr],
        [ml,mi,mr],
        [ml,mi,mr],
        [ml,mi,mr],
        [ml,mi,mr],
      ]
    };
    const wt = {
      chunk: [
        [ww,to,we],
        [wl,mi,wr],
        [wl,mi,wr],
        [wl,mi,wr],
        [wl,mi,wr],
        [wl,mi,wr],
        [wl,mi,wr],
        [wb,bo,wd],
      ]
    };

    //goal gate
    const bt = { row: 0, col: 7, collider: false};
    const bm = { row: 0, col: 8, collider: false};
    const ft = { row: 1, col: 7, collider: false};
    const fm = { row: 1, col: 8, collider: false};
    const tt = { row: 2, col: 7, collider: 'trigger', width: 64, entity: 'tape'};
    const go = {entity: 'goal'};
    const g1 = {
      chunk: [
        [bt,__],
        [bm,__],
        [bm,__],
        [bm,__],
        [bm,__],
        [bm,__],
        [bm,__],
        [bm,__],
        [bm,tt],
      ],
      sheet: objectSheet,
      ctx: this.canvases.main.getContext('2d')
    };
    const g2 = {
      chunk: [
        [ft],
        [fm],
        [fm],
        [fm],
        [fm],
        [fm],
        [fm],
        [fm],
        [fm],
      ],
      sheet: objectSheet,
      ctx: this.canvases.main.getContext('2d')
    };
    const gg = {
      chunk: [
        [g1,__,g2]
      ]
    };


    const ib = { row: 0, col: 2, collider: 'block', sheet: objectSheet, entity: 'itemBlock'};
    const co = { row: 0, col: 4, collider: false, sheet: objectSheet, entity: 'coin'};

    return {
      pl, en, ki, tl, to, tr, ml, mi,
      mr, bl, bo, br, __, ww, we, wl,
      wr, ch, bt, bm, ft, fm, tt, go,
      gg, ib, co, tw, wt
    };
  }

  createLevel(level) {
    let groundSheet = new Image();
    groundSheet.src = 'assets/images/ground_tiles.png';

    const map = [[level]];

    this.ParseMap(map, groundSheet, {x:0, y: 0}, true);
  }

  createTile(key, sheet, i, j, offset, ctx) {
    let newTile = new Sprite({
      ctx: ctx || this.canvases.main.getContext('2d'),
      image: key.sheet || sheet,
      pos: {x: (i + offset.x) * 32, y: (j + offset.y) * 32},
      row: key.row,
      col: key.col
    });

    return newTile;
  }

  createCollider(key, i, j, offset) {
    const pixelOffset = key.offset || {x: 0, y: 0};
    let newCollider = new Shape({
      pos: {x: ((i + offset.x) * 32) + pixelOffset.x, y: ((j + offset.y) * 32) + pixelOffset.y},
      width: key.width || 32,
      height: key.height || 32,
      color: 'rgba(0,0,0,0)'},
      this.canvases.main.getContext('2d'),
      key.collider
    );
    return newCollider;
  }

  createEntity(type, x, y) {
    switch (type) {
      case 'player':
        this.entities.player = new Player({pos: {x, y}}, [], this.canvases.entities.getContext('2d'));
        return;
      case 'coin':
        const coin = new Coin({ctx: this.canvases.main.getContext('2d'), pos: {x, y}});
        this.entities.items.push(coin);
        this.colliders.push(coin.shape);
        return;
      case 'itemBlock':
        const itemBlock = new ItemBlock({ctx: this.canvases.main.getContext('2d'), pos: {x, y}});
        this.entities.items.push(itemBlock);
        this.colliders.push(itemBlock.shape);
        return;
      case 'enemy':
        let enemy = new Galoomba({pos: {x, y}, width: 32, height: 32}, [], this.canvases.entities.getContext('2d'));
        this.entities.enemies.push(enemy);
        this.colliders.push(enemy.trigger);
        return;
      case 'tape':
        const ctx = this.canvases.main.getContext('2d');
        const tape = new GoalTape({x: x - 32, y}, ctx);
        this.tiles.push(tape);
        this.colliders.push(tape.collider);

        let newCollider = new Shape({
          pos: {x: x + 32, y},
          width: 32,
          height: 1028,
          color: 'rgba(0,0,0,0)'},
          ctx,
          'trigger',
          tape
        );
        this.colliders.push(newCollider);
        return;
      case 'goal':
        return;
      case 'kill':
        this.colliders.push(new Shape({pos: {x, y}, width: 10000, height: 32}, this.canvases.main.getContext('2d'), 'kill'));
        return;
      default:

    }
  }

  ParseMap(map, sheet, offset={x:0, y:0}, main, ctx) {
    map.forEach((row, j) => {
      row.forEach((key, i) => {
        if (key === null) {
          return;
        }

        if (key.entity) {
          this.createEntity(key.entity, (i + offset.x) * 32, (j + offset.y) * 32);
          return;
        }
        if (key.chunk) {
          this.ParseMap(key.chunk, key.sheet || sheet, {x: i + offset.x, y: j + offset.y}, false, key.ctx);
          return;
        }

        if (key.collider) {
          let newCollider = this.createCollider(key, i, j, offset);
          this.colliders.push(newCollider);
        }

        let newTile = this.createTile(key, sheet, i, j, offset, ctx);
        this.tiles.push(newTile);

      });
    });

    if (main) {
      this.finishParse();
    }
  }

  finishParse() {
    this.entities.player.colliders,
    this.entities.player.collision.colliders = this.colliders;

    this.entities.player.enemies = this.entities.enemies,
    this.entities.player.collision.enemies = this.entities.enemies;

    this.entities.enemies.forEach((entity) => {
      entity.colliders, entity.collision.colliders = this.colliders;
    });
  }
}

module.exports = Level;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(0);
const CoinSprite = __webpack_require__(15);
const SFX = __webpack_require__(2);
const sfx = new SFX();

class Coin {
  constructor({ctx, pos}) {
    this.shape = new Shape({pos: pos, width: 32, height: 32}, ctx, 'coin', this);
    this.vel = {x: 1, y: 1};

    this.ctx = ctx;
    this.sprite = this.createSprite();

    this.animation = {state: 'idle'};
    this.status = {remove: false};
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/misc_objects.png';
    return new CoinSprite({ctx: this.ctx, image: image, target: this, numberOfFrames: 4});
  }

  update() {
    this.sprite.update();
  }

  die() {
    sfx.sounds.coin.play();
    this.status.remove = true;
  }
}

module.exports = Coin;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const AnimatedSprite = __webpack_require__(1);

class CoinSprite extends AnimatedSprite {

  constructor(params) {
    const image = new Image();
    image.src = 'assets/images/misc_objects.png';
    params.image = image;
    params.col = 4;
    params.ticksPerFrame = 12;
    params.offset = {x: 0, y: 0};
    params.staticSpeed = true;
    super(params);
  }
  parseState() {
    let oldState = this.currentState;

    switch (this.target.animation.state) {
      case 'idle':
        this.range = {start: 0, end: 3};
        break;
      default:

    }

    this.currentState = this.target.animation.state;

    if (this.currentState !== oldState) {
      this.stateChange();
    }
  }

  update() {
    this.parseState();
    super.update();
  }
}

module.exports = CoinSprite;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(0);
const ItemBlockSprite = __webpack_require__(17);

class ItemBlock {
  constructor({ctx, pos}) {
    this.shape = new Shape({pos: pos, width: 32, height: 32}, ctx, 'itemBlock', this);
    this.vel = {x: 1, y: 1};

    this.ctx = ctx;
    this.sprite = this.createSprite();

    this.animation = {state: 'idle'};
    this.status = {remove: false};
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/misc_objects.png';
    return new ItemBlockSprite({ctx: this.ctx, image: image, target: this, numberOfFrames: 4});
  }

  update() {
    this.sprite.update();
  }

  flip() {

    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    //kinda lame :/
    setTimeout(() => {
      this.sprite.offset.y = 10;
    }, 50);
    setTimeout(() => {
      this.sprite.offset.y = 2;
      this.animation.state = 'flip';
    }, 100);
    setTimeout(() => {
      this.sprite.offset.y = -1;
    }, 150);
    setTimeout(() => {
      this.sprite.offset.y = 0;
    }, 200);

    this.resetTimer = setTimeout(() => {
      this.animation.state = 'idle';
    }, 3000);
  }

  die() {
    this.status.remove = true;
  }
}

module.exports = ItemBlock;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const AnimatedSprite = __webpack_require__(1);

class ItemBlockSprite extends AnimatedSprite {

  constructor(params) {
    const image = new Image();
    image.src = 'assets/images/misc_objects.png';
    params.image = image;
    params.col = 2;
    params.ticksPerFrame = 10;
    params.offset = {x: 0, y: 0};
    params.staticSpeed = true;
    super(params);
  }
  parseState() {
    let oldState = this.currentState;

    switch (this.target.animation.state) {
      case 'idle':
        this.range = {start: 0, end: 0};
        break;
      case 'flip':
        this.range = {start: 0, end: 4};
        break;
      default:

    }

    this.currentState = this.target.animation.state;

    if (this.currentState !== oldState) {
      this.stateChange();
    }
  }

  update() {
    this.parseState();
    super.update();
  }
}

module.exports = ItemBlockSprite;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(0);
const MovingObject = __webpack_require__(4);
const GaloombaSprite = __webpack_require__(19);
const SFX = __webpack_require__(2);
const sfx = new SFX();

class Galoomba extends MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    super(shapeParameters, colliders, ctx);
    this.pos = shapeParameters.pos;
    this.ctx = ctx;
    this.sprite = this.createSprite();
    this.trigger = this.createTrigger();
    this.input.x = -1;
    this.stats.walkSpeed = 0.5;
    this.animation.state = 'walk';
    this.status.active = false;
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/galoomba.png';
    return new GaloombaSprite({ctx: this.ctx, image: image, target: this, numberOfFrames: 4});
  }

  createTrigger() {
    const trigger = new Shape({
      pos: {x : (this.pos.x - 384), y: this.pos.y},
      width: 32,
      height: 512},
      this.ctx,
      "trigger",
      this);
    return trigger;
  }

  update() {
    if (this.status.active) {
      super.update();
      this.sprite.update();
      this.handleMovement();
    }
  }

  handleMovement() {
    if (this.collision.walled) {
      this.input.x *= -1;
    }
    if (this.input.x < -0) {
      this.animation.face = "right";
    } else if (this.input.x > 0) {
      this.animation.face = "left";
    }
  }

  setTrigger() {
    this.status.active = true;
  }

  die() {
    //re add trigger on death
    sfx.sounds.stomp.play();
    super.die();
  }
}

module.exports = Galoomba;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const AnimatedSprite = __webpack_require__(1);

class GaloombaSprite extends AnimatedSprite {
  parseState() {
    let oldState = this.currentState;

    if (this.target.animation.face === 'right') {
      this.col = 0;
    } else {
      this.col = 2;
    }

    switch (this.target.animation.state) {
      case 'walk':
        this.range = {start: 0, end: 2};
        this.ticksPerFrame = 24;
        break;
      default:

    }

    this.currentState = this.target.animation.state;

    if (this.currentState !== oldState) {
      this.stateChange();
    }
  }

  update() {
    this.parseState();
    super.update();
  }
}

module.exports = GaloombaSprite;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(0);
const Sprite = __webpack_require__(3);

class GoalTape {
  constructor(pos, ctx) {
    this.pos = pos;
    this.startPos = {x: 0, y: 0};
    this.startPos.x = pos.x;
    this.startPos.y = pos.y;
    this.dir = -1;

    this.ctx = ctx;
    this.collider = this.createCollider();
    this.sprite = this.createSprite();
    this.triggered = false;
  }

  createCollider() {
    let newCollider = new Shape({
      pos: this.pos,
      width: 64,
      height: 32,
      color: 'rgba(0,0,0,0)'},
      this.ctx,
      'trigger',
      this
    );
    return newCollider;
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/misc_objects.png';
    return new Sprite({
      ctx: this.ctx,
      width: 64,
      image: image,
      row: 2,
      col: 7,
      pos: this.pos,
      special: "tape",
      offset: {x: -32, y: 0}
    });
  }

  moveGoalTape() {
    let tape = this.collider;
    if (this.pos.y < this.startPos.y - 256) {
      this.dir = 1;
    }
    if (this.pos.y > this.startPos.y) {
      this.dir = -1;
    }

    this.pos.y += 2 * this.dir;
  }

  update() {
    if (!this.triggered) {
      this.sprite.update();
    }
    this.collider.update();
    this.collider.pos = this.pos;
    this.moveGoalTape();
    // this.sprite.pos.y -= 2;
  }

  setTrigger(collidee) {
    this.triggered = true;
    collidee.victory();
  }

}

module.exports = GoalTape;


/***/ })
/******/ ]);