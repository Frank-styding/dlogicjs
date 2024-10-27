/* import { Component } from "core/index";

export class $Label extends Component {
  constructor(
    public text: string,
    public font: string,
    public fillStyle: string
  ) {
    super("Text");
  }

  _init(): void {
    this.ctx2D.font = this.font;
    const fM = this.ctx2D.measureText(this.text);
    this.setSize(
      fM.width,
      fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent
    );
  }

  _initLayout(): void {
    this.model.translate(-this.width / 2, -this.height / 2);
  }

  _draw(): void {
    console.log("draw label");
    this.ctx2D.font = this.font;
    this.ctx2D.fillStyle = this.fillStyle;
    this.ctx2D.fillText(this.text, 0, this.height);
  }
}
 */
