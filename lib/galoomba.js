const MovingObject = require('./moving_object.js');
const GaloombaSprite = require('./sprite/galoomba_sprite.js');

class Galoomba extends MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    super(shapeParameters, colliders, ctx);
    this.ctx = ctx;
    this.sprite = this.createSprite();
    this.input.x = -1;
    this.stats.walkSpeed = 0.5;
    this.animation.state = 'walk';
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/galoomba.png';
    return new GaloombaSprite({ctx: this.ctx, image: image, target: this, numberOfFrames: 4});
  }

  update() {
    super.update();
    this.sprite.update();
  }
}

module.exports = Galoomba;
