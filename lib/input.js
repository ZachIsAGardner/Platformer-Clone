Input = function (player) {
  this.player = player;
  that = this;
};


document.addEventListener('keydown', function(event) {

  if(event.keyCode == 87) {
    that.player.jump();
  }
  if(event.keyCode == 65) {
    that.player.moveX = -1;
  } else if(event.keyCode == 68) {
    that.player.moveX = 1;
  }

  // that.player.calcVelX(moveX);
});

document.addEventListener('keyup', function(event) {

  if (event.keyCode == 65 || event.keyCode == 68) {
    that.player.moveX = 0;
  }
  if (event.keyCode == 87) {
    that.player.minJump();
  }

});

module.exports = Input;
