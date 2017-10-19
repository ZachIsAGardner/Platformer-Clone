TO RUN:
-npm install
-npm run melon (webpack --watch)
-open index.html

---

GAME:
-Art?
-Camera movement?
  -Derender stuff offscreen
-Framerate independent?
-Clean up everything because it's just terrible
  -seperate movement stuff from square
  -split up square in general
  -convert to ES6?

COLLISION:
-have multiple raycasts for vertical and horizontal collisions
-colored raycasts
-grounded is kinda ghetto

INPUT:
-Refactor the global 'that' into something not stupid
-Jump repeats

REFERENCES:
https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
https://github.com/SebLague/2DPlatformer-Tutorial
