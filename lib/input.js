const Input = function (entity) {

  let inputs = {
    leftHeld: false,
    rightHeld: false,
    jumpPressed: false,
    jumpReleased: false,
    jumpFresh: true
  };

  const update = () => {
    inputs.jumpReleased = false;
    inputs.jumpPressed = false;
  };

  window.onkeydown = (e) => {
    if(e.keyCode === 87 && inputs.jumpFresh) {
      inputs.jumpPressed = true;
      inputs.jumpFresh = false;
    }
    if(e.keyCode === 65) {
      inputs.leftHeld = true;
    } else if(e.keyCode === 68) {
      inputs.rightHeld = true;
    }
  };

  window.onkeyup = (e) => {
    if (e.keyCode === 65) {
      inputs.leftHeld = false;
    }
    if (e.keyCode === 68) {
      inputs.rightHeld = false;
    }
    if (e.keyCode === 87) {
      inputs.jumpReleased = true;
      inputs.jumpFresh = true;
    }
  };

  return {inputs, update};
};

module.exports = Input;
