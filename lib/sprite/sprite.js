class Sprite {
  constructor({ctx, width, height, image, pos, row, col}) {
    this.object = {
      ctx,
      width: width || 32,
      height: height || 32,
      image,
      row: row || 0,
      col: col || 0,
      pos: pos || {x: 0, y: 0}
    };
  }

  render() {
    //assuming 32 x 32 sized sprite

    this.object.ctx.drawImage(
      this.object.image,
      this.object.row * 32,
      this.object.col * 32,
      this.object.width,
      this.object.height,
      this.object.pos.x - 16,
      this.object.pos.y - 16,
      this.object.width,
      this.object.height
    );

  }
}

module.exports = Sprite;
