class Collision {
  constructor(object, ctx) {
    this.ctx = ctx;
    this.raycastAmount = 4;
    //Prevents a hit with a collider below the square
    this.skin = 0.5;

    this.object = object;
    this.shape = object.shape;
    this.vel = object.vel;

    this.enemies = object.enemies || [];
    this.colliders = object.colliders;
    this.grounded = false;
  }

  collisions() {
    this.horizontalCollisions();
    this.grounded = this.verticalCollisions();
  }

  horizontalCollisions() {
    for (var i = 0; i < this.raycastAmount; i++) {
      let startX;
      let endX;

      let spacing = (i * ((this.shape.height - this.skin) / (this.raycastAmount - 1))) + (this.skin / 2);

      if (this.vel.x > 0) {
        startX = {
          x: this.shape.calcCenter().x + (this.shape.width / 2),
          y: this.shape.pos.y + spacing
        };
        endX = {
          x: this.shape.calcCenter().x + (this.shape.width / 2) + Math.abs(this.object.vel.x),
          y: this.shape.pos.y + spacing
        };
      } else {
        startX = {
          x: this.shape.calcCenter().x - (this.shape.width / 2),
          y: this.shape.pos.y + spacing
        };
        endX = {
          x: this.shape.calcCenter().x - (this.shape.width / 2) - Math.abs(this.object.vel.x),
          y: this.shape.pos.y + spacing
        };
      }

      let hit = this.raycast(startX, endX, 'horizontal');
      if (hit) {
        if (hit.collider) {
          this.handleHorizontalCollision(hit);
        } else if (hit.enemy) {
          this.object.damage();
        }
      }
    }
  }

  handleHorizontalCollision(hit) {
    if (this.vel.x > 0) {
      this.shape.pos.x = (hit.collider.calcCenter().x - hit.collider.width / 2) - this.shape.width;
    } else {
      this.shape.pos.x = (hit.collider.calcCenter().x + hit.collider.width / 2);
    }
    this.vel.x = 0;
  }

  verticalCollisions() {
    let anyCollisions = false;

    for (var i = 0; i < this.raycastAmount; i++) {
      let startY;
      let endY;

      let spacing = (i * ((this.shape.width) / (this.raycastAmount - 1)));

      if (this.vel.y > 0) {
        startY = {
          x: this.shape.pos.x + spacing,
          y: this.shape.calcCenter().y + (this.shape.height / 2)
        };
        endY = {
          x: this.shape.pos.x + spacing,
          y: this.shape.calcCenter().y + (this.shape.height / 2) + Math.abs(this.object.vel.y)
        };
      } else {
        startY = {
          x: this.shape.pos.x + spacing,
          y: this.shape.calcCenter().y - (this.shape.height / 2)
        };
        endY = {
          x: this.shape.pos.x + spacing,
          y: this.shape.calcCenter().y - (this.shape.height / 2) - Math.abs(this.object.vel.y)
        };
      }

      let hit = this.raycast(startY, endY, 'vertical');
      if (hit) {
        if (hit.collider) {
          this.handleVerticalCollision(hit);
        } else {
          this.handleVerticalCollisionEnemy(hit);
        }
        anyCollisions = true;
      }
    }

    return anyCollisions;
  }

  handleVerticalCollision(hit) {
    if (this.vel.y > 0) {
      this.shape.pos.y = (hit.collider.calcCenter().y - hit.collider.height / 2) - this.shape.height;
    } else {
      this.shape.pos.y = (hit.collider.calcCenter().y + hit.collider.height / 2);
    }

    this.vel.y = 0;
  }

  handleVerticalCollisionEnemy(hit) {

    if (this.vel.y > 0) {
      hit.enemy.die();
      this.object.minJump();
    } else {
      this.object.damage();
    }
  }

  checkCollision(point, type) {
    //checks if point is within any of the colliders
    for (var i = 0; i < this.colliders.length; i++) {

      if (point.y > this.colliders[i].calcCenter().y - (this.colliders[i].height / 2)
       && point.y < this.colliders[i].calcCenter().y + (this.colliders[i].height / 2)) {

        if (point.x > this.colliders[i].calcCenter().x - (this.colliders[i].width / 2)
         && point.x < this.colliders[i].calcCenter().x + (this.colliders[i].width / 2)) {

          return { collider: this.colliders[i]};

        }

      }

    }
  }

  checkCollisionEnemy(point) {
    for (var i = 0; i < this.enemies.length; i++) {
      let collider = this.enemies[i].shape;
      if (point.y > collider.calcCenter().y - (collider.height / 2)
       && point.y < collider.calcCenter().y + (collider.height / 2)) {

        if (point.x > collider.calcCenter().x - (collider.width / 2)
         && point.x < collider.calcCenter().x + (collider.width / 2)) {

          return { enemy: this.enemies[i]};

        }

      }

    }
  }

  raycast(start, end, type) {
    this.renderRaycast(start, end, 'red');
    return this.checkCollision(end, type) || this.checkCollisionEnemy(end);
  }

  renderRaycast(start, end, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }
}

module.exports = Collision;
