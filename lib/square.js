Square = function (centerX, centerY, width, height, color, colliders) {

  this.centerX = centerX;
  this.centerY = centerY;
  this.width = width;
  this.height = height;
  this.color = color;

  this.colliders = colliders;

  this.velX = 0;
  this.velY = 0;

  this.minJumpVel = -2;
  this.maxJumpVel = -6;

  this.grav = 0.2;
};

Square.prototype.update = function() {

};

Square.prototype.calcVelX = function(moveX) {
  this.velX = moveX;
};

Square.prototype.calcVelY = function() {
  this.velY += this.grav;
};


Square.prototype.checkCollision = function (point) {
  //vertical collisions

  if (point[1] > this.colliders[0].calcCenter()[1] - (this.colliders[0].height / 2) && point[1] < this.colliders[0].calcCenter()[1] + (this.colliders[0].height / 2)) {
    if (point[0] > this.colliders[0].calcCenter()[0] - (this.colliders[0].width / 2) && point[0] < this.colliders[0].calcCenter()[0] + (this.colliders[0].width / 2)) {
      this.centerY = (this.colliders[0].calcCenter()[1] - this.colliders[0].height / 2) - this.height;
      this.velY = 0;
    }
  }

};

//this is called on jump key lift
Square.prototype.minJump = function() {
  this.velY = this.minJumpVel;
};

Square.prototype.jump = function() {
  this.velY = this.maxJumpVel;
};

Square.prototype.movePos = function() {
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

//--- raycast, seperate into another file later if you feel like it i dont know

Square.prototype.raycast = function() {
  const start = [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2)];
  const end = [this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2) + Math.abs(this.velY)];
  this.checkCollision(end);
};

Square.prototype.renderRaycast = function(ctx, start, end, color) {
  ctx.beginPath();
  ctx.moveTo(this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2));
  ctx.lineTo(this.calcCenter()[0], this.calcCenter()[1] + (this.height / 2) + Math.abs(this.velY));
  ctx.stroke();
};

module.exports = Square;
