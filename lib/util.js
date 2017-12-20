const Util = function() {
  //constructor
};

Util.prototype.lerp = function(from, to, time) {
  return from + time * (to - from);
};

Util.prototype.pixelPerfect = function(pos) {
  const x = Math.round(pos.x);
  const y = Math.round(pos.y);
  return {x, y};
};

module.exports = Util;
