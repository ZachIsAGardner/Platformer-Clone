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
