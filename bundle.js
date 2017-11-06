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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__) {

"use strict";
const Util = function() {
  //constructor
};

Util.prototype.lerp = function(from, to, time) {
  return from + time * (to - from);
};

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(2);

const canvasEl = document.getElementsByTagName("canvas")[0];

// canvasEl.width = window.innerWidth;
// canvasEl.height = window.innerHeight;
canvasEl.width = 1280;
canvasEl.height = 720;

new Game(canvasEl.width, canvasEl.height).start(canvasEl);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);

const Square = __webpack_require__(3);
const Shape = __webpack_require__(5);
const MovingObject = __webpack_require__(6);

const Sprite = __webpack_require__(9);

const Level = __webpack_require__(8);

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
    let cameraCenter = [-target.shape.pos.x + canvasEl.width / 2, (-target.shape.pos.y + canvasEl.height / 2) + 150];
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const util = new Util();

class Square {
  constructor(centerX, centerY, width, height, color, colliders, ctx) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.width = width;
    this.height = height;
    this.color = color;

    this.colliders = colliders;

    this.moveX = 0;
    this.velX = 0;
    this.moveSpeed = 4;
    this.groundAcc = 0.105;
    this.airAcc = 0.045;

    this.velY = 0;
    this.minJumpVel = -3;
    this.maxJumpVel = -7.25;
    this.grav = 0.2;

    this.grounded = false;

    this.leftHeld = false;
    this.rightHeld = false;
    this.jumpPressed = false;

    this.ctx = ctx;
  }

  update(ctx) {
    this.handleInput();
    this.movePos();
    this.render(ctx);
    this.collisions(ctx);
  }

  handleInput() {
    if (!this.leftHeld && !this.rightHeld) {
      this.moveX = 0;
    }
    if (this.leftHeld && !this.rightHeld) {
      this.moveX = -1;
    }
    if (this.rightHeld && !this.leftHeld) {
      this.moveX = 1;
    }
    if (this.jumpPressed) {
      this.jump();
      this.jumpPressed = false;
    }
  }

  calcVelX() {
    if (this.grounded) {
      this.velX = util.lerp(this.velX, this.moveX, this.groundAcc);
    } else {
      this.velX = util.lerp(this.velX, this.moveX, this.airAcc);
    }
  }

  calcVelY() {
    this.velY += this.grav;
  }

  minJump() {
    if (this.velY < this.minJumpVel) {
      this.velY = this.minJumpVel;
    }
  }

  jump() {
    if (this.grounded) {
      this.velY = this.maxJumpVel;
    }
  }

  movePos() {
    this.calcVelX();
    this.centerX += (this.velX * this.moveSpeed);

    this.calcVelY();
    this.centerY += this.velY;
  }

  //---

  collisions(ctx) {
    this.horizontalCollisions(ctx);
    this.grounded = this.verticalCollisions(ctx);
  }

  horizontalCollisions(ctx) {
    const amount = 4;
    //Prevents a hit with a collider below the square
    const skin = 0.5;

    for (var i = 0; i < amount; i++) {
      let startX = 0;
      let endX = 0;

      let spacing = (i * ((this.height - skin) / (amount - 1)));

      if (this.velX > 0) {
        startX = [this.calcCenter()[0] + (this.width / 2), this.centerY + spacing];
        endX = [this.calcCenter()[0] + (this.width / 2) + Math.abs(this.velX), this.centerY + spacing];
      } else {
        startX = [this.calcCenter()[0] - (this.width / 2), this.centerY + spacing];
        endX = [this.calcCenter()[0] - (this.width / 2) - Math.abs(this.velX), this.centerY + spacing];
      }

      let hit = this.raycast(startX, endX, ctx, 'horizontal');

      if (hit) {
        if (this.velX > 0) {
          this.centerX = (hit.collider.calcCenter()[0] - hit.collider.width / 2) - this.width;
        } else {
          this.centerX = (hit.collider.calcCenter()[0] + hit.collider.width / 2);
        }
        this.velX = 0;
      }
    }
  }

  verticalCollisions(ctx) {
    const amount = 4;

    let anyCollisions = false;

    for (var i = 0; i < amount; i++) {
      let startY = 0;
      let endY = 0;

      let spacing = (i * (this.width / (amount - 1)));

      if (this.velY > 0) {
        startY = [this.centerX + spacing, this.calcCenter()[1] + (this.height / 2)];
        endY = [this.centerX + spacing, this.calcCenter()[1] + (this.height / 2) + Math.abs(this.velY)];
      } else {
        startY = [this.centerX + spacing, this.calcCenter()[1] - (this.height / 2)];
        endY = [this.centerX + spacing, this.calcCenter()[1] - (this.height / 2) - Math.abs(this.velY)];
      }

      let hit = this.raycast(startY, endY, ctx, 'vertical');

      if (hit) {
        if (this.velY > 0) {
          this.centerY = (hit.collider.calcCenter()[1] - hit.collider.height / 2) - this.height;
        } else {
          this.centerY = (hit.collider.calcCenter()[1] + hit.collider.height / 2);
        }

        anyCollisions = true;
        this.velY = 0;
      }

    }
    return anyCollisions;
  }

  checkCollision(point, type) {
    //checks if point is within any of the colliders
    let collision = false;

    for (var i = 0; i < this.colliders.length; i++) {
      if (point[1] > this.colliders[i].calcCenter()[1] - (this.colliders[i].height / 2) && point[1] < this.colliders[i].calcCenter()[1] + (this.colliders[i].height / 2)) {
        if (point[0] > this.colliders[i].calcCenter()[0] - (this.colliders[i].width / 2) && point[0] < this.colliders[i].calcCenter()[0] + (this.colliders[i].width / 2)) {
          return { collider: this.colliders[i]};
        }
      }
    }
  }

  //---

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.centerX, this.centerY, this.width, this.height);
  }

  calcCenter() {
    return [this.centerX + (this.width / 2), this.centerY + (this.height / 2)];
  }

  raycast(start, end, ctx, type) {
    if (type !== 'grounded') {
      this.renderRaycast(start, end, 'red', ctx);
    }
    return this.checkCollision(end, type);
  }

  renderRaycast(start, end, color, ctx) {
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  }

}

