import { Vector2 } from "./Vector2";

export class Matrix3x2 {
  constructor(public m: number[]) {}
  copy(m: Matrix3x2) {
    this.m[0] = m.m[0];
    this.m[1] = m.m[1];
    this.m[2] = m.m[2];
    this.m[3] = m.m[3];
    this.m[4] = m.m[4];
    this.m[5] = m.m[5];
    return this;
  }
  identity() {
    this.copy(Matrix3x2.identity());
    return this;
  }

  clone() {
    return new Matrix3x2([...this.m]);
  }

  translate(x: number, y: number) {
    this.copy(Matrix3x2.mul(this, Matrix3x2.translate(x, y)));
    return this;
  }

  scale(x: number, y: number) {
    this.copy(Matrix3x2.mul(this, Matrix3x2.scale(x, y)));
    return this;
  }

  rotate(a: number) {
    this.copy(Matrix3x2.mul(this, Matrix3x2.rotate(a)));
    return this;
  }

  mul(m: Matrix3x2) {
    this.copy(Matrix3x2.mul(this, m));
    return this;
  }

  applyToContext(ctx: CanvasRenderingContext2D) {
    ctx.transform(
      this.m[0],
      this.m[3],
      this.m[1],
      this.m[4],
      this.m[2],
      this.m[5]
    );
  }
  mulV(v: Vector2) {
    return new Vector2(
      this.m[0] * v.x + this.m[1] * v.y + this.m[2],
      this.m[3] * v.x + this.m[4] * v.y + this.m[5]
    );
  }
  inv() {
    return Matrix3x2.inv(this);
  }

  get translation() {
    return new Vector2(this.m[2], this.m[5]);
  }

  set translation(v: Vector2) {
    this.m[2] = v.x;
    this.m[5] = v.y;
  }

  static identity() {
    return new Matrix3x2([1, 0, 0, 0, 1, 0]);
  }
  static translate(x: number, y: number) {
    return new Matrix3x2([1, 0, x, 0, 1, y]);
  }
  static scale(x: number, y: number) {
    return new Matrix3x2([x, 0, 0, 0, y, 0]);
  }
  static rotate(a: number) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new Matrix3x2([c, -s, 0, s, c, 0]);
  }
  static mul(m: Matrix3x2, m1: Matrix3x2) {
    return new Matrix3x2([
      m.m[0] * m1.m[0] + m.m[1] * m1.m[3],
      m.m[0] * m1.m[1] + m.m[1] * m1.m[4],
      m.m[0] * m1.m[2] + m.m[1] * m1.m[5] + m.m[2],
      m.m[3] * m1.m[0] + m.m[4] * m1.m[3],
      m.m[3] * m1.m[1] + m.m[4] * m1.m[4],
      m.m[3] * m1.m[2] + m.m[4] * m1.m[5] + m.m[5],
    ]);
  }
  static inv(m: Matrix3x2) {
    const a = m.m[4] * m.m[0] - m.m[1] * m.m[3];
    return new Matrix3x2([
      m.m[4] / a,
      -m.m[1] / a,
      -(m.m[4] * m.m[2] - m.m[1] * m.m[5]) / a,
      -m.m[3] / a,
      m.m[0] / a,
      -(m.m[0] * m.m[5] - m.m[2] * m.m[3]) / a,
    ]);
  }

  static translateZoom(v: Vector2, s: number) {
    return new Matrix3x2([s, 0, v.x, 0, s, v.y]);
  }

  static invTranslateZoom(v: Vector2, s: number) {
    return new Matrix3x2([1 / s, 0, -v.x / s, 0, 1 / s, -v.y / s]);
  }
  static transform(v: Vector2, sc: Vector2, a: number = 0) {
    const c = a == 0 ? 1 : Math.cos(a);
    const s = a == 0 ? 0 : Math.sin(a);
    return new Matrix3x2([c * sc.x, -sc.y * s, v.x, sc.x * s, c * sc.y, v.y]);
  }
}
