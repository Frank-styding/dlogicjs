import { Matrix3x2 } from "./Matrix3x2";

export class Transform {
  model: Matrix3x2 = Matrix3x2.identity();
  view: Matrix3x2 = Matrix3x2.identity();

  getMatrix() {
    return this.model.clone().mul(this.view);
  }
}
