import { Box } from "./Box";
import { generateUUID } from "./generateUUID";
import { Mat4x3, Matrix3x2 } from "./Matrix3x2";

export class Component {
  public canvas: HTMLCanvasElement;
  public box: Box;
  public uuid: string;
  public isUpdated: boolean;
  public childs: Component[];
  public parent?: Component;
  protected ctx: CanvasRenderingContext2D;
  protected transform: Matrix3x2;
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.box = new Box();
    this.uuid = generateUUID();
    this.transform = Mat4x3.indentity();
    this.isUpdated = false;
    this.childs = [];
  }
  draw(): void {}
  update(t: number): void {}
  static updateChilds(t: number, childs: Component[]) {
    for (let i = 0; i < childs.length; i++) {
      if (!childs[i].isUpdated) {
        childs[i].update(t);
        if (childs[i].childs.length > 0) {
          this.updateChilds(t, childs[i].childs);
        }
      }
    }
  }
  static drawChilds({
    transform,
    ctx,
    childs,
  }: {
    transform: Matrix3x2;
    ctx: CanvasRenderingContext2D;
    childs: Component[];
  }) {
    Mat4x3.applyToContext(ctx, transform);
    for (let i = 0; i < childs.length; i++) {
      if (childs[i].childs.length > 0) {
        const child = childs[i];
        const data = {
          transform: child.transform,
          ctx: child.ctx,
          childs: child.childs,
        };
        this.drawChilds(data);
      } else {
        ctx.save();
        Mat4x3.applyToContext(ctx, childs[i].transform);
        ctx.drawImage(childs[i].canvas, 0, 0);
        ctx.restore();
      }
    }
  }
}
