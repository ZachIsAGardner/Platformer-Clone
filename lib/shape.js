class Shape {
  constructor(params, ctx, type, owner) {
    this.width = params.width;
    this.height = params.height;
    this.color = params.color;

    this.pos = {x: 0, y: 0};
    this.setPos(params.pos.x, params.pos.y);

    this.type = type || '';
    this.owner = owner;
    this.status = {remove: false};

    this.ctx = ctx;
  }

  update(ctx) {
    this.render(ctx);
  }

  render(ctx) {
    ctx = ctx || this.ctx;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }

  setPos(x, y) {
    this.pos = {
      x: x - (this.width / 2),
      y: y - (this.height / 2)
    };
  }

  calcCenter() {
    return {
      x: this.pos.x + (this.width / 2),
      y: this.pos.y + (this.height / 2)
    };
  }

  die() {
    this.status.remove = true;
  }
}

module.exports = Shape;
