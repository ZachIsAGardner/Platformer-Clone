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
    from -= .05;
  } else {
    from += .05;
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
}
Square.prototype.calcVelY = function() {
  this.velY += this.grav;
};

Square.prototype.collisions = function(ctx) {
  //vertical collisions
  let start = 0;
  let end = 0;

  if (this.velY > 0) {
    start = [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2)];
    end = [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2) + Math.abs(this.velY)];
  } else {
    start = [this.calcCenter()[0], this.calcCenter()[1] - (this.height / 2)];
    end = [this.calcCenter()[0], this.calcCenter()[1] - (this.height / 2) - Math.abs(this.velY)];
  }

  this.raycast(start, end, ctx);
};

Square.prototype.checkCollision = function (point) {
  //checks if point is within any of the colliders
  for (var i = 0; i < this.colliders.length; i++) {
    if (point[1] > this.colliders[i].calcCenter()[1] - (this.colliders[i].height / 2) && point[1] < this.colliders[i].calcCenter()[1] + (this.colliders[i].height / 2)) {
      if (point[0] > this.colliders[i].calcCenter()[0] - (this.colliders[i].width / 2) && point[0] < this.colliders[i].calcCenter()[0] + (this.colliders[i].width / 2)) {
        if (this.velY > 0) {
          this.centerY = (this.colliders[i].calcCenter()[1] - this.colliders[i].height / 2) - this.height;
        } else {
          console.log('up');
          this.centerY = (this.colliders[i].calcCenter()[1] + this.colliders[i].height / 2);
        }

        this.velY = 0;
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

Square.prototype.raycast = function(start, end, ctx) {
  this.renderRaycast(start, end, 'red', ctx);
  this.checkCollision(end);
};

Square.prototype.renderRaycast = function(start, end, color, ctx) {

  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);
  ctx.lineTo(end[0], end[1]);
  ctx.stroke();
};

module.exports = Square;
