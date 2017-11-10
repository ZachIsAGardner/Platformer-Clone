const AnimatedSprite = require('./animated_sprite.js');

class CoinSprite extends AnimatedSprite {

  constructor(params) {
    const image = new Image();
    image.src = 'assets/images/misc_objects.png';
    params.image = image;
    params.col = 4;
    params.ticksPerFrame = 12;
    params.offset = {x: 0, y: 0};
    params.staticSpeed = true;
    super(params);
  }
  parseState() {
    let oldState = this.object.currentState;

    switch (this.object.target.animation.state) {
      case 'idle':
        this.object.range = {start: 0, end: 3};
        break;
      default:

    }

    this.object.currentState = this.object.target.animation.state;

    if (this.object.currentState !== oldState) {
      this.stateChange();
    }
  }

  update() {
    this.parseState();
    super.update();
  }
}

module.exports = CoinSprite;
