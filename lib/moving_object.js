const Util = require('./util.js');
const util = new Util();
const Shape = require('./shape.js');
const Input = require('./input.js');
const Collision = require('./collision.js');
const SFX = require('./sfx.js');
const sfx = new SFX();

class MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    this.shape = new Shape(shapeParameters, ctx);
    this.vel = {x: 0, y: 0};
    this.input = {x: 0, y: 0, jump: false};
    // if (inputType === 'user') {
    //   this.inputFetcher = new Input();
    // } else if (inputType === 'ai') {
    //   this.inputFetcher = new
    // }
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
    if (this.inputFetcher) {
      this.handleInput();
      this.inputFetcher.update();
    }
    this.handleAnimation();

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
      sfx.sounds.jump.play();
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
