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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Shape {
  constructor(params, ctx, type) {
    this.width = params.width;
    this.height = params.height;
    this.color = params.color;

    this.pos = {x: 0, y: 0};
    this.setPos(params.x, params.y);

    this.type = type || '';

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
}

module.exports = Shape;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(3);
const util = new Util();
const Shape = __webpack_require__(0);

const Collision = __webpack_require__(7);
const SFX = __webpack_require__(8);
const sfx = new SFX();

class MovingObject {
  constructor(shapeParameters, colliders, ctx, enemies) {
    this.shape = new Shape(shapeParameters, ctx);
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

    this.status = {grounded: false, running: false, pMeter: 0, pRun: false, alive: true, remove: false};
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
    setTimeout(() => this.remove(), 2000);
  }

  remove() {
    this.status.remove = true;
  }

}

module.exports = MovingObject;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

class AnimatedSprite {
  constructor({ctx, width, height, image, ticksPerFrame, target, state, face, numberOfFrames, offset}) {
    this.object = {
      ctx,
      width: width || 32,
      height: height || 32,
      image,
      row: 0,
      col: 0,
      tickCount: 0,
      ticksPerFrame: 6,
      numberOfFrames: numberOfFrames || 14,
      range: {start: 0, end: 3},
      target,
      currentState: 'idle',
      offset: offset || {x: 0, y: 0}
    };
  }

  stateChange() {
    this.object.row = this.object.range.start;
  }

  update() {
    this.object.ticksPerFrame = 16 / Math.abs(this.object.target.vel.x);
    this.object.tickCount += 1;

    if (this.object.tickCount > this.object.ticksPerFrame) {
      this.object.row += 1;
      this.object.tickCount = 0;
      if (this.object.row > this.object.range.end - 1) {
        this.object.row = this.object.range.start;
      }
    }
    this.render();
  }

  render() {
    this.object.ctx.drawImage(
      this.object.image,
      this.object.row * this.object.width,
      this.object.col * this.object.height,
      this.object.width,
      this.object.height,
      this.object.target.shape.pos.x - this.object.offset.x,
      this.object.target.shape.pos.y - this.object.offset.y,
      this.object.width,
      this.object.height
    );

  }

}

module.exports = AnimatedSprite;


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

class Sprite {
  constructor({ctx, width, height, image, pos, row, col, special}) {
    this.object = {
      ctx,
      width: width || 32,
      height: height || 32,
      image,
      row: row || 0,
      col: col || 0,
      pos: pos || {x: 0, y: 0},
      special
    };
  }

  render() {
    //assuming 32 x 32 sized sprite

    this.object.ctx.drawImage(
      this.object.image,
      this.object.row * 32,
      this.object.col * 32,
      this.object.width,
      this.object.height,
      this.object.pos.x - 16,
      this.object.pos.y - 16,
      this.object.width,
      this.object.height
    );

  }
}

module.exports = Sprite;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(6);

const canvasEl = document.getElementsByTagName("canvas")[0];

// canvasEl.width = window.innerWidth;
// canvasEl.height = window.innerHeight;
canvasEl.width = 1280;
canvasEl.height = 720;

new Game(canvasEl.width, canvasEl.height).start(canvasEl);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(3);
const Shape = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Player = __webpack_require__(9);

const AnimatedSprite = __webpack_require__(2);
const Sprite = __webpack_require__(4);
const Level = __webpack_require__(14);

const playerSquare = {x: 0, y: 200, width: 32, height: 56, color: 'rgba(200,170,255,0)'};
const redSquare = {x: 320, y: 200, width: 32, height: 32, color: 'rgba(200,170,255,0)'};

const util = new Util();

//---

var offset = {x: 0, y: 0};
var border = {
  x: {min: -16, max: 10000}, y: {min: -1024, max: 456}
};

class Game {
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.canvasEl = null;
    this.req = null;
    this.dev = false;

    this.level = null;
    this.colliders = [];
    this.tiles = [];
    this.entities = {player: null, enemies: []};

    this.screen = {alpha: 3, rate: -0.075, loading: true};
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
      offset.y = util.lerp(offset.y, cameraCenter[1], 0.075);
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

  destroyEverything() {
    this.level = null;
    this.colliders = [];
    this.tiles = [];
    this.entities = {player: null, enemies: []};
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
    this.destroyEverything();
    this.start(this.canvasEl);
    cancelAnimationFrame(this.req);
  }

  start(canvasEl) {
    const ctx = canvasEl.getContext("2d");
    this.canvasEl = canvasEl;

    this.level = new Level(ctx);
    this.colliders = this.level.colliders;
    this.tiles = this.level.tiles;
    this.entities = this.level.entities;

    const songs = this.startAudio();


    const animateCallback = () => {
      this.handleAudio(songs[0], songs[1]);
      //clear canvas then render objects
      this.render(ctx);

      this.moveViewport(ctx, canvasEl, this.entities.player);
      this.createBackground(this.entities.player, ctx);

      this.colliders.forEach((collider) => {
        collider.render(ctx);
      });

      this.tiles.forEach((tile) => {
        tile.render(ctx);
      });

      this.entities.player.update();
      this.entities.enemies.forEach((entity, i) => {
        if (entity.status.remove) {
          this.entities.enemies.splice(i, 1);
        }
        entity.update(ctx);
      });

      this.level.update();

      if (this.dev) {
        this.devMethods(this.entities.player);
      }

      if (this.entities.player.status.remove) {
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


/***/ }),
/* 7 */
/***/ (function(module, exports) {

class Collision {
  constructor(object, ctx) {
    this.ctx = ctx;
    this.raycastAmount = 4;
    //Prevents a hit with a collider below the square
    this.skin = 0.5;

    this.object = object;
    this.shape = object.shape;
    this.vel = object.vel;

    this.enemies = object.enemies || [];
    this.colliders = object.colliders;
    this.grounded = false;
  }

  collisions() {
    this.horizontalCollisions();
    this.grounded = this.verticalCollisions();
  }

  horizontalCollisions() {
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
        if (hit.collider) {
          this.handleHorizontalCollision(hit);
        } else if (hit.enemy) {
          this.object.damage();
        }
      }
    }
  }

  handleHorizontalCollision(hit) {
    if (hit.collider.type === 'kill') {
      this.object.die();
      return;
    }
    if (this.vel.x > 0) {
      this.shape.pos.x = (hit.collider.calcCenter().x - hit.collider.width / 2) - this.shape.width;
    } else {
      this.shape.pos.x = (hit.collider.calcCenter().x + hit.collider.width / 2);
    }
    this.vel.x = 0;
  }

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
        if (hit.collider) {
          this.handleVerticalCollision(hit);
        } else {
          this.handleVerticalCollisionEnemy(hit);
        }
        anyCollisions = true;
      }
    }

    return anyCollisions;
  }

  handleVerticalCollision(hit) {
    if (hit.collider.type === 'kill') {
      this.object.die();
      return;
    }
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
      this.object.minJump();
    } else {
      this.object.damage();
    }
  }

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
/* 8 */
/***/ (function(module, exports) {

class SFX {
  constructor() {
    const jump = new Audio ("assets/audio/sfx/smw_jump.wav");
    this.sounds = {
      jump
    };
  }
}

module.exports = SFX;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Input = __webpack_require__(10);
const MarioSprite = __webpack_require__(12);

class Player extends MovingObject {
  constructor(shapeParameters, colliders, ctx, enemies) {
    super(shapeParameters, colliders, ctx, enemies);
    this.ctx = ctx;
    this.sprite = this.createSprite();
    this.inputFetcher = new Input();
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/mario.png';
    return new MarioSprite({ctx: this.ctx, width: 64, height: 64, image: image, target: this, offset:{x:16, y:8}});
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
        if (this.vel.x < 0.5 && this.vel.x > -0.5) {
          this.animation.state = "idle";
        }
        if (this.vel.x > 0.5) {
          this.animation.state = (!this.status.pRun) ? "walk" : "run";
        }
        if (this.vel.x < -0.5) {
          this.animation.state = (!this.status.pRun) ? "walk" : "run";
        }
        if (this.vel.x < -0.5 && this.input.x > 0
          || this.vel.x > 0.5 && this.input.x < 0) {
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
      // sfx.sounds.jump.play();
    }
    if (this.inputFetcher.inputs.jumpReleased
      && this.vel.y < this.stats.minJump
      && !this.collision.grounded) {
      this.minJump();
    }
    this.status.running = this.inputFetcher.inputs.runHeld;
    if (this.collision.grounded) {
      this.status.ducking = this.inputFetcher.inputs.downHeld;
    }
  }

  update(){
    if (this.status.alive) {
      this.handleInput();
      this.inputFetcher.update();
    }
    this.sprite.update();
    this.handleAnimation();
    super.update();
  }

  damage() {
    this.die();
  }

  die() {
    if (this.status.alive) {
      super.die();
      this.jump();
      this.input.x = 0;
      this.vel.x = 0;
    }
  }
}

module.exports = Player;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

const Input = function (entity) {

  let inputs = {
    leftHeld: false,
    rightHeld: false,
    jumpPressed: false,
    jumpReleased: false,
    jumpFresh: true,
    runHeld: false,
    downHeld: false
  };

  const update = () => {
    inputs.jumpReleased = false;
    inputs.jumpPressed = false;
  };

  window.onkeydown = (e) => {
    if (e.keyCode === 74 && inputs.jumpFresh) {
      inputs.jumpPressed = true;
      inputs.jumpFresh = false;
    }
    if (e.keyCode === 83) {
      inputs.downHeld = true;
    }
    if(e.keyCode === 65) {
      inputs.leftHeld = true;
    } else if(e.keyCode === 68) {
      inputs.rightHeld = true;
    }
    //j
    if (e.keyCode === 75) {
      inputs.runHeld = true;
    }
  };

  window.onkeyup = (e) => {
    if (e.keyCode === 65) {
      inputs.leftHeld = false;
    }
    if (e.keyCode === 68) {
      inputs.rightHeld = false;
    }
    if (e.keyCode === 74) {
      inputs.jumpReleased = true;
      inputs.jumpFresh = true;
    }
    if (e.keyCode === 83) {
      inputs.downHeld = false;
    }
    //j
    if (e.keyCode === 75) {
      inputs.runHeld = false;
    }
  };

  return {inputs, update};
};

module.exports = Input;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const GaloombaSprite = __webpack_require__(13);

class Galoomba extends MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    super(shapeParameters, colliders, ctx);
    this.ctx = ctx;
    this.sprite = this.createSprite();
    this.input.x = -1;
    this.stats.walkSpeed = 0.5;
    this.animation.state = 'walk';
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/galoomba.png';
    return new GaloombaSprite({ctx: this.ctx, image: image, target: this, numberOfFrames: 4});
  }

  update() {
    super.update();
    this.sprite.update();
  }
}

