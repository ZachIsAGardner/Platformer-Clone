const Util = require('./util.js');
const util = new Util();
const Shape = require('./shape.js');
const Input = require('./input.js');
const Collision = require('./collision.js');

class MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    this.shape = new Shape(shapeParameters, ctx);
    this.vel = {x: 0, y: 0};
    this.input = {x: 0, y: 0, jump: false};
    this.inputFetcher = new Input();
    this.stats = {
      speed: 2,
      groundAcc: 0.105,
      airAcc: 0.045,
      minJump: -3.5,
      jump: -7.25,
      grav: 0.2
    };
    this.animation = {
      face: 'right',
      state: 'idle'
    };
    this.colliders = colliders;
    this.collision = new Collision(this, ctx);
  }

  update() {
    this.handleInput();
    this.inputFetcher.update();

    this.movePos();
    this.calcVel();
    this.shape.render();

    this.collision.collisions();
  }

  handleInput() {
    if (!this.inputFetcher.inputs.leftHeld
      && !this.inputFetcher.inputs.rightHeld) {
      this.input.x = 0;
      this.animation.state = 'idle';
    }
    if (this.inputFetcher.inputs.leftHeld
      && !this.inputFetcher.inputs.rightHeld) {
      this.input.x = -1;
      this.animation = {face: 'left', state: 'walk'};
    }
    if (!this.inputFetcher.inputs.leftHeld
      && this.inputFetcher.inputs.rightHeld) {
      this.input.x = 1;
      this.animation = {face: 'right', state: 'walk'};
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
  }

  calcVel() {
    this.vel.x = util.lerp(this.vel.x, (this.input.x * this.stats.speed), this.stats.groundAcc);
    this.vel.y += this.stats.grav;
  }

  minJump() {
    this.vel.y = this.stats.minJump;
  }
  jump() {
    this.vel.y = this.stats.jump;
  }

  movePos() {
    this.shape.pos.x += this.vel.x * this.stats.speed;
    this.shape.pos.y += this.vel.y;
  }
}

module.exports = MovingObject;
