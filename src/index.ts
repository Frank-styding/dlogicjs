import { Display } from "./components/Display";

const display = new Display(innerWidth, innerHeight - 4);

function update(t: number) {
  display.update(t);
}

function draw() {
  display.draw();
}

let startTime = Date.now();
let fps = 0;

function loop(time = 0) {
  const endTime = Date.now();
  update(time);
  draw();
  /*   fps++;
  if (endTime - startTime > 1000) {
    console.log(fps);
    startTime = endTime;
    fps = 0;
  } */
  requestAnimationFrame(loop);
}

loop();

document.getElementById("root")?.appendChild(display.canvas);
