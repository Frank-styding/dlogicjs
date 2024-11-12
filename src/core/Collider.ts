import { Component } from "./Component";
import { Matrix3x2 } from "./math/Matrix3x2";
import { Vector2 } from "./math/Vector2";

export class Box {
  constructor(
    public component: Component,
    public width: number,
    public height: number
  ) {}
}

export class Collider {
  model: Matrix3x2 = Matrix3x2.identity();

  constructor(public component: Component) {}
  mouseIsInside(mousePos: Vector2): boolean {
    return false;
  }
}

export class RectCollider extends Collider {
  constructor(
    public component: Component,
    public width: number,
    public height: number
  ) {
    super(component);
  }
  mouseIsInside(mousePos: Vector2): boolean {
    return false;
  }
}
