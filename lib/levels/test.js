const Shape = require('../shape');
const Sprite = require('../sprite/sprite.js');

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.tiles = [];
    this.goalTape = {object: null, startPos: {x: 0, y: 0}, dir: -1};
    this.createLevel();
  }

  moveGoalTape() {
    const tape = this.goalTape;

    tape.object.pos.x = tape.startPos.x - 16;
    if (tape.object.pos.y < tape.startPos.y - 256) {
      tape.dir = 1;
    }
    if (tape.object.pos.y > tape.startPos.y) {
      tape.dir = -1;
    }

    tape.object.pos.y += 2 * tape.dir;
  }

  update() {
    this.moveGoalTape();
  }

  createLevel() {
    let groundSheet = new Image();
    groundSheet.src = 'assets/images/ground_tiles.png';
    let objectSheet = new Image();
    objectSheet.src = 'assets/images/misc_objects.png';

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

    const bt = { row: 0, col: 7, collider: false};
    const bm = { row: 0, col: 8, collider: false};
    const ft = { row: 1, col: 7, collider: false};
    const fm = { row: 1, col: 8, collider: false};
    const tt = { row: 2, col: 7, collider: false, width: 640, special: 'tape'};
    const gg = {
      chunk: [
        [bt,__,ft],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,__,fm],
        [bm,tt,fm],
      ],
      sheet: objectSheet
    };

    const map = [
      [__,__,__,__,__,__,__,__,__,__,__,gg,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,to,to,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,to,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
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
          this.ParseMap(key.chunk, key.sheet || sheet, {x:i, y:j});
          return;
        }
        let newTile = new Sprite({
          ctx: this.ctx,
          image: sheet,
          pos: {x: (i + offset.x) * 32, y: (j + offset.y) * 32},
          row: key.row,
          col: key.col,
          width: key.width,
          height: key.height,
        });
        if (key.special === "tape") {
          this.goalTape.object = newTile.object;
          this.goalTape.startPos.x = newTile.object.pos.x;
          this.goalTape.startPos.y = newTile.object.pos.y;
        }
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
