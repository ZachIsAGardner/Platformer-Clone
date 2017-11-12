const Shape = require('../shape');
const MovingObject = require('./moving_object.js');
const GaloombaSprite = require('../sprite/galoomba_sprite.js');
const SFX = require('../sfx.js');
const sfx = new SFX();

class Galoomba extends MovingObject {
  constructor(shapeParameters, colliders, ctx) {
    super(shapeParameters, colliders, ctx);
    this.pos = shapeParameters.pos;
    this.ctx = ctx;
    this.sprite = this.createSprite();
    this.trigger = this.createTrigger();
    this.input.x = -1;
    this.stats.walkSpeed = 0.5;
    this.animation.state = 'walk';
    this.status.active = false;
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/galoomba.png';
    return new GaloombaSprite({ctx: this.ctx, image: image, target: this, numberOfFrames: 4});
  }

  createTrigger() {
    const trigger = new Shape({
      pos: {x : (this.pos.x - 384), y: this.pos.y},
      width: 32,
      height: 512},
      this.ctx,
      "trigger",
      this);
    return trigger;
  }

  update() {
    if (this.status.active) {
      super.update();
      this.sprite.update();
    }
  }

  setTrigger() {
    this.status.active = true;
  }

  die() {
    //re add trigger on death
    sfx.sounds.stomp.play();
    super.die();
  }
}

module.exports = Galoomba;