module.exports = Square;


/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports) {

class Shape {
  constructor(params, ctx) {
    this.width = params.width;
    this.height = params.height;
    this.color = params.color;

    this.pos = {x: 0, y: 0};
    this.setPos(params.x, params.y);

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const util = new Util();
const Shape = __webpack_require__(5);
const Input = __webpack_require__(4);
const Collision = __webpack_require__(7);

class MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    this.shape = new Shape(shapeParameters, ctx);
    this.vel = {x: 0, y: 0};
    this.input = {x: 0, y: 0, jump: false};
    this.inputFetcher = new Input();
    this.stats = {
      walkSpeed: 3.65,
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
    this.colliders = colliders;
    this.collision = new Collision(this, ctx);

    this.status = {grounded: false, running: false, pMeter: 0, pRun: false};
  }

  update() {
    this.handleInput();
    this.handleAnimation();
    this.inputFetcher.update();

    this.movePos();
    this.calcVel();
    this.shape.render();

    this.collision.collisions();
  }

  handleAnimation() {

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
}

module.exports = MovingObject;


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

        if (this.vel.x > 0) {
          this.shape.pos.x = (hit.collider.calcCenter().x - hit.collider.width / 2) - this.shape.width;
        } else {
          this.shape.pos.x = (hit.collider.calcCenter().x + hit.collider.width / 2);
        }
        this.vel.x = 0;
      }
    }
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
        if (this.vel.y > 0) {
          this.shape.pos.y = (hit.collider.calcCenter().y - hit.collider.height / 2) - this.shape.height;
        } else {
          this.shape.pos.y = (hit.collider.calcCenter().y + hit.collider.height / 2);
        }

        anyCollisions = true;
        this.vel.y = 0;
      }
    }

    return anyCollisions;
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

  raycast(start, end, type) {
    this.renderRaycast(start, end, 'red');
    return this.checkCollision(end, type);
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
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(5);

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.createLevel();
  }
  createLevel() {
    const ground = new Shape({x: 200, y: 850, width: 4000, height: 900, color: 'black'}, this.ctx);
    const ground2 = new Shape({x: 700, y: 850, width: 400, height: 900, color: 'black'}, this.ctx);
    const ground3 = new Shape({x: -150, y: 0, width: 400, height: 1600, color: 'black'}, this.ctx);
    const ground4 = new Shape({x: 650, y: 150, width: 800, height: 32, color: 'black'}, this.ctx);

    this.colliders = [ground, ground2, ground3, ground4];
  }
}

module.exports = Level;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

class Sprite {
  constructor({ctx, width, height, image, ticksPerFrame, target, state, face}) {
    this.object = {
      ctx,
      width,
      height,
      image,
      row: 0,
      column: 0,
      tickCount: 0,
      ticksPerFrame: 6,
      numberOfFrames: 14,
      range: {start: 0, end: 3},
      target,
      currentState: 'idle'
    };
  }

  parseState() {
    let oldState = this.object.currentState;
    if (this.object.target.animation.face === 'right') {
      this.object.column = 0;
    } else {
      this.object.column = 1;
    }
    switch (this.object.target.animation.state) {
      case 'walk':
        this.object.range = {start: 0, end: 3};
        this.object.ticksPerFrame = 6;
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
        this.object.ticksPerFrame = 2;
        break;
      case 'runJump':
        this.object.range = {start: 12, end: 12};
        break;
      case 'duck':
        this.object.range = {start: 9, end: 9};
        break;
      default:

    }

    this.object.currentState = this.object.target.animation.state;

    if (this.object.currentState !== oldState) {
      this.stateChange();
    }
  }

  stateChange() {
    this.object.row = this.object.range.start;
  }

  update() {
    this.parseState();
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
    //assuming 64 x 64 sized sprite

    this.object.ctx.drawImage(
      this.object.image,
      this.object.row * 64,
      this.object.column * 64,
      this.object.width,
      this.object.height,
      this.object.target.shape.pos.x - 16,
      this.object.target.shape.pos.y - 8,
      this.object.width,
      this.object.height
    );

  }

}

module.exports = Sprite;


/***/ })
/******/ ]);