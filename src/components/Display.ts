import { Component } from "../core/Component";
import { CallEvent } from "../core/Events";
import { Matrix3x2 } from "../core/Matrix3x2";
import { Vector2 } from "../core/Vector2";
import { GridEvents } from "./Grid";

export class Display extends Component {
  constructor(width: number, height: number) {
    super();
    this.name = "Display";
    this.setSize(width, height);
    this.mouseControls();
    this.transform.translate(this.width / 2, this.height / 2);
  }

  _update(t: number): void {
    this.isUpdated = true;
  }

  mouseIsDown: boolean = false;
  startMousePos: Vector2 = new Vector2();
  mousePos: Vector2 = new Vector2();
  zoom: number = 1;
  zoomStep = 0.01;

  updateTransform(position: Vector2, zoom: number) {
    this.transform.copy(Matrix3x2.translateZoom(position, 1 / zoom));
    const center = new Vector2(this.width / 2, this.height / 2);
    const inv = Matrix3x2.mul(this.transform, this.model).inv().mulV(center);
    CallEvent(this.context, GridEvents.onCameraUpdate, inv, this.zoom);
  }

  updateOffsetMatrix(position: Vector2) {
    this.model.copy(Matrix3x2.translateZoom(position, 1));
  }

  mouseControls() {
    this.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        this.startMousePos.x = e.clientX;
        this.startMousePos.y = e.clientY;
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        this.mouseIsDown = true;
      }
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;

      if (this.mouseIsDown) {
        const diff = this.mousePos.clone().subV(this.startMousePos);
        this.startMousePos.copy(this.mousePos);
        this.isUpdated = false;
        this.updateTransform(this.transform.translation.addV(diff), this.zoom);
      }
    });
    this.canvas.addEventListener("mouseup", () => {
      this.mouseIsDown = false;
    });
    this.canvas.addEventListener("wheel", (e) => {
      if (e.deltaY != 0 && !this.mouseIsDown) {
        const step = (e.deltaY < 0 ? -1 : 1) * this.zoomStep;
        const nZoom = step + this.zoom;
        const mouse = this.mousePos.clone();
        const translation = this.transform.translation;
        const point = Matrix3x2.invTranslateZoom(
          translation,
          1 / this.zoom
        ).mulV(mouse);
        const point1 = Matrix3x2.invTranslateZoom(translation, 1 / nZoom).mulV(
          mouse
        );

        const diff = point1.subV(point);
        this.updateTransform(translation, nZoom);
        this.updateOffsetMatrix(this.model.translation.addV(diff));
        this.zoom = nZoom;
        this.isUpdated = false;
      }
    });
  }
}
