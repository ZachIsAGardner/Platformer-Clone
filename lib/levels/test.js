const Shape = require('../shape');

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.createLevel();
  }
  createLevel() {
    const ground = new Shape({x: 200, y: 450, width: 200, height: 30, color: 'black'}, this.ctx);
    const ground2 = new Shape({x: 120, y: 300, width: 30, height: 600, color: 'black'}, this.ctx);
    const ground3 = new Shape({x: 200, y: 320, width: 200, height: 30, color: 'black'}, this.ctx);
    this.colliders = [ground, ground2, ground3];
  }
}

module.exports = Level;
