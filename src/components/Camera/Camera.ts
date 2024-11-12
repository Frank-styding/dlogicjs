import { Component } from "core/Component";

export class $Camera extends Component {
  root!: Component;
  width!:number;
  height!:number;
  constructor() {
    super("Camera");
  }

  _ready(): void {
    this.root = Component.get(this.context.rootId as string;
    this.root.viewport.projection.translate(this)
  }
}
