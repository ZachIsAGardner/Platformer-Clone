const Shape = require('../shape');
const Sprite = require('../sprite/sprite.js');

class GoalTape {
  constructor(pos, ctx) {
    this.pos = pos;
    this.startPos = {x: 0, y: 0};
    this.startPos.x = pos.x;
    this.startPos.y = pos.y;
    this.dir = -1;

    this.ctx = ctx;
    this.collider = this.createCollider();
    this.sprite = this.createSprite();
    this.triggered = false;
  }

  createCollider() {
    let newCollider = new Shape({
      pos: this.pos,
      width: 32,
      height: 32,
      color: 'rgba(0,0,0,0)'},
      this.ctx,
      'trigger',
      this
    );
    return newCollider;
  }

  createSprite() {
    let image = new Image();
    image.src = 'assets/images/misc_objects.png';
    return new Sprite({ctx: this.ctx, width: 64, image: image, row: 2, col: 7, pos: this.pos, special: "tape"});
  }

  moveGoalTape() {
    let tape = this.collider;
    if (this.pos.y < this.startPos.y - 256) {
      this.dir = 1;
    }
    if (this.pos.y > this.startPos.y) {
      this.dir = -1;
    }

    this.pos.y += 2 * this.dir;
  }

  update() {
    if (!this.triggered) {
      this.sprite.update();
    }
    this.collider.update();
    this.collider.pos = this.pos;
    this.moveGoalTape();
    // this.sprite.object.pos.y -= 2;
  }

  setTrigger(collidee) {
    this.triggered = true;
    collidee.victory();
  }

}

module.exports = GoalTape;
