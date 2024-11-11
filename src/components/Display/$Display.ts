import { CallEvent, Component, Matrix3x2, Vector2, Viewport } from "core/index";

export const $DisplayEvents = {
  onCameraUpdate: "onCameraUpdate",
} as const;
export class $Display extends Component {
  constructor(public width: number, public height: number) {
    super("Display");
    this.viewport = new Viewport(width, height);
  }
  _init(): void {
    this.mouseControls();
  }

  _initLayout(): void {
    this.viewport.projection.translate(this.width / 2, this.height / 2);
    this.translateAndZoom.translate(this.width / 2, this.height / 2);
  }

  mouseIsDown: boolean = false;
  startMousePos: Vector2 = new Vector2();
  mousePos: Vector2 = new Vector2();
  zoom: number = 1;
  zoomStep: number = 0.01;
  translateAndZoom: Matrix3x2 = Matrix3x2.identity();
  offsetMatrix: Matrix3x2 = Matrix3x2.identity();

  updateTransform(position: Vector2, zoom: number) {
    this.translateAndZoom.copy(Matrix3x2.translateZoom(position, 1 / zoom));
    const center = new Vector2(this.width / 2, this.height / 2);
    const matrix = Matrix3x2.mul(this.translateAndZoom, this.offsetMatrix);
    const inv = matrix.inv().mulV(center);
    this.viewport.projection.copy(matrix);
    CallEvent(this.context, $DisplayEvents.onCameraUpdate, inv, this.zoom);
  }

  updateOffsetMatrix(position: Vector2) {
    this.offsetMatrix.copy(Matrix3x2.translateZoom(position, 1));
  }

  mouseControls() {
    this.viewport.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        this.startMousePos.x = e.clientX;
        this.startMousePos.y = e.clientY;
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        this.mouseIsDown = true;
      }
    });
    this.viewport.canvas.addEventListener("mousemove", (e) => {
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
    this.viewport.canvas.addEventListener("mouseup", () => {
      this.mouseIsDown = false;
    });
    this.viewport.canvas.addEventListener("wheel", (e) => {
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
