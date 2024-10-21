import { Vector2 } from "./Vector2";

export type Matrix3x2 = [number, number, number, number, number, number];

export namespace Mat4x3 {
  export function mul(m: Matrix3x2, m1: Matrix3x2): Matrix3x2 {
    return [
      m[0] * m1[0] + m[1] * m1[3],
      m[0] * m1[1] + m[1] * m1[4],
      m[0] * m1[2] + m[1] * m1[5] + m[2],
      m[3] * m1[0] + m[4] * m1[3],
      m[3] * m1[1] + m[4] * m1[4],
      m[3] * m1[2] + m[4] * m1[5] + m[5],
    ];
  }
  export function mulV(m: Matrix3x2, v: Vector2): Vector2 {
    return [v[0] * m[0] + v[1] * m[1] + m[2], v[0] * m[3] + v[1] * m[4] + m[5]];
  }
  export function clone(m: Matrix3x2): Matrix3x2 {
    return [...m];
  }
  export function copy(m: Matrix3x2, m1: Matrix3x2): Matrix3x2 {
    m[0] = m1[0];
    m[1] = m1[1];
    m[2] = m1[2];
    m[3] = m1[3];
    m[4] = m1[4];
    m[5] = m1[5];
    return m;
  }
  export function rotate(a: number): Matrix3x2 {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [c, -s, 0, s, c, 0];
  }

  export function scale(x: number, y: number): Matrix3x2 {
    return [x, 0, 0, 0, y, 0];
  }

  export function translate(x: number, y: number) {
    return [1, 0, x, 0, 1, y];
  }

  export function transformData(
    v: Vector2,
    sc: Vector2,
    a: number = 0
  ): Matrix3x2 {
    const c = a == 0 ? 1 : Math.cos(a);
    const s = a == 0 ? 0 : Math.sin(a);
    return [c * sc[0], -sc[1] * s, v[0], sc[0] * s, c * sc[1], v[1]];
  }
  export function indentity(): Matrix3x2 {
    return [1, 0, 0, 0, 1, 0];
  }
  export function applyToContext(ctx: CanvasRenderingContext2D, m: Matrix3x2) {
    ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
  }

  export function translateZoom(v: Vector2, s: number): Matrix3x2 {
    return [s, 0, v[0], 0, s, v[1]];
  }

  export function invTranslateZoom(v: Vector2, s: number): Matrix3x2 {
    return [1 / s, 0, -v[0] / s, 0, 1 / s, -v[1] / s];
  }
  export function translation(m: Matrix3x2): Vector2 {
    return [m[2], m[5]];
  }
}
/* export class Matrix3x2 {
  constructor(public data: number[] = [1, 0, 0, 0, 1, 0]) {}

  mul(m: Matrix3x2) {
    return [
      this.data[0] * m.data[0] + this.data[1] * m.data[3],
      this.data[0] * m.data[1] + this.data[1] * m.data[4],
      this.data[0] * m.data[2] + this.data[1] * m.data[5] + this.data[2],
      this.data[3] * m.data[0] + this.data[4] * m.data[3],
      this.data[3] * m.data[1] + this.data[4] * m.data[4],
      this.data[3] * m.data[2] + this.data[4] * m.data[5] + this.data[5],
    ];
  }
  static translateData(x: number, y: number) {
    return [1, 0, x, 0, 1, y];
  }
  static rotateData(a: number) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [c, -s, 0, s, c, 0];
  }
  static scaleData(x: number, y: number) {
    return [x, 0, 0, 0, y, 0];
  }

  static transformData(v: Vector2, sc: Vector2, a: number = 0) {
    const c = a == 0 ? 1 : Math.cos(a);
    const s = a == 0 ? 0 : Math.sin(a);
    return [c * sc.x, -sc.y * s, v.x, sc.x * s, c * sc.y, v.y];
  }

  ////
  static translateZoomData(v: Vector2, s: number) {
    return [s, 0, v.x, 0, s, v.y];
  }

  static translateZoom(v: Vector2, s: number) {
    return new Matrix3x2([s, 0, v.x, 0, s, v.y]);
  }

  static invTranslateZoom(v: Vector2, s: number) {
    return new Matrix3x2([1 / s, 0, -v.x / s, 0, 1 / s, -v.y / s]);
  }

  static diffZoom(v: Vector2, s: number, s1: number, p: Vector2) {
    return new Vector2(
      (v.x * (s - s1)) / (s * s1) + (p.x * (s1 - s)) / (s * s1) - p.x,
      (v.y * (s - s1)) / (s * s1) + (p.y * (s1 - s)) / (s * s1) - p.y
    );
  }

  ////

  clone() {
    return new Matrix3x2([...this.data]);
  }
  copy(m: Matrix3x2) {
    this.data = m.data;
    return this;
  }
  copyData(data: number[]) {
    this.data = data as [number, number, number, number, number, number];
    return this;
  }
  mulV(v: Vector2) {
    return new Vector2(
      v.x * this.data[0] + v.y * this.data[1] + this.data[2],
      v.x * this.data[3] + v.y * this.data[4] + this.data[5]
    );
  }
  toTransform(ctx: CanvasRenderingContext2D) {
    ctx.transform(
      this.data[0],
      this.data[3],
      this.data[1],
      this.data[4],
      this.data[2],
      this.data[5]
    );
  }
  get translation() {
    return new Vector2(this.data[2], this.data[5]);
  }
}
 */
