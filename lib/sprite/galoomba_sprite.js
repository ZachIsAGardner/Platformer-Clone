const AnimatedSprite = require('./animated_sprite.js');

class GaloombaSprite extends AnimatedSprite {
  parseState() {
    let oldState = this.currentState;

    if (this.target.animation.face === 'right') {
      this.col = 0;
    } else {
      this.col = 2;
    }

    switch (this.target.animation.state) {
      case 'walk':
        this.range = {start: 0, end: 2};
        this.ticksPerFrame = 24;
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

module.exports = GaloombaSprite;
