Input = function (player) {
  this.player = player;
  that = this;
};


document.addEventListener('keydown', function(event) {

  let moveX = 0;

  if(event.keyCode == 38) {
    that.player.jump();
  }
  if(event.keyCode == 37) {
    moveX = -1;
  } else if(event.keyCode == 39) {
    moveX = 1;
  }

  that.player.calcVelX(moveX);
});

document.addEventListener('keyup', function(event) {

  if (event.keyCode == 37 || event.keyCode == 39) {
    that.player.calcVelX(0);
  }
  if (event.keyCode == 38) {
    that.player.minJump();
  }

});

module.exports = Input;
