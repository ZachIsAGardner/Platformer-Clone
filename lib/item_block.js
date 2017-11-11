const Shape = require('./shape.js');
const ItemBlockSprite = require('./sprite/item_block_sprite.js');

class ItemBlock {
  constructor({ctx, pos}) {
    this.shape = new Shape({pos: pos, width: 32, height: 32}, ctx, 'block', this);
    this.vel = {x: 1, y: 1};

    this.ctx = ctx;
    this.sprite = this.createSprite();

    this.animation = {state: 'idle'};
    this.status = {remove: false};
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/misc_objects.png';
    return new ItemBlockSprite({ctx: this.ctx, image: image, target: this, numberOfFrames: 4});
  }

  update() {
    this.sprite.update();
  }

  die() {
    this.status.remove = true;
  }
}

module.exports = ItemBlock;
