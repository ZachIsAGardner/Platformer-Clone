# Super Mario World Clone

Super Mario World is a great example of simple and organic game design. A great game to clone to test your programmer skills!

![splash](https://github.com/ZachIsAGardner/Platformer-Clone/blob/master/docs/Screen%20Shot%202017-11-16%20at%203.43.42%20PM.png)

## Collision Detection

Accurate collision detection is especially important for platformers. In order to achieve this I used raycasts. These lines check for intersections with collide-able objects and perform repositioning of moving objects when necessary. Their length is dependent on the moving object's velocity. This affectively checks where the object will be on the following frame, as to prevent gross looking collisions.

![collision](https://github.com/ZachIsAGardner/Platformer-Clone/blob/master/docs/Screen%20Shot%202017-11-16%20at%203.44.54%20PM.png)

```
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
```

My collision detection is simple and quick, allowing for large numbers of moving objects.

![collision stress](https://github.com/ZachIsAGardner/Platformer-Clone/blob/master/docs/Screen%20Shot%202017-11-16%20at%203.46.04%20PM.png)

## Level Creation
Levels are generated with 2d arrays full of predefined keys. These keys point to anything between a single tile or a whole chunk of tiles making the 2d arrays much more readable.


```
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,m2],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,ib,ib,ib,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,tl,to,tr,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,ml,mi,mr,tl,to,to,to,to,to,tr,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,ml,mi,mr,ml,mi,mi,mi,mi,mi,mr,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,pl,__,__,__,__,__,ml,mi,mr,ml,mi,mi,mi,mi,mi,mr,__,__,__,__,__,__,__,__,en,__,__,__,__,__],
[tl,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,to,we,__],
[ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
[ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
[ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
[ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
[ml,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,mi,wr,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
[ki,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
```
![level](https://github.com/ZachIsAGardner/Platformer-Clone/blob/master/docs/Screen%20Shot%202017-11-16%20at%204.06.33%20PM.png)
