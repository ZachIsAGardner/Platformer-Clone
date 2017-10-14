TO RUN:
-webpack main.js bundle.js
-open index.html

---

Collision
-check all directions
-have multiple raycasts for vertical and horizontal collisions
-check all colliders
-Implement isGrounded boolean for jumping

Input
-Fix lifting key killing x velocity
  -check if hold key is a thing?
-Refactor the global 'that' into something not stupid
-holding key will fire it repeatedly, that is also stupid
-You must press left after you lift right to get wanted input, lifting right while pressing left, will not move left, fix this!