module.exports = Galoomba;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const AnimatedSprite = __webpack_require__(2);

class MarioSprite extends AnimatedSprite {
  parseState() {
    let oldState = this.object.currentState;
    if (this.object.target.animation.face === 'right') {
      this.object.col = 0;
    } else {
      this.object.col = 2;
    }
    switch (this.object.target.animation.state) {
      case 'walk':
        this.object.range = {start: 0, end: 3};
        break;
      case 'idle':
        this.object.range = {start: 0, end: 0};
        break;
      case 'jump':
        this.object.range = {start: 10, end: 10};
        break;
      case 'fall':
        this.object.range = {start: 11, end: 11};
        break;
      case 'skid':
        this.object.range = {start: 6, end: 6};
        break;
      case 'run':
        this.object.range = {start: 3, end: 6};
        break;
      case 'runJump':
        this.object.range = {start: 12, end: 12};
        break;
      case 'duck':
        this.object.range = {start: 9, end: 9};
        break;
      case 'die':
        this.object.range = {start: 13, end: 15};
        this.object.col = 0;
        this.object.ticksPerFrame = 4;
        break;
      default:

    }

    this.object.currentState = this.object.target.animation.state;

    if (this.object.currentState !== oldState) {
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const AnimatedSprite = __webpack_require__(2);

class GaloombaSprite extends AnimatedSprite {
  parseState() {
    let oldState = this.object.currentState;

    if (this.object.target.animation.face === 'right') {
      this.object.col = 0;
    } else {
      this.object.col = 2;
    }

    switch (this.object.target.animation.state) {
      case 'walk':
        this.object.range = {start: 0, end: 2};
        this.object.ticksPerFrame = 24;
        break;
      default:

    }

    this.object.currentState = this.object.target.animation.state;

    if (this.object.currentState !== oldState) {
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(0);
const Sprite = __webpack_require__(4);
const Player = __webpack_require__(9);
const Galoomba = __webpack_require__(11);

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.tiles = [];
    this.entities = {player: null, enemies: []};
    this.goalTape = {object: null, startPos: {x: 0, y: 0}, dir: -1};
    this.createLevel();
  }

  moveGoalTape() {
    const tape = this.goalTape;
    if (!tape.object) {
      return;
    }

    tape.object.pos.x = tape.startPos.x - 16;
    if (tape.object.pos.y < tape.startPos.y - 256) {
      tape.dir = 1;
    }
    if (tape.object.pos.y > tape.startPos.y) {
      tape.dir = -1;
    }

    tape.object.pos.y += 2 * tape.dir;
  }

  update() {
    this.moveGoalTape();
  }

  createLevel() {
    let groundSheet = new Image();
    groundSheet.src = 'assets/images/ground_tiles.png';
    let objectSheet = new Image();
    objectSheet.src = 'assets/images/misc_objects.png';
    let marioSheet = new Image();
    marioSheet.src = 'assets/images/mario.png';

    const pl = {
      entity: 'player'
    };
    const en = {
      entity: 'enemy'
    };

    const ki = {
      entity: 'kill'
    };

    const tl = { row: 0, col: 0, collider: true};
    const to = { row: 1, col: 0, collider: true};
    const tr = { row: 2, col: 0, collider: true};
    const ml = { row: 0, col: 1, collider: true};
    const mi = { row: 1, col: 1, collider: false};
    const mr = { row: 2, col: 1, collider: true};
    const bl = { row: 0, col: 2, collider: true};
    const bo = { row: 1, col: 2, collider: true};
    const br = { row: 2, col: 2, collider: true};
    const __ = null;

    const ch = {
      chunk: [
        [tl,to,tr],
        [ml,mi,mr],
        [bl,bo,br],
      ]
    };

    const bt = { row: 0, col: 7, collider: false};
    const bm = { row: 0, col: 8, collider: false};
    const ft = { row: 1, col: 7, collider: false};
    const fm = { row: 1, col: 8, collider: false};
    const tt = { row: 2, col: 7, collider: false, width: 640, special: 'tape'};
    const gg = {
      chunk: [
        [bt,__,ft],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,tt,fm],
      ],
      sheet: objectSheet
    };

    const map = [
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,en,__,__,__,__,__,__,__,__,__,__],
      [__,pl,__,__,__,__,__,tl,to,tr,__,__,__,__,__,__,__,__,__],
      [tl,to,to,to,to,to,to,mi,mi,mi,to,to,to,to,to,tr,__,__,ch],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [ki,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
    ];

    this.ParseMap(map, groundSheet, {x:0, y: 0}, true);
  }

  ParseMap(map, sheet, offset={x:0, y:0}, main) {
    map.forEach((row, j) => {
      row.forEach((key, i) => {
        if (key === null) {
          return;
        }

        if (key.entity) {
          this.createEntity(key.entity, i * 32, j * 32);
          return;
        }
        if (key.chunk) {
          this.ParseMap(key.chunk, key.sheet || sheet, {x:i, y:j});
          return;
        }

        let newTile = new Sprite({
          ctx: this.ctx,
          image: sheet,
          pos: {x: (i + offset.x) * 32, y: (j + offset.y) * 32},
          row: key.row,
          col: key.col,
          width: key.width,
          height: key.height,
        });
        if (key.special === "tape") {
          this.goalTape.object = newTile.object;
          this.goalTape.startPos.x = newTile.object.pos.x;
          this.goalTape.startPos.y = newTile.object.pos.y;
        }
        this.tiles.push(newTile);

        if (key.collider) {
          let newGround = new Shape({
            x: (i + offset.x) * 32,
            y: (j + offset.y) * 32,
            width: 32,
            height: 32,
            color: 'rgba(0,0,0,0)'},
            this.ctx
          );
          this.colliders.push(newGround);

        }
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

  createEntity(type, x, y) {
    switch (type) {
      case 'player':
        this.entities.player = new Player({x, y, width: 32, height: 56}, [], this.ctx);
        return;
      case 'enemy':
        this.entities.enemies.push(new Galoomba({x, y, width: 32, height: 32}, [], this.ctx));
        return;
      case 'kill':
        this.colliders.push(new Shape({x, y, width: 10000, height: 32}, this.ctx, 'kill'));
      default:

    }
  }
}

module.exports = Level;


/***/ })
/******/ ]);