const MovingObject = require('./moving_object.js');

class Galoomba extends MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    super(shapeParameters, colliders, ctx);
    this.input.x = -1;
    this.stats.walkSpeed = 0.5;
    this.animation.state = 'walk';
  }
}

module.exports = Galoomba;
