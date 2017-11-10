const Shape = require('../shape');
const Sprite = require('../sprite/sprite.js');
const Player = require('../player.js');
const Galoomba = require('../galoomba.js');

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.tiles = [];
    this.entities = {player: null, enemies: []};
    this.goalTape = {object: null, startPos: {x: 0, y: 0}, dir: -1};
    this.createLevel();
  }

  moveGoalTape() {
    const tape = this.goalTape;
    if (!tape.object) {
      return;
    }

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
    let marioSheet = new Image();
    marioSheet.src = 'assets/images/mario.png';

    const pl = {
      entity: 'player'
    };
    const en = {
      entity: 'enemy'
    };

    const ki = {
      entity: 'kill'
    };

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
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,gg,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,pl,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [tl,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
      [ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
      [ki,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
    ];

    this.ParseMap(map, groundSheet, {x:0, y: 0}, true);
  }

  ParseMap(map, sheet, offset={x:0, y:0}, main) {
    map.forEach((row, j) => {
      row.forEach((key, i) => {
        if (key === null) {
          return;
        }

        if (key.entity) {
          this.createEntity(key.entity, i * 32, j * 32);
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
    if (main) {
      this.finishParse();
    }
  }

  finishParse() {
    this.entities.player.colliders,
    this.entities.player.collision.colliders = this.colliders;

    this.entities.player.enemies = this.entities.enemies,
    this.entities.player.collision.enemies = this.entities.enemies;

    this.entities.enemies.forEach((entity) => {
      entity.colliders, entity.collision.colliders = this.colliders;
    });
  }

  createEntity(type, x, y) {
    switch (type) {
      case 'player':
        this.entities.player = new Player({x, y, width: 32, height: 56}, [], this.ctx);
        return;
      case 'enemy':
        this.entities.enemies.push(new Galoomba({x, y, width: 32, height: 32}, [], this.ctx));
        return;
      case 'kill':
        this.colliders.push(new Shape({x, y, width: 10000, height: 32}, this.ctx, 'kill'));
      default:

    }
  }
}

module.exports = Level;
