const Input = function (entity) {

  let inputs = {
    leftHeld: false,
    rightHeld: false,
    jumpPressed: false,
    jumpReleased: false,
    jumpFresh: true,
    runHeld: false,
    downHeld: false,
    upHeld: false,
    keyPressed: false,
    pausePressed: false
  };

  const update = () => {
    inputs.jumpReleased = false;
    inputs.jumpPressed = false;
    inputs.keyPressed = false;
  };

  window.onmousedown = (e) => {
    // inputs.keyPressed = true;
  };

  window.onkeydown = (e) => {
    if (e.keyCode === 87 || e.keyCode === 38) {
      inputs.upHeld = true;
    }
    if (e.keyCode === 83 || e.keyCode === 40) {
      inputs.downHeld = true;
    }
    if(e.keyCode === 65 || e.keyCode === 37) {
      inputs.leftHeld = true;
    } else if(e.keyCode === 68 || e.keyCode === 39) {
      inputs.rightHeld = true;
    }

    if ((e.keyCode === 74 || e.keyCode === 90) && inputs.jumpFresh ) {
      inputs.jumpPressed = true;
      inputs.jumpFresh = false;
    }
    if (e.keyCode === 75 || e.keyCode === 88) {
      inputs.runHeld = true;
    }
    //p
    if (e.keyCode === 80) {
      inputs.pausePressed = true;
    }

    inputs.keyPressed = true;
  };

  window.onkeyup = (e) => {
    if (e.keyCode === 87 || e.keyCode === 38) {
      inputs.upHeld = false;
    }
    if (e.keyCode === 83 || e.keyCode === 40) {
      inputs.downHeld = false;
    }
    if (e.keyCode === 65 || e.keyCode === 37) {
      inputs.leftHeld = false;
    }
    if (e.keyCode === 68 || e.keyCode === 39) {
      inputs.rightHeld = false;
    }

    if (e.keyCode === 74 || e.keyCode === 90) {
      inputs.jumpReleased = true;
      inputs.jumpFresh = true;
    }
    if (e.keyCode === 75 || e.keyCode === 88) {
      inputs.runHeld = false;
    }
  };

  return {inputs, update};
};

module.exports = Input;
