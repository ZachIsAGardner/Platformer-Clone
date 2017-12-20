class Sprite {
  constructor({ctx, width, height, image, pos, row, col, special, offset}) {
    this.ctx = ctx;
    this.width = width || 32;
    this.height = height || 32;
    this.image = image;
    this.row = row || 0;
    this.col = col || 0;
    this.pos = pos || {x: 0, y: 0};
    this.offset = offset || {x: 0, y: 0};
    this.special = special;
  }

  update() {
    this.render();
  }

  render() {

    this.ctx.drawImage(
      this.image,
      this.row * 32,
      this.col * 32,
      this.width,
      this.height,
      this.pos.x - (this.width / 2) - this.offset.x,
      this.pos.y - (this.height / 2) - this.offset.y,
      this.width,
      this.height
    );
  }
}

module.exports = Sprite;
