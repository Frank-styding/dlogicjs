import { Component } from "./Component";
import { RegisterEvent } from "./Events";
import { Viewport } from "./Viewport";

export const $RootEvents = {
  getDim: "getDim",
} as const;

export class $Root extends Component {
  constructor(public width: number, public height: number) {
    super("$root");
    this.viewport = new Viewport(width, height);
  }

  _initLayout(): void {
    this.viewport.projection.translate(this.width / 2, this.height / 2);
  }

  _initEvents(): void {
    RegisterEvent(this.context, $RootEvents.getDim, this.getDim.bind(this));
  }

  getDim() {
    return { width: this.width, height: this.height };
  }
}
