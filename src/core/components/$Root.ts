import { Component } from "../Component";
import { RegisterEvent } from "../util/Events";
import { Viewport } from "../Viewport";
import { $Camera } from "./$Camera";

export const $RootEvents = {
  getDim: "getDim",
} as const;

export class $Root extends Component {
  static Name = "root";
  cameras: $Camera[];
  constructor(public width: number, public height: number) {
    super($Root.Name);
    this.viewport = new Viewport(width, height);
    this.cameras = [];
  }

  _init(): void {
    this.context.rootId = this.id;
  }

  addChild(children: Component[] | Component): void {
    if (!Array.isArray(children)) {
      children = [children];
    }
    for (let child of children) {
      if (child.name == $Camera.Name) {
        this.cameras.push(child as $Camera);
      } else {
        super.addChild(child);
      }
    }
  }

  getDim() {
    return { width: this.width, height: this.height };
  }
}
