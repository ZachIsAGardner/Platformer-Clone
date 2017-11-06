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
