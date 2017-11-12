const AnimatedSprite = require('./animated_sprite.js');

class MarioSprite extends AnimatedSprite {
  parseState() {
    let oldState = this.object.currentState;
    if (this.object.target.animation.face === 'right') {
      this.object.col = 0;
    } else {
      this.object.col = 2;
    }
    switch (this.object.target.animation.state) {
      case 'walk':
        this.object.range = {start: 0, end: 3};
        break;
      case 'idle':
        this.object.range = {start: 0, end: 0};
        break;
      case 'victory':
        this.object.range = {start: 15, end: 15};
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
        break;
      case 'runJump':
        this.object.range = {start: 12, end: 12};
        break;
      case 'duck':
        this.object.range = {start: 9, end: 9};
        break;
      case 'lookUp':
        this.object.range = {start: 8, end: 8};
        break;
      case 'die':
        this.object.range = {start: 13, end: 15};
        this.object.col = 0;
        this.object.ticksPerFrame = 4;
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

module.exports = MarioSprite;
