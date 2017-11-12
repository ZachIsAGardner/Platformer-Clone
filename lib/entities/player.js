const MovingObject = require('./moving_object.js');
const Input = require('../input.js');
const MarioSprite = require('../sprite/mario_sprite.js');

class Player extends MovingObject {
  constructor(shapeParameters, colliders, ctx, enemies) {
    // shapeParameters.color = 'rgba(255,255,255,0.5)';
    super(shapeParameters, colliders, ctx, enemies);
    this.ctx = ctx;
    this.sprite = this.createSprite();
    this.inputFetcher = new Input();
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
            this.animation.state = "idle";
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

    if (this.inputFetcher.inputs.upHeld) {
      this.input.y = 1;
    } else {
      this.input.y = 0;
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
