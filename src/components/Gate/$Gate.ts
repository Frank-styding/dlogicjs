import { Component } from "core/Component";
import { $Conection } from "./$Conection";
import { $Container } from "components/Container/$Container";
import { gridData } from "components/Grid/$Grid";
import { $Label } from "components/Label/$Label";
import { GateData } from "./GateData";
import { Direction } from "../../core/Direction";

export class $Gate extends Component {
  labelName!: $Label;

  topContainer!: $Container;
  bottomContainer!: $Container;
  leftContainer!: $Container;
  rightContainer!: $Container;

  panelWidth!: number;
  panelHeight!: number;
  viewMargin!: number;

  constructor(public data: GateData) {
    super("Gate");
    this.viewMargin = 25;
  }

  createContainers() {
    let margin = 13;
    this.topContainer = new $Container({
      horizontal: true,
      gap: 20,
      directon: Direction.TOP,
      margin: [margin, 0],
    });
    this.bottomContainer = new $Container({
      horizontal: true,
      gap: 20,
      directon: Direction.BOTTOM,
      margin: [margin, 0],
    });
    this.leftContainer = new $Container({
      horizontal: false,
      gap: 20,
      directon: Direction.LEFT,
      margin: [0, margin],
    });
    this.rightContainer = new $Container({
      horizontal: false,
      gap: 20,
      directon: Direction.RIGHT,
      margin: [0, margin],
    });

    this.addChild(this.topContainer);
    this.addChild(this.bottomContainer);
    this.addChild(this.leftContainer);
    this.addChild(this.rightContainer);
  }

  layoutContainers() {
    let separation = 7;
    this.topContainer.transform.translate(
      -this.panelWidth / 2,
      -this.panelHeight / 2 - separation
    );

    this.bottomContainer.transform.translate(
      -this.panelWidth / 2,
      this.panelHeight / 2 + separation
    );

    this.leftContainer.transform.translate(
      -this.panelWidth / 2 - separation,
      -this.panelHeight / 2
    );

    this.rightContainer.transform.translate(
      this.panelWidth / 2 + separation,
      -this.panelHeight / 2
    );
  }

  createConections() {
    this.topContainer.addChild(
      new $Conection({ name: "hola", direction: Direction.TOP, size: 1 })
    );
    this.bottomContainer.addChild(
      new $Conection({ name: "hola", direction: Direction.BOTTOM, size: 1 })
    );
    this.leftContainer.addChild(
      new $Conection({ name: "hola", direction: Direction.LEFT, size: 1 })
    );
    this.rightContainer.addChild(
      new $Conection({ name: "hola", direction: Direction.RIGHT, size: 1 })
    );
  }

  createLabel() {
    this.labelName = new $Label("And", "25px sans-serif", "rgba(0,0,0,1)");
    this.addChild(this.labelName);
  }

  layoutLabel() {}

  _init() {
    this.createContainers();
    this.createConections();
    this.createLabel();
  }

  _initLayout() {
    this.panelWidth = gridData.cellSize * 3;
    this.panelHeight = gridData.cellSize * 3;

    this.setSize(
      this.panelWidth + this.viewMargin,
      this.panelHeight + this.viewMargin
    );

    this.model.translate(-this.width / 2, -this.height / 2);

    this.view.translate(this.width / 2, this.height / 2);

    this.layoutLabel();
    this.layoutContainers();
  }

  _prevDraw(): void {
    this.ctx2D.fillStyle = "rgba(255,255,255,1)";
    this.ctx2D.fillRect(
      -this.panelWidth / 2,
      -this.panelHeight / 2,
      this.panelWidth,
      this.panelHeight
    );
    this.ctx2D.lineWidth = 3;
    this.ctx2D.strokeStyle = "rgba(0,0,0,0.7)";
    this.ctx2D.strokeRect(
      -this.panelWidth / 2,
      -this.panelHeight / 2,
      this.panelWidth,
      this.panelHeight
    );
  }
}
