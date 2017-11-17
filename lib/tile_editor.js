const Shape = require('./shape.js');
const LevelCreator = require('./levels/level_creator.js');
const Input = require('./input.js');
const input = new Input();

const CreateFile = require('./create_file.js');


var coor = {x: 0, y: 0};
var mouseDown = false;
var mouseDown2 = false;

class TileEditor {
  constructor(canvases) {
    this.canvases = canvases;
    this.ctx = this.canvases.main.getContext('2d');
    this.cursor = new Shape({
      width: 32,
      height: 32,
      color: 'rgba(255,200,200,0.5)',
      pos: {x: 0, y: 0}
    });

    this.req = null;

    this.tiles = [];
    this.keyMap = [
      []
    ];
    this.map = [
      []
    ];

    this.level = new LevelCreator(this.canvases);
    this.previewTile = null;
    this.keys = Object.entries(this.level.getKeys());
    this.currentKeyIdx = 4;
    this.currentKey = this.keys[this.currentKeyIdx];

    this.start();

  }

  getPreviewTile() {
    if (this.currentKey != null && this.currentKey[1] != null) {
      this.previewTile = this.level.createTile(
        this.currentKey[1],
        this.level.sheets.ground,
        1.5,
        .5,
        {x: 0, y: 0},
        this.ctx
      );
    } else {
      this.previewTile = null;
    }
  }

  createTile() {
    const pos = {x: this.cursor.pos.x / 32, y: this.cursor.pos.y / 32};
    this.populateMap(pos.x, pos.y, this.currentKey);
  }

  createArt(key, pos) {
    const newTile = this.level.createTile(
      key[1],
      this.level.sheets.ground,
      pos.x,
      pos.y,
      {x: .5, y: .5},
      this.ctx
    );
    this.tiles.push(newTile);
  }

  deleteTile() {
    const pos = {x: this.cursor.pos.x / 32, y: this.cursor.pos.y / 32};
    this.populateMap(pos.x, pos.y, this.keys[12]);
  }

  populateMap(x, y, key) {
    while(y + 1 > this.map.length) {
      this.map.push([]);
    }
    this.map.forEach((row) => {
      while(x + 1 > row.length) {
        row.push(this.keys[12]);
      }
    });

    this.map[y][x] = key;
  }

  showMap() {
    this.ctx.font = '12px Courier';
    this.ctx.fillText(this.currentKey[0], 16, 16);

    this.keyMap = [];

    this.ctx.font = '8px Courier';
    this.map.forEach((row, i) => {
      const text = [];
      row.forEach((tile) => {
        text.push(tile[0]);
      });
      this.ctx.fillText(text, 32, 16 * (i + 2));
      this.keyMap.push(`\n\t\t\t\t[${text}]`);
    });
  }

  changeCurrentKey() {
    if (input.inputs.leftHeld) {
      if (this.currentKeyIdx > 0) {
        this.currentKeyIdx -= 1;
      }
      this.currentKey = this.keys[this.currentKeyIdx];
      this.getPreviewTile();
      input.inputs.leftHeld = false;
    }
    if (input.inputs.rightHeld) {
      if (this.currentKeyIdx < this.keys.length - 1) {
        this.currentKeyIdx += 1;
      }
      this.currentKey = this.keys[this.currentKeyIdx];
      this.getPreviewTile();
      input.inputs.rightHeld = false;
    }
  }

  drawTiles() {
    this.map.forEach((row, j) => {
      row.forEach((key, i) => {
        if (key[1] !== null) {
          this.createArt(key, {x: i, y: j});
        }
      });
    });
    this.tiles.forEach((tile) => {
      tile.update(this.ctx);
    });

    this.tiles = [];
  }

  getCursorPos() {
    this.cursor.update(this.ctx);
    this.cursor.pos = {
      x: Math.ceil((coor.x - 32) / 32) * 32,
      y: Math.ceil((coor.y - 32) / 32) * 32
    };
  }

  writeFile() {
    let contents = [
`const LevelCreator = require('./level_creator');

class LevelX extends LevelCreator {
  constructor(ctx) {
    super(ctx);
    this.createLevel(this.mapLevel());
  }

  mapLevel() {
    let { pl, en, ki, tl, to, tr, ml, mi,
          mr, bl, bo, br, __, ww, we, wl,
          wr, ch, bt, bm, ft, fm, tt, go,
          gg, ib, co, tw, wt, td, tu
        } = this.getKeys();

    const map = {
      chunk: [${this.keyMap}
      ]
    };

    return map;
  }
}

module.exports = LevelX;`
    ];
    // contents.push(this.keyMap);
    return contents;
  }

  start() {
    const animate = () => {
      //change this
      this.ctx.clearRect(0, 0, 5000, 5000);

      this.ctx.fillStyle = 'rgba(100,100,100,0.25)';
      this.ctx.fillRect(0, 0, this.map[0].length * 32, this.map.length * 32);

      this.drawTiles();

      if (this.previewTile) {
        this.previewTile.update(this.ctx);
      }

      this.getCursorPos();

      this.changeCurrentKey();

      if (mouseDown) {
        this.createTile();
        mouseDown = false;
      }
      if (mouseDown2) {
        this.deleteTile();
        mouseDown2 = false;
      }

      this.showMap();
      CreateFile(this.writeFile());

      this.req = requestAnimationFrame(animate);
    };

    this.req = animate();
  }
}
//---

function getMouseCoor(e) {
  coor = handleMouseMove(document.getElementById("main-canvas"), e);
}
function getMouseDown(e) {
  if (e.button === 0) {
    mouseDown = true;
  }
  if (e.button === 2) {
    mouseDown2 = true;
  }
}

function getMouseUp(e) {
  if (e.button === 0) {
    mouseDown = false;
  }
  if (e.button === 2) {
    mouseDown2 = false;
  }
}


window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
}, false);
window.addEventListener('mousemove', getMouseCoor, false);
window.addEventListener('mousedown', getMouseDown, false);
window.addEventListener('mouseup', getMouseUp, false);

function handleMouseMove(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  let pos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  return pos;
}

//---

module.exports = TileEditor;
