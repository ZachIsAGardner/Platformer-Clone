const LevelCreator = require('./level_creator');

class Level4 extends LevelCreator {
  constructor(canvases, inputF) {
    super(canvases, inputF);
    this.createLevel(this.mapLevel());
  }

  mapLevel() {
    let { pl, en, ki, tl, to, tr, ml, mi,
          mr, bl, bo, br, __, ww, we, wl,
          wr, wb, wd, ch, bt, bm, ft, fm,
          tt, go, gg, ib, co, tw, wt, td, tu
        } = this.getKeys();

    const map = {
      chunk: [
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,pl,__,__,__,__,__,en,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
        [__,__,__,__,__,__,bl,to,to,to,to,to,bo,bo,tr,__,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,__,bo,bo,bo,bo,__,__,__],
        [__,__,__,__,__,__,__,__,__,__,__,bo,bo,bo,bo,__,__,__,__],
        [__,__,__,__,__,__,__,__,bo,__,__,bo,bo,bo,bo,__,bo,bo,__],
        [__,__,__,__,__,__,__,__,__,__,bo,bo,bo,__,__,bo,bo,bo,bo],
        [__,__,__,__,__,__,__,__,bo,bo,bo,bo,bo,__,bo,__,__,__,__],
        [__,__,__,__,bo,bo,bo,__,__,bo,bo,__,__,__,__,__,__,__,__]
      ]
    };

    return map;
  }
}

module.exports = Level4;
