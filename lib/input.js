Input = function (player) {
  this.player = player;
  that = this;
};

document.addEventListener('keydown', function(event) {

  if(event.keyCode == 87) {
    that.player.jumpPressed = true;
  }
  if(event.keyCode == 65) {
    that.player.leftHeld = true;
  } else if(event.keyCode == 68) {
    that.player.rightHeld = true;
  }

});

document.addEventListener('keyup', function(event) {

  if (event.keyCode == 65) {
    that.player.leftHeld = false;
  }
  if (event.keyCode == 68) {
    that.player.rightHeld = false;
  }
  if (event.keyCode == 87) {
    that.player.minJump();
  }

});

module.exports = Input;
