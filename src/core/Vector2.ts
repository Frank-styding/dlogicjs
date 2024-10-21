export type Vector2 = [number, number];

export namespace V2 {
  export function addS(v: Vector2, x: number, y: number): Vector2 {
    v[0] += x;
    v[1] += y;
    return v;
  }
  export function addS1(v: Vector2, s: number): Vector2 {
    v[0] += s;
    v[1] += s;
    return v;
  }
  export function addV(v: Vector2, v1: Vector2): Vector2 {
    v[0] += v1[0];
    v[1] += v1[1];
    return v;
  }
  export function subS(v: Vector2, x: number, y: number): Vector2 {
    v[0] -= x;
    v[1] -= y;
    return v;
  }
  export function subS1(v: Vector2, s: number): Vector2 {
    v[0] -= s;
    v[1] -= s;
    return v;
  }
  export function subV(v: Vector2, v1: Vector2): Vector2 {
    v[0] -= v1[0];
    v[1] -= v1[1];
    return v;
  }
  export function mulS(v: Vector2, x: number, y: number): Vector2 {
    v[0] *= x;
    v[1] *= y;
    return v;
  }
  export function mulS1(v: Vector2, s: number): Vector2 {
    v[0] *= s;
    v[1] *= s;
    return v;
  }
  export function length(v: Vector2) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }

  export function lengthSQRT(v: Vector2) {
    return v[0] * v[0] + v[1] * v[1];
  }

  export function clone(v: Vector2): Vector2 {
    return [v[0], v[1]];
  }
  export function copy(v: Vector2, v1: Vector2): Vector2 {
    v[0] = v1[0];
    v[1] = v1[1];
    return v;
  }
  export function dot(v: Vector2, v1: Vector2) {
    return v[0] * v1[0] + v[1] * v1[1];
  }
  export function cross(v: Vector2, v1: Vector2) {
    return v[0] * v1[1] - v[1] * v1[0];
  }
  export function normalize(v: Vector2) {
    return mulS1(clone(v), length(v));
  }
  export function v2(): Vector2 {
    return [0, 0];
  }
  export function set(v: Vector2, x: number, y: number) {
    v[0] = x;
    v[1] = y;
    return v;
  }
}
