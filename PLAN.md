# Super Mario World Clone

Super Mario World is a great example of simple and organic game design. Mario goes from left to right in an attempt to reach the goal gate.

Functionality & MVPs
---
Important basic features for a complete experience.
  * Satisfying controls and physics
  * Sprite animation
  * Background art and Parallax scrolling
  * Music and sound effects
  * Level with a win condition
  * Enemies

  in addition...
  * Production README
  * About modal with controls and explanation of the project.

### Bonus
Some wish list features.
  * Pausing
  * Power-ups
  * Picking up objects/ koopa shells
  * Proper raycasts
  * Slopes
  * Moving platforms
  * Tile editor

Wireframes
---
The clone will mostly be just a viewport. There will be controls and links accompanying the viewport as well.

![game viewport](https://github.com/ZachIsAGardner/game-project/blob/master/docs/Screen%20Shot%202017-11-07%20at%208.23.56%20PM.png)

Architecture
---
The clone will be implemented solely with vanilla javascript with a little bit CSS and HTML.

```game.js```: This script will handle the creating and rendering of objects to the viewport. It will also move the camera to follow the player.

```input.js```: This script will handle user input.

```player.js```: This extends ```moving_object.js``` and will provide player specific actions like jumping on enemies.

```enemy.js```: This will provide ai input for and extend ```moving_object.js```.

```collision.js```: This script will create raycasts depending on the width, height, and velocity of the object. Any collision will properly set the object's position

```shape.js```: This lightweight script will create shapes. Mostly to show hitboxes for debugging.

```sprite.js```: This script will handle sprite animation.


```moving_object.js```: This script will be the base of all moving objects. It will utilize ```collision.js```, ```input.js```, ```shape.js```, and ```sprite.js```.


```util.js```: This script will house simple utily functions.

Implementation Timeline
---
**Day 1:** Basic implementation of collision, input, sprite animation and moving objects.

**Day 2:** Background art and parallax. Sound as well.

**Day 3:** Basic level with a goal gate at the end for the win condition. Add enemies and other hazards as well for losing conditions.

**Bonus/ Weekend:**

**Day 4:** Implement power-up mushroom. Mario gets smaller instead of dying in one hit for appropriate hazards. Game can also be paused.

**Day 5:** Proper raycasts! Raycasts will return an intersection and slope angle rather than just the collision object itself. Implement Slopes.
