import { Component } from "../core/Component";
import { Mat4x3, Matrix3x2 } from "../core/Matrix3x2";
import { V2, Vector2 } from "../core/Vector2";

export class Display extends Component {
  constructor(public width: number, public height: number) {
    super();
    this.canvas.width = width;
    this.canvas.height = height;
    this.mouseControls();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    Mat4x3.applyToContext(this.ctx, this.transform);
    Mat4x3.applyToContext(this.ctx, this.offsetMatrix);
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.rect(-100, -100, 200, 200);
    this.ctx.fill();
    this.ctx.restore();
  }

  mouseIsDown: boolean = false;
  startMousePos: Vector2 = V2.v2();
  mousePos: Vector2 = V2.v2();
  zoom: number = 1;
  zoomStep = 0.01;
  offsetMatrix: Matrix3x2 = Mat4x3.indentity();

  updateTransform(position: Vector2, zoom: number) {
    Mat4x3.copy(this.transform, Mat4x3.translateZoom(position, 1 / zoom));
  }

  updateOffsetMatrix(position: Vector2) {
    Mat4x3.copy(this.offsetMatrix, Mat4x3.translateZoom(position, 1));
  }

  mouseControls() {
    this.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        V2.set(this.startMousePos, e.clientX, e.clientY);
        V2.set(this.mousePos, e.clientX, e.clientY);
        this.mouseIsDown = true;
      }
    });
    this.canvas.addEventListener("mousemove", (e) => {
      V2.set(this.mousePos, e.clientX, e.clientY);
      if (this.mouseIsDown) {
        const diff = V2.subV(V2.clone(this.mousePos), this.startMousePos);
        V2.copy(this.startMousePos, this.mousePos);
        this.updateTransform(
          V2.addV(Mat4x3.translation(this.transform), diff),
          this.zoom
        );
      }
    });
    this.canvas.addEventListener("mouseup", () => {
      this.mouseIsDown = false;
    });
    this.canvas.addEventListener("wheel", (e) => {
      if (e.deltaY != 0 && !this.mouseIsDown) {
        const step = (e.deltaY < 0 ? -1 : 1) * this.zoomStep;
        const nZoom = step + this.zoom;
        const mouse = V2.clone(this.mousePos);
        const translation = Mat4x3.translation(this.transform);
        const point = Mat4x3.mulV(
          Mat4x3.invTranslateZoom(translation, 1 / this.zoom),
          mouse
        );
        const point1 = Mat4x3.mulV(
          Mat4x3.invTranslateZoom(translation, 1 / nZoom),
          mouse
        );
        const diff = V2.subV(point1, point);
        this.updateTransform(Mat4x3.translation(this.transform), nZoom);
        this.updateOffsetMatrix(
          V2.addV(Mat4x3.translation(this.offsetMatrix), diff)
        );
        this.zoom = nZoom;
      }
    });
  }
}
