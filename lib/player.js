const MovingObject = require('./moving_object.js');

class Player extends MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    super(shapeParameters, colliders, ctx);
  }
}

module.exports = MovingObject;
