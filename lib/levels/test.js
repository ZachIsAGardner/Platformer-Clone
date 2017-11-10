const Shape = require('../shape');
const Sprite = require('../sprite/sprite.js');
const Player = require('../player.js');
const Galoomba = require('../galoomba.js');
const GoalTape = require('./goal_tape.js');

class Level {
  constructor(ctx) {
    this.ctx = ctx;
    this.colliders = [];
    this.tiles = [];
    this.entities = {player: null, enemies: []};

    this.createLevel();
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
    const tt = { row: 2, col: 7, collider: 'trigger', width: 64, entity: 'tape'};
    const go = {entity: 'goal'};
    const gg = {
      chunk: [
        [bt,__,ft,go,__],
        [bm,__,fm,__,__],
        [bm,__,fm,__,__],
        [bm,__,fm,__,__],
        [bm,__,fm,__,__],
        [bm,__,fm,__,__],
        [bm,__,fm,__,__],
        [bm,__,fm,__,__],
        [bm,tt,fm,__,__],
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
      [__,pl,__,__,__,__,__,__,__,__,__,__,__,en,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
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

  createTile(key, sheet, i, j, offset) {
    let newTile = new Sprite({
      ctx: this.ctx,
      image: sheet,
      pos: {x: (i + offset.x) * 32, y: (j + offset.y) * 32},
      row: key.row,
      col: key.col,
      width: key.width,
      height: key.height,
    });

    return newTile;
  }

  createCollider(key, i, j, offset) {
    let newCollider = new Shape({
      pos: {x: (i + offset.x) * 32, y: (j + offset.y) * 32},
      width: 32,
      height: 32,
      color: 'rgba(0,0,0,0)'},
      this.ctx
    );
    return newCollider;
  }

  createEntity(type, x, y) {
    switch (type) {
      case 'player':
        this.entities.player = new Player({pos: {x, y}, width: 32, height: 56}, [], this.ctx);
        return;
      case 'enemy':
        this.entities.enemies.push(new Galoomba({pos: {x, y}, width: 32, height: 32}, [], this.ctx));
        return;
      case 'tape':
        const tape = new GoalTape({x, y}, this.ctx);
        this.tiles.push(tape);
        this.colliders.push(tape.collider);
        return;
      case 'goal':
        let newCollider = new Shape({
          pos: {x, y},
          width: 32,
          height: 1028,
          color: 'rgba(0,0,0,0)'},
          this.ctx,
          'trigger'
        );
        this.colliders.push(newCollider);
        return;
      case 'kill':
        this.colliders.push(new Shape({pos: {x, y}, width: 10000, height: 32}, this.ctx, 'kill'));
        return;
      default:

    }
  }

  ParseMap(map, sheet, offset={x:0, y:0}, main) {
    map.forEach((row, j) => {
      row.forEach((key, i) => {
        if (key === null) {
          return;
        }

        if (key.entity) {
          this.createEntity(key.entity, (i + offset.x) * 32, (j + offset.y) * 32);
          return;
        }
        if (key.chunk) {
          this.ParseMap(key.chunk, key.sheet || sheet, {x:i, y:j});
          return;
        }


        if (key.collider) {
          let newCollider = this.createCollider(key, i, j, offset);
          this.colliders.push(newCollider);
        }
        let newTile = this.createTile(key, sheet, i, j, offset);
        this.tiles.push(newTile);

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
}

module.exports = Level;
