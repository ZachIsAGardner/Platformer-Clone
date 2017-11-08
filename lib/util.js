const Util = function() {
  //constructor
};

Util.prototype.lerp = function(from, to, time) {
  return from + time * (to - from);
};



module.exports = Util;
