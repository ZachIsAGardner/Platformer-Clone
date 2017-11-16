const AnimatedSprite = require('./animated_sprite.js');

class ItemBlockSprite extends AnimatedSprite {

  constructor(params) {
    const image = new Image();
    image.src = 'assets/images/misc_objects.png';
    params.image = image;
    params.col = 2;
    params.ticksPerFrame = 10;
    params.offset = {x: 0, y: 0};
    params.staticSpeed = true;
    super(params);
  }
  parseState() {
    let oldState = this.currentState;

    switch (this.target.animation.state) {
      case 'idle':
        this.range = {start: 0, end: 0};
        break;
      case 'flip':
        this.range = {start: 0, end: 4};
        break;
      default:

    }

    this.currentState = this.target.animation.state;

    if (this.currentState !== oldState) {
      this.stateChange();
    }
  }

  update() {
    this.parseState();
    super.update();
  }
}

module.exports = ItemBlockSprite;
