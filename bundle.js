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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);

const canvasEl = document.getElementsByTagName("canvas")[0];

// canvasEl.width = window.innerWidth;
// canvasEl.height = window.innerHeight;
canvasEl.width = 1280;
canvasEl.height = 720;

new Game(canvasEl.width, canvasEl.height).start(canvasEl);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Square = __webpack_require__(2);
const Input = __webpack_require__(3);

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

Square = function (centerX, centerY, width, height, color, colliders, ctx) {

  this.centerX = centerX;
  this.centerY = centerY;
  this.width = width;
  this.height = height;
  this.color = color;

  this.colliders = colliders;

  this.moveX = 0;
  this.velX = 0;
  this.velY = 0;

  this.minJumpVel = -2;
  this.maxJumpVel = -6;

  this.grav = 0.2;

  this.ctx = ctx;
};

Square.prototype.update = function() {

};

Square.prototype.ghettoLerp = function(from, to, time) {
  if (from > to) {
    from -= 0.1;
  } else {
    from += 0.1;
  }

  if (from < to && to < 0) {
    from = to;
  }
  if (from > to && to > 0) {
    from = to;
  }

  return from;
};

Square.prototype.calcVelX = function() {
  this.velX = this.ghettoLerp(this.velX, this.moveX, 1);
};
Square.prototype.calcVelY = function() {
  this.velY += this.grav;
};

Square.prototype.collisions = function(ctx) {

  //horizontal collisions
  let startX = 0;
  let endX = 0;

  if (this.velX > 0) {
    startX = [this.calcCenter()[0] + (this.width / 2), this.calcCenter()[1]];
    endX = [this.calcCenter()[0] + (this.width / 2) + Math.abs(this.velX), this.calcCenter()[1]];
  } else {
    startX = [this.calcCenter()[0] - (this.width / 2), this.calcCenter()[1]];
    endX = [this.calcCenter()[0] - (this.width / 2) - Math.abs(this.velX), this.calcCenter()[1]];
  }

  this.raycast(startX, endX, ctx, 'horizontal');

  //vertical collisions
  let startY = 0;
  let endY = 0;

  if (this.velY > 0) {
    startY = [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2)];
    endY = [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2) + Math.abs(this.velY)];
  } else {
    startY = [this.calcCenter()[0], this.calcCenter()[1] - (this.height / 2)];
    endY = [this.calcCenter()[0], this.calcCenter()[1] - (this.height / 2) - Math.abs(this.velY)];
  }

  this.raycast(startY, endY, ctx, 'vertical');
};

Square.prototype.checkCollision = function (point, type) {
  //checks if point is within any of the colliders
  for (var i = 0; i < this.colliders.length; i++) {
    if (point[1] > this.colliders[i].calcCenter()[1] - (this.colliders[i].height / 2) && point[1] < this.colliders[i].calcCenter()[1] + (this.colliders[i].height / 2)) {
      if (point[0] > this.colliders[i].calcCenter()[0] - (this.colliders[i].width / 2) && point[0] < this.colliders[i].calcCenter()[0] + (this.colliders[i].width / 2)) {
        if (type === 'vertical') {
          if (this.velY > 0) {
            this.centerY = (this.colliders[i].calcCenter()[1] - this.colliders[i].height / 2) - this.height;
          } else {
            this.centerY = (this.colliders[i].calcCenter()[1] + this.colliders[i].height / 2);
          }
          this.velY = 0;
        } else if (type === 'horizontal') {
          if (this.velX > 0) {
            this.centerX = (this.colliders[i].calcCenter()[0] - this.colliders[i].width / 2) - this.width;
          } else {
            this.centerX = (this.colliders[i].calcCenter()[0] + this.colliders[i].width / 2);
          }
          this.velX = 0;
        }

      }
    }
  }
};

//this is called on jump key lift
Square.prototype.minJump = function() {
  // this.velY = this.minJumpVel;
};

Square.prototype.jump = function() {
  this.velY = this.maxJumpVel;
};

Square.prototype.movePos = function() {
  this.calcVelX(this.moveX);
  this.centerX += (this.velX * 3);

  this.calcVelY();
  this.centerY += this.velY;

  // this is bad because for a frame it will enter the collision
  // this.checkCollision([0, this.calcCenter()[1] + (this.height / 2)]);
};

Square.prototype.render = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.centerX, this.centerY, this.width, this.height);
};

Square.prototype.calcCenter = function() {
  return [this.centerX + (this.width / 2), this.centerY + (this.height / 2)];
};

//-
//--- raycast, seperate into another file later if you feel like it i dont know
//-

Square.prototype.raycast = function(start, end, ctx, type) {
  this.renderRaycast(start, end, 'red', ctx);
  this.checkCollision(end, type);
};

Square.prototype.renderRaycast = function(start, end, color, ctx) {

  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);
  ctx.lineTo(end[0], end[1]);
  ctx.stroke();
};

module.exports = Square;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

Input = function (player) {
  this.player = player;
  that = this;
};


document.addEventListener('keydown', function(event) {

  if(event.keyCode == 87) {
    that.player.jump();
  }
  if(event.keyCode == 65) {
    that.player.moveX = -1;
  } else if(event.keyCode == 68) {
    that.player.moveX = 1;
  }

  // that.player.calcVelX(moveX);
});

document.addEventListener('keyup', function(event) {

  if (event.keyCode == 65 || event.keyCode == 68) {
    that.player.moveX = 0;
  }
  if (event.keyCode == 87) {
    that.player.minJump();
  }

});

module.exports = Input;


/***/ })
/******/ ]);