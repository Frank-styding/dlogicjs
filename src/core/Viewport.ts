import { Transform } from "./math/Transform";
import { Matrix3x2 } from "./math/Matrix3x2";

export class Viewport {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  projection: Matrix3x2;

  constructor(width: number, height: number) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.projection = Matrix3x2.identity();
    this.canvas.width = width;
    this.canvas.height = height;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  applyProjection() {
    this.projection.applyToContext(this.ctx);
    return this;
  }

  setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    return this;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  applyTransforms(transforms: Transform[]) {
    for (let i = 0; i < transforms.length; i++) {
      const transform = transforms[i];
      transform.getMatrix().applyToContext(this.ctx);
    }
  }

  applyTransform(transform: Transform) {
    transform.getMatrix().applyToContext(this.ctx);
  }

  save() {
    this.ctx.save();
  }
  restore() {
    this.ctx.restore();
  }

  drawViewport(viewport: Viewport) {
    this.ctx.drawImage(viewport.canvas, 0, 0);
  }
}
