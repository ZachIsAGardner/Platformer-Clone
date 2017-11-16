const Shape = require('../shape.js');
const ItemBlockSprite = require('../sprite/item_block_sprite.js');

class ItemBlock {
  constructor({ctx, pos}) {
    this.shape = new Shape({pos: pos, width: 32, height: 32}, ctx, 'itemBlock', this);
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

  flip() {

    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    //kinda lame :/
    setTimeout(() => {
      this.sprite.offset.y = 10;
    }, 50);
    setTimeout(() => {
      this.sprite.offset.y = 2;
      this.animation.state = 'flip';
    }, 100);
    setTimeout(() => {
      this.sprite.offset.y = -1;
    }, 150);
    setTimeout(() => {
      this.sprite.offset.y = 0;
    }, 200);

    this.resetTimer = setTimeout(() => {
      this.animation.state = 'idle';
    }, 3000);
  }

  die() {
    this.status.remove = true;
  }
}

module.exports = ItemBlock;
