const Input = function (entity) {

  let inputs = {
    leftHeld: false,
    rightHeld: false,
    jumpPressed: false,
    jumpReleased: false,
    jumpFresh: true,
    runHeld: false,
    downHeld: false,
    keyPressed: false,
    pausePressed: false
  };

  const update = () => {
    inputs.jumpReleased = false;
    inputs.jumpPressed = false;
    inputs.keyPressed = false;
  };

  window.onkeydown = (e) => {
    if (e.keyCode === 74 && inputs.jumpFresh) {
      inputs.jumpPressed = true;
      inputs.jumpFresh = false;
    }
    if (e.keyCode === 83) {
      inputs.downHeld = true;
    }
    if(e.keyCode === 65) {
      inputs.leftHeld = true;
    } else if(e.keyCode === 68) {
      inputs.rightHeld = true;
    }
    //j
    if (e.keyCode === 75) {
      inputs.runHeld = true;
    }
    //p
    if (e.keyCode === 80) {
      inputs.pausePressed = true;
    }

    inputs.keyPressed = true;
  };

  window.onkeyup = (e) => {
    if (e.keyCode === 65) {
      inputs.leftHeld = false;
    }
    if (e.keyCode === 68) {
      inputs.rightHeld = false;
    }
    if (e.keyCode === 74) {
      inputs.jumpReleased = true;
      inputs.jumpFresh = true;
    }
    if (e.keyCode === 83) {
      inputs.downHeld = false;
    }
    //j
    if (e.keyCode === 75) {
      inputs.runHeld = false;
    }
  };

  return {inputs, update};
};

module.exports = Input;
