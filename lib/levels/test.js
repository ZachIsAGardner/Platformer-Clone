const Shape = require('../shape');

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.createLevel();
  }
  createLevel() {
    const ground = new Shape({x: 200, y: 850, width: 400, height: 900, color: 'black'}, this.ctx);
    const ground2 = new Shape({x: 700, y: 850, width: 400, height: 900, color: 'black'}, this.ctx);
    const ground3 = new Shape({x: -150, y: 0, width: 400, height: 1600, color: 'black'}, this.ctx);

    this.colliders = [ground, ground2, ground3];
  }
}

module.exports = Level;
