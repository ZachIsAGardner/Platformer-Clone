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
      target
    };
  }

  parseState() {
    if (this.object.target.animation.face === 'right') {
      this.object.column = 0;
    } else {
      this.object.column = 1;
    }
    if (this.object.target.animation.state === 'walk') {
      this.object.range = {start: 0, end: 3};
    }
    if (this.object.target.animation.state === "idle") {
      this.object.range = {start: 0, end: 0};
    }

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
    this.object.ctx.drawImage(
      this.object.image,
      this.object.row * 32,
      this.object.column * 32,
      this.object.width,
      this.object.height,
      this.object.target.shape.pos.x,
      this.object.target.shape.pos.y,
      this.object.width,
      this.object.height
    );

  }

}

module.exports = Sprite;
