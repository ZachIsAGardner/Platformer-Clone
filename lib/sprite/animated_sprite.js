const Sprite = require('./sprite.js');

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
