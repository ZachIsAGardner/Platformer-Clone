const AnimatedSprite = require('./animated_sprite.js');

class MarioSprite extends AnimatedSprite {
  parseState() {
    let oldState = this.currentState;
    if (this.target.animation.face === 'right') {
      this.col = 0;
    } else {
      this.col = 2;
    }
    switch (this.target.animation.state) {
      case 'walk':
        this.range = {start: 0, end: 3};
        break;
      case 'idle':
        this.range = {start: 0, end: 0};
        break;
      case 'victory':
        this.range = {start: 15, end: 15};
        break;
      case 'jump':
        this.range = {start: 10, end: 10};
        break;
      case 'fall':
        this.range = {start: 11, end: 11};
        break;
      case 'skid':
        this.range = {start: 6, end: 6};
        break;
      case 'run':
        this.range = {start: 3, end: 6};
        break;
      case 'runJump':
        this.range = {start: 12, end: 12};
        break;
      case 'duck':
        this.range = {start: 9, end: 9};
        break;
      case 'lookUp':
        this.range = {start: 8, end: 8};
        break;
      case 'die':
        this.range = {start: 13, end: 15};
        this.col = 0;
        this.ticksPerFrame = 4;
        break;
      default:

    }

    this.currentState = this.target.animation.state;

    if (this.currentState !== oldState) {
      this.lastState = oldState;
      this.stateChange();
    }
  }

  update() {
    this.parseState();
    super.update();
  }
}

module.exports = MarioSprite;
