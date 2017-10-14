Square = function (centerX, centerY, width, height, color, colliders, ctx) {

  this.centerX = centerX;
  this.centerY = centerY;
  this.width = width;
  this.height = height;
  this.color = color;

  this.colliders = colliders;

  this.moveX = 0;
  this.velX = 0;
  this.velY = 0;

  this.minJumpVel = -2;
  this.maxJumpVel = -6;

  this.grav = 0.2;

  this.ctx = ctx;
};

Square.prototype.update = function() {

};

Square.prototype.ghettoLerp = function(from, to, time) {
  if (from > to) {
    from -= 0.1;
  } else {
    from += 0.1;
  }

  if (from < to && to < 0) {
    from = to;
  }
  if (from > to && to > 0) {
    from = to;
  }

  return from;
};

Square.prototype.calcVelX = function() {
  this.velX = this.ghettoLerp(this.velX, this.moveX, 1);
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
};

Square.prototype.checkCollision = function (point, type) {
  //checks if point is within any of the colliders
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
        }

      }
    }
  }
};

//this is called on jump key lift
Square.prototype.minJump = function() {
  // this.velY = this.minJumpVel;
};

Square.prototype.jump = function() {
  this.velY = this.maxJumpVel;
};

Square.prototype.movePos = function() {
  this.calcVelX(this.moveX);
  this.centerX += (this.velX * 3);

  this.calcVelY();
  this.centerY += this.velY;

  // this is bad because for a frame it will enter the collision
  // this.checkCollision([0, this.calcCenter()[1] + (this.height / 2)]);
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
