const Shape = require('../shape.js');
const CoinSprite = require('../sprite/coin_sprite.js');
const SFX = require('../sfx.js');
const sfx = new SFX();

class Coin {
  constructor({ctx, pos}) {
    this.shape = new Shape({pos: pos, width: 32, height: 32}, ctx, 'coin', this);
    this.vel = {x: 1, y: 1};

    this.ctx = ctx;
    this.sprite = this.createSprite();

    this.animation = {state: 'idle'};
    this.status = {remove: false};
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/misc_objects.png';
    return new CoinSprite({ctx: this.ctx, image: image, target: this, numberOfFrames: 4});
  }

  update() {
    this.sprite.update();
  }

  die() {
    sfx.sounds.coin.play();
    this.status.remove = true;
  }
}

module.exports = Coin;
