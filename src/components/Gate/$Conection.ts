/* import { Component } from "core/index";
import { ConnectionData } from "./ConnectionData";
import { $Label } from "components/Label/$Label";
import { Direction } from "../../core/Direction";

export class $Conection extends Component {
  static WIDTH = 20;
  static HEIGHT = 13;
  static COLOR = "rgba(100,100,100,1)";
  static spacing = 10;

  label!: $Label;
  panelWidth!: number;
  panelHeight!: number;

  constructor(public data: ConnectionData) {
    super("Conection");
  }

  _init(): void {
    this.label = new $Label("A", "20px sans-serif", "rgba(0,0,0,1)");
    this.label.visible = false;
    this.addChild(this.label);
  }

  _initLayout(): void {
    if (
      this.data.direction == Direction.LEFT ||
      this.data.direction == Direction.RIGHT
    ) {
      this.panelWidth = $Conection.HEIGHT;
      this.panelHeight = $Conection.WIDTH;
      this.setSize(
        this.panelWidth + this.label.width + $Conection.spacing,
        this.panelHeight
      );
    } else {
      this.panelWidth = $Conection.WIDTH;
      this.panelHeight = $Conection.HEIGHT;
      this.setSize(
        this.panelWidth,
        this.panelHeight + this.label.height + $Conection.spacing
      );
    }

    if (this.data.direction == Direction.RIGHT) {
      this.label.transform.translate(this.label.width / 2, this.height / 2);
    }

    if (this.data.direction == Direction.LEFT) {
      this.label.transform.translate(
        this.width - this.label.width / 2,
        this.height / 2
      );
    }

    if (this.data.direction == Direction.TOP) {
      this.label.transform.translate(
        this.width / 2,
        this.height - this.label.height / 2
      );
    }
    if (this.data.direction == Direction.BOTTOM) {
      this.label.transform.translate(this.width / 2, this.label.height / 2 + 3);
    }
  }

  _prevDraw(): void {
        this.ctx2D.fillStyle = "red";
    this.ctx2D.fillRect(0, 0, this.width, this.height);
    this.ctx2D.fillStyle = $Conection.COLOR;
    if (
      this.data.direction == Direction.LEFT ||
      this.data.direction == Direction.TOP
    ) {
      this.ctx2D.fillRect(0, 0, this.panelWidth, this.panelHeight);
    } else {
      this.ctx2D.fillRect(
        this.width - this.panelWidth,
        this.height - this.panelHeight,
        this.panelWidth,
        this.panelHeight
      );
    }
  }
}
 */
