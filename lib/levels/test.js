const Shape = require('../shape');
const Sprite = require('../sprite/sprite.js');

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.tiles = [];
    this.createLevel();
  }

  createLevel() {
    let groundSheet = new Image();
    groundSheet.src = 'assets/images/ground_tiles.png';

    const tl = { row: 0, col: 0, collider: true};
    const to = { row: 1, col: 0, collider: true};
    const tr = { row: 2, col: 0, collider: true};
    const ml = { row: 0, col: 1, collider: true};
    const mi = { row: 1, col: 1, collider: false};
    const mr = { row: 2, col: 1, collider: true};
    const bl = { row: 0, col: 2, collider: true};
    const bo = { row: 1, col: 2, collider: true};
    const br = { row: 2, col: 2, collider: true};
    const __ = null;

    const ch = {
      chunk: [
        [tl,to,tr],
        [ml,mi,mr],
        [bl,bo,br],
      ]
    };

    const map = [
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,ch],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [tl,to,to,to,to,to,to,to,to,to,to,to,to,to,to,tr,__,__,ch],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mr,__,__,__],
    ];

    this.ParseMap(map, groundSheet);
  }

  ParseMap(map, sheet, offset={x:0, y:0}) {
    map.forEach((row, j) => {
      row.forEach((key, i) => {
        if (key === null) {
          return;
        }
        if (key.chunk) {
          this.ParseMap(key.chunk, sheet, {x:i, y:j});
          return;
        }
        let newTile = new Sprite({
          ctx: this.ctx,
          image: sheet,
          pos: {x: (i + offset.x) * 32, y: (j + offset.y) * 32},
          row: key.row,
          col: key.col
        });
        this.tiles.push(newTile);

        if (key.collider) {
          let newGround = new Shape({
            x: (i + offset.x) * 32,
            y: (j + offset.y) * 32,
            width: 32,
            height: 32,
            color: 'rgba(0,0,0,0)'},
            this.ctx
          );
          this.colliders.push(newGround);
        }
      });
    });
  }
}

module.exports = Level;
