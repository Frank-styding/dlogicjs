import { Component, Context } from "../core/Component";
import { gridData } from "./Grid";

enum Direction {
  DOWN,
  RIGHT,
  TOP,
  LEFT,
}

interface ConnectionData {
  name: string;
  direction: Direction;
  size: number;
}

interface GateData {
  connections: ConnectionData;
  name: string;
}

export class $Text extends Component {
  constructor(
    public text: string,
    public font: string,
    public fillStyle: string
  ) {
    super();
    this.name = "Text";

    this.ctx2D.font = this.font;
    const fM = this.ctx2D.measureText(text);

    this.setSize(
      fM.width,
      fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent
    );
    this.model.translate(-this.width / 2, -this.height / 2);
  }
  protected _draw(): void {
    console.log("draw");
    this.ctx2D.font = this.font;
    this.ctx2D.fillStyle = this.fillStyle;
    this.ctx2D.fillText(this.text, 0, this.height);
  }
}

export class Gate extends Component {
  text: $Text;
  constructor() {
    super();
    this.name = "Gate";
    this.setSize(gridData.cellSize * 3, gridData.cellSize * 3);
    this.text = new $Text("And", "25px sans-serif", "rgba(0,0,0,1)");
    this.model.translate(-this.width / 2, -this.height / 2);
    this.addChild(this.text);
  }

  protected _init(): void {
    this.initLayout();
  }

  initLayout() {
    this.text.transform.translate(this.width / 2, this.height / 2);
  }

  protected _prevDraw(): void {
    this.ctx2D.fillStyle = "rgba(255,255,255,1)";
    this.ctx2D.fillRect(0, 0, this.width, this.height);
    this.ctx2D.lineWidth = 8;
    this.ctx2D.strokeStyle = "rgba(0,0,0,0.7)";
    this.ctx2D.strokeRect(0, 0, this.width, this.height);
  }
}
