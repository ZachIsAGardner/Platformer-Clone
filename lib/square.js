Square = function (centerX, centerY, width, height, color, colliders, ctx) {
  this.centerX = centerX;
  this.centerY = centerY;
  this.width = width;
  this.height = height;
  this.color = color;

  this.colliders = colliders;

  this.moveX = 0;
  this.velX = 0;
  this.moveSpeed = 4;
  this.groundAcc = 0.105;
  this.airAcc = 0.045;

  this.velY = 0;
  this.minJumpVel = -3;
  this.maxJumpVel = -6;
  this.grav = 0.2;

  this.grounded = false;

  this.leftHeld = false;
  this.rightHeld = false;
  this.jumpPressed = false;

  this.ctx = ctx;
};

Square.prototype.update = function(ctx) {
  this.handleInput();
  this.movePos();
  this.render(ctx);
  this.collisions(ctx);
  // this.debug();
};

Square.prototype.debug = function() {

};

Square.prototype.handleInput = function() {
  if (!this.leftHeld && !this.rightHeld) {
    this.moveX = 0;
  }
  if (this.leftHeld && !this.rightHeld) {
    this.moveX = -1;
  }
  if (this.rightHeld && !this.leftHeld) {
    this.moveX = 1;
  }
  if (this.jumpPressed) {
    this.jump();
    this.jumpPressed = false;
  }
};

Square.prototype.lerp = function(from, to, time) {
  return from + time * (to - from);
};

Square.prototype.calcVelX = function() {
  if (this.grounded) {
    this.velX = this.lerp(this.velX, this.moveX, this.groundAcc);
  } else {
    this.velX = this.lerp(this.velX, this.moveX, this.airAcc);
  }
};
Square.prototype.calcVelY = function() {
  this.velY += this.grav;
};

Square.prototype.collisions = function(ctx) {

  //horizontal collisions
  let startX = 0;
  let endX = 0;

  if (this.velX > 0) {
    startX = [this.calcCenter()[0] + (this.width / 2), this.calcCenter()[1]];
    endX = [this.calcCenter()[0] + (this.width / 2) + Math.abs(this.velX), this.calcCenter()[1]];
  } else {
    startX = [this.calcCenter()[0] - (this.width / 2), this.calcCenter()[1]];
    endX = [this.calcCenter()[0] - (this.width / 2) - Math.abs(this.velX), this.calcCenter()[1]];
  }

  this.raycast(startX, endX, ctx, 'horizontal');

  //vertical collisions
  let startY = 0;
  let endY = 0;

  if (this.velY > 0) {
    startY = [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2)];
    endY = [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2) + Math.abs(this.velY)];
  } else {
    startY = [this.calcCenter()[0], this.calcCenter()[1] - (this.height / 2)];
    endY = [this.calcCenter()[0], this.calcCenter()[1] - (this.height / 2) - Math.abs(this.velY)];
  }

  this.raycast(startY, endY, ctx, 'vertical');

  //checkground
  this.raycast([this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2)], [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2) + 10], ctx, 'grounded');
};

Square.prototype.checkCollision = function (point, type) {
  //checks if point is within any of the colliders
  let collision = false;

  for (var i = 0; i < this.colliders.length; i++) {
    if (point[1] > this.colliders[i].calcCenter()[1] - (this.colliders[i].height / 2) && point[1] < this.colliders[i].calcCenter()[1] + (this.colliders[i].height / 2)) {
      if (point[0] > this.colliders[i].calcCenter()[0] - (this.colliders[i].width / 2) && point[0] < this.colliders[i].calcCenter()[0] + (this.colliders[i].width / 2)) {
        if (type === 'vertical') {
          if (this.velY > 0) {
            this.centerY = (this.colliders[i].calcCenter()[1] - this.colliders[i].height / 2) - this.height;
          } else {
            this.centerY = (this.colliders[i].calcCenter()[1] + this.colliders[i].height / 2);
          }

          this.velY = 0;
        } else if (type === 'horizontal') {
          if (this.velX > 0) {
            this.centerX = (this.colliders[i].calcCenter()[0] - this.colliders[i].width / 2) - this.width;
          } else {
            this.centerX = (this.colliders[i].calcCenter()[0] + this.colliders[i].width / 2);
          }
          this.velX = 0;
        } else if (type === "grounded"){
          collision = true;
        }
      }
    }
    //ghetto solution
    if (type === "grounded") {
      this.grounded = collision;
    }
  }
};

Square.prototype.minJump = function() {
  if (this.velY < this.minJumpVel) {
    this.velY = this.minJumpVel;
  }
};
Square.prototype.jump = function() {
  if (this.grounded) {
    this.velY = this.maxJumpVel;
  }
};

Square.prototype.movePos = function() {
  this.calcVelX();
  this.centerX += (this.velX * this.moveSpeed);

  this.calcVelY();
  this.centerY += this.velY;
};

Square.prototype.render = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.centerX, this.centerY, this.width, this.height);
};

Square.prototype.calcCenter = function() {
  return [this.centerX + (this.width / 2), this.centerY + (this.height / 2)];
};

//-
//--- raycast, seperate into another file later if you feel like it i dont know
//-

Square.prototype.raycast = function(start, end, ctx, type) {
  this.renderRaycast(start, end, 'red', ctx);
  this.checkCollision(end, type);
};

Square.prototype.renderRaycast = function(start, end, color, ctx) {
  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);
  ctx.lineTo(end[0], end[1]);
  ctx.stroke();
};

module.exports = Square;
