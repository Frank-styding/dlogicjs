import { GridEvents } from "components/Grid/$Grid";
import { Component, Vector2, CallEvent, Matrix3x2 } from "core/index";
export class $Display extends Component {
  constructor(public width: number, public height: number) {
    super("Display");
  }

  _init(): void {
    this.setSize(this.width, this.height);
    this.mouseControls();
  }

  _initLayout(): void {
    this.view.translate(this.width / 2, this.height / 2);
    this.translateAndZoom.translate(this.width / 2, this.height / 2);
  }

  _update(t: number): void {
    this.isUpdated = true;
  }

  mouseIsDown: boolean = false;
  startMousePos: Vector2 = new Vector2();
  mousePos: Vector2 = new Vector2();
  zoom: number = 1;
  zoomStep = 0.01;

  translateAndZoom: Matrix3x2 = Matrix3x2.identity();
  offsetMatrix: Matrix3x2 = Matrix3x2.identity();

  updateTransform(position: Vector2, zoom: number) {
    this.translateAndZoom.copy(Matrix3x2.translateZoom(position, 1 / zoom));
    const center = new Vector2(this.width / 2, this.height / 2);
    const inv = Matrix3x2.mul(this.translateAndZoom, this.offsetMatrix)
      .inv()
      .mulV(center);

    this.view.copy(this.translateAndZoom.clone().mul(this.offsetMatrix));
    CallEvent(this.context, GridEvents.onCameraUpdate, inv, this.zoom);
  }

  updateOffsetMatrix(position: Vector2) {
    this.offsetMatrix.copy(Matrix3x2.translateZoom(position, 1));
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
        this.updateTransform(
          this.translateAndZoom.translation.addV(diff),
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
        const mouse = this.mousePos.clone();
        const translation = this.translateAndZoom.translation;
        const point = Matrix3x2.invTranslateZoom(
          translation,
          1 / this.zoom
        ).mulV(mouse);
        const point1 = Matrix3x2.invTranslateZoom(translation, 1 / nZoom).mulV(
          mouse
        );

        const diff = point1.subV(point);
        this.updateTransform(translation, nZoom);
        this.updateOffsetMatrix(this.offsetMatrix.translation.addV(diff));
        this.zoom = nZoom;
        this.isUpdated = false;
      }
    });
  }
}
