const Shape = require('../shape');

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.createLevel();
  }
  createLevel() {
    const ground = new Shape({x: 200, y: 850, width: 4000, height: 900, color: 'black'}, this.ctx);
    const ground2 = new Shape({x: 700, y: 850, width: 400, height: 900, color: 'black'}, this.ctx);
    const ground3 = new Shape({x: -150, y: 0, width: 400, height: 1600, color: 'black'}, this.ctx);
    const ground4 = new Shape({x: 650, y: 150, width: 800, height: 32, color: 'black'}, this.ctx);
    const ground5 = new Shape({x: 150, y: 550, width: 8000, height: 32, color: 'black'}, this.ctx);

    this.colliders = [ground, ground2, ground3, ground4, ground5];
  }
}

module.exports = Level;
