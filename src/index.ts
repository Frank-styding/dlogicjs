import { $Display } from "components/Display/$Display";
import { $Grid } from "components/Grid/$Grid";

const SCREEN_WIDH = innerWidth;
const SCREEN_HEIGHT = innerHeight - 4;

const display = new $Display(SCREEN_WIDH, SCREEN_HEIGHT);
const grid = new $Grid(SCREEN_WIDH, SCREEN_HEIGHT);

display.addChild(grid);

display.init();

function update(t: number) {
  display.update(t);
}

let startTime = Date.now();
let fps = 0;

function loop(time = 0) {
  const endTime = Date.now();
  update(time);
  fps++;
  if (endTime - startTime > 1000) {
    console.log(fps);
    startTime = endTime;
    fps = 0;
  }
  requestAnimationFrame(loop);
}

loop();

document.getElementById("root")?.appendChild(display.viewport.canvas);
