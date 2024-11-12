import { Component } from "core/Component";
import { Viewport } from "core/Viewport";
import { $Camera } from "./$Camera";
import { CallEvent } from "core/util/Events";

export const $DisplayEvents = {
  onMouseDown: "onMouseDown",
  onMouseUp: "onMouseUp",
  onMouseMove: "onMouseMove",
  onMouseWheel: "onMouseWheel",
};

export class $Display extends Component {
  static Name: string = "Display";
  cameras: $Camera[];
  constructor(public width: number, public height: number) {
    super($Display.Name);
    this.viewport = new Viewport(width, height);
    this.cameras = [];
  }

  addChild(children: Component[] | Component): void {
    if (!Array.isArray(children)) children = [children];
    for (let child of children) {
      if (child.name == $Camera.Name) {
        this.cameras.push(child as $Camera);
      }
    }
    super.addChild(children);
  }

  _init(): void {
    if (this.cameras.length == 1) {
      this.cameras[0].active = true;
    }
  }

  _initEvents(): void {
    this.viewport.canvas.addEventListener("mousedown", (e) => {
      CallEvent(this.context, $DisplayEvents.onMouseDown, () => [e]);
    });
    this.viewport.canvas.addEventListener("mousemove", (e) => {
      CallEvent(this.context, $DisplayEvents.onMouseMove, () => [e]);
    });
    this.viewport.canvas.addEventListener("mouseup", (e) => {
      CallEvent(this.context, $DisplayEvents.onMouseUp, () => [e]);
    });
    this.viewport.canvas.addEventListener("wheel", (e) => {
      CallEvent(this.context, $DisplayEvents.onMouseWheel, () => [e]);
    });
  }
}
