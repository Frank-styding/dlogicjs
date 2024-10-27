/* import { $Display } from "./components/Display/$Display";
import { $Gate } from "./components/Gate/$Gate";
import { $Grid } from "./components/Grid/$Grid"; */

import { Component } from "core/Component";
import { Viewport } from "core/Viewport";
class Canvas extends Component {
  constructor() {
    super("Canvas");
    this.viewport = new Viewport(500, 500);
  }

  _prevDraw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

class Rect extends Component {
  constructor(
    public width: number,
    public height: number,
    public translate: number
  ) {
    super("Rect");
  }
  _initLayout(): void {
    this.transform.model.translate(this.translate, 0);
  }
  _draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, this.width, this.height);
  }
}

const canvas = new Canvas();
const rect = new Rect(20, 20, 40);
canvas.addChild(rect);

canvas.init();

document
  .getElementById("root")
  ?.appendChild(canvas.viewport?.canvas as HTMLCanvasElement);

/* const SCREEN_WIDH = innerWidth;
const SCREEN_HEIGHT = innerHeight - 3;
const display = new $Display(SCREEN_WIDH, SCREEN_HEIGHT);
const grid = new $Grid(SCREEN_WIDH, SCREEN_HEIGHT);
const gate = new $Gate({
  name: "AND",
  connections: [],
});
display.addChild(grid);
display.addChild(gate);

display.init();
 */

function update(t: number) {
  canvas.update(t);
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
/* 
document.getElementById("root")?.appendChild(display.canvas); */
