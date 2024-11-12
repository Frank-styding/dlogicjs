import { Component } from "../Component";
import { Matrix3x2 } from "./Matrix3x2";

export class Transform {
  model: Matrix3x2 = Matrix3x2.identity();
  view: Matrix3x2 = Matrix3x2.identity();
  parentTransform: Matrix3x2 = Matrix3x2.identity();

  constructor(public component: Component) {}

  getMatrix() {
    return this.model.clone().mul(this.view);
  }
}
