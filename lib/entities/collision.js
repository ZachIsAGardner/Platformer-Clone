class Collision {
  constructor(object, ctx) {
    this.ctx = ctx;
    this.raycastAmount = 4;
    //Prevents a hit with a collider below the square
    this.skin = 1;

    this.object = object;
    this.shape = object.shape;
    this.vel = object.vel;

    this.enemies = object.enemies || [];
    this.colliders = object.colliders;
    this.grounded = false;
    this.walled = false;

  }

  collisions() {
    this.walled = this.horizontalCollisions();
    this.grounded = this.verticalCollisions();
  }

  //---

  horizontalCollisions() {
    let anyCollisions = false;

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
        anyCollisions = this.parseHorizontalCollision(hit);
      }
    }
    return anyCollisions;
  }

  parseHorizontalCollision(hit) {
    if (hit.collider) {
      switch (hit.collider.type) {
        case 'block':
          this.handleHorizontalCollision(hit);
          return true;
          case 'itemBlock':
            if (hit.collider.owner.animation.state != 'flip') {
              this.handleHorizontalCollision(hit);
              return true;
            }
            break;
        case 'trigger':
          this.handleTrigger(hit.collider);
          break;
        case 'coin':
          hit.collider.owner.die();
          break;
        case 'kill':
          this.handleTrigger();
          this.object.die();
          break;
        case 'through':
          break;
        default:

      }
    }
    if (hit.enemy) {
      this.object.damage();
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

  //---

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
        anyCollisions = this.parseVerticalCollision(hit);
      }
    }

    return anyCollisions;
  }

  parseVerticalCollision(hit) {
    if (hit.collider) {
      switch (hit.collider.type) {
        case 'block':
          this.handleVerticalCollision(hit);
          return true;
        case 'itemBlock':
          if (hit.collider.owner.animation.state != 'flip') {
            if (this.object.vel.y < 0) {
              hit.collider.owner.flip();
            }
            this.handleVerticalCollision(hit);
            return true;
          }
          break;
        case 'trigger':
          this.handleTrigger(hit.collider);
          break;
        case 'coin':
          hit.collider.owner.die();
          break;
        case 'kill':
          this.object.die();
          break;
        case 'through':
          if (this.object.vel.y > 0) {
            this.handleVerticalCollision(hit);
            return true;
          }
        default:

      }
    } else {
      this.handleVerticalCollisionEnemy(hit);
    }
  }

  handleVerticalCollision(hit) {
    if (this.vel.y > 0) {
      this.shape.pos.y = (hit.collider.calcCenter().y - hit.collider.height / 2) - this.shape.height;
    } else {
      this.object.sfx.sounds.bonk.currentTime = 0;
      this.object.sfx.sounds.bonk.play();
      this.shape.pos.y = (hit.collider.calcCenter().y + hit.collider.height / 2);
    }

    this.vel.y = 0;
  }

  handleVerticalCollisionEnemy(hit) {
    if (this.vel.y > 0) {
      hit.enemy.die();
      if (this.object.inputFetcher.inputs.jumpHeld) {
        this.object.jump();
      } else {
        this.object.minJump();
      }
    } else {
      this.object.damage();
    }
  }

  //---

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

  handleTrigger(collider) {
    if (this.object.name === 'player') {
      collider.owner.setTrigger(this.object);
      collider.die();
    }
  }

  //---

  raycast(start, end, type) {
    // this.renderRaycast(start, end, 'red');
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
