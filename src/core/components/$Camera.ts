import { Component } from "core/Component";
import { Matrix3x2 } from "core/math/Matrix3x2";
import { Vector2 } from "core/math/Vector2";
import { CallEvent, RegisterEvent } from "core/util/Events";
import { Viewport } from "core/Viewport";
import { $DisplayEvents } from "./$Display";

export const $CameraEvents = {
  onCameraUpdate: "onCameraUpdate",
  onCameraMouseDown: "onCameraMouseDown",
  onCameraMouseUp: "onCameraMouseUp",
  onCameraMouseMove: "onCameraMouseMove",
} as const;

export class $Camera extends Component {
  static Name = "Camera";
  mouseIsDown = false;
  startMousePos = new Vector2();
  mousePos = new Vector2();
  zoom: number = 1;
  zoomStep: number = 0.01;

  offset = Matrix3x2.identity();
  projection = Matrix3x2.identity();

  constructor(public width: number, public height: number) {
    super($Camera.Name);
    this.viewport = new Viewport(width, height);
    this.active = false;
  }

  _initLayout(): void {
    this.viewport.projection.translate(this.width / 2, this.height / 2);
    this.projection.translate(this.width / 2, this.height / 2);
  }

  updateTransform(position: Vector2, zoom: number) {
    this.projection.copy(Matrix3x2.translateZoom(position, 1 / zoom));
    const center = new Vector2(this.width / 2, this.height / 2);
    const matrix = Matrix3x2.mul(this.projection, this.offset);
    const relativePos = matrix.inv().mulV(center);
    this.viewport.projection.copy(matrix);
    CallEvent(this.context, $CameraEvents.onCameraUpdate, () => [
      relativePos,
      this.zoom,
    ]);
  }

  updateOffset(position: Vector2) {
    this.offset.copy(Matrix3x2.translate(position.x, position.y));
  }

  _initEvents(): void {
    RegisterEvent(
      this.context,
      $DisplayEvents.onMouseDown,
      this.onMouseDown.bind(this)
    );
    RegisterEvent(
      this.context,
      $DisplayEvents.onMouseMove,
      this.onMouseMove.bind(this)
    );
    RegisterEvent(
      this.context,
      $DisplayEvents.onMouseUp,
      this.onMouseUp.bind(this)
    );
    RegisterEvent(
      this.context,
      $DisplayEvents.onMouseWheel,
      this.onMouseWheel.bind(this)
    );
  }

  onMouseDown(e: MouseEvent) {
    const translation = this.transform.model.translation;
    const mousePos = new Vector2(e.clientX, e.clientY);
    this.startMousePos.copy(mousePos.clone().subV(translation));
    this.mousePos.copy(mousePos.clone().subV(translation));
    if (e.button === 1) {
      this.mouseIsDown = true;
    }
    CallEvent(this.context, $CameraEvents.onCameraMouseDown, () => [
      e,
      this.viewport.projection.inv().mulV(this.mousePos),
    ]);
  }
  onMouseMove(e: MouseEvent) {
    const translation = this.transform.model.translation;
    const mousePos = new Vector2(e.clientX, e.clientY);
    this.mousePos.copy(mousePos.clone().subV(translation));
    if (this.mouseIsDown) {
      const diff = this.mousePos.clone().subV(this.startMousePos);
      this.startMousePos.copy(this.mousePos);
      this.isUpdated = false;
      this.updateTransform(this.projection.translation.addV(diff), this.zoom);
    }

    CallEvent(this.context, $CameraEvents.onCameraMouseMove, () => [
      e,
      this.viewport.projection.inv().mulV(this.mousePos),
    ]);
  }
  onMouseUp() {
    this.mouseIsDown = false;
  }
  onMouseWheel(e: WheelEvent) {
    if (e.deltaY != 0 && !this.mouseIsDown) {
      const step = (e.deltaY < 0 ? -1 : 1) * this.zoomStep;
      const nZoom = step + this.zoom;
      const mouse = this.mousePos.clone();
      const translation = this.projection.translation;
      const point = Matrix3x2.invTranslateZoom(translation, 1 / this.zoom).mulV(
        mouse
      );
      const point1 = Matrix3x2.invTranslateZoom(translation, 1 / nZoom).mulV(
        mouse
      );
      const diff = point1.subV(point);
      this.updateTransform(translation, nZoom);
      this.updateOffset(this.offset.translation.addV(diff));
      this.zoom = nZoom;
      this.isUpdated = false;
    }
  }
}
