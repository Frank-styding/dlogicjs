export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}
  addS(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }
  addV(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  addS1(s: number) {
    this.x += s;
    this.y += s;
    return this;
  }
  subS(x: number, y: number) {
    this.x -= x;
    this.y -= y;
    return this;
  }
  subV(v: Vector2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  subS1(s: number) {
    this.x -= s;
    this.y -= s;
    return this;
  }
  mulS(x: number, y: number) {
    this.x *= x;
    this.y *= y;
    return this;
  }
  mulV(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  mulS1(s: number) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  lengthSQRD() {
    return this.x * this.x + this.y * this.y;
  }
  dot(v: Vector2) {
    return this.x * v.x + this.y * v.y;
  }
  cross(v: Vector2) {
    return this.x * v.y - this.y * v.x;
  }
  nromalized() {
    return this.clone().mulS1(1 / this.length());
  }
  copy(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
}
