const AnimatedSprite = require('./animated_sprite.js');

class GaloombaSprite extends AnimatedSprite {
  parseState() {
    let oldState = this.object.currentState;

    if (this.object.target.animation.face === 'right') {
      this.object.col = 0;
    } else {
      this.object.col = 2;
    }

    switch (this.object.target.animation.state) {
      case 'walk':
        this.object.range = {start: 0, end: 2};
        this.object.ticksPerFrame = 24;
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

module.exports = GaloombaSprite;
