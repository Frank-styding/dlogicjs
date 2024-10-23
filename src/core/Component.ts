import { Box } from "./Box";
import { generateUUID } from "./generateUUID";
import { Matrix3x2 } from "./Matrix3x2";

export type Context = {
  tree: string[][];
} & Record<string, any>;

export class Component {
  public canvas: HTMLCanvasElement;
  public box: Box;
  public uuid: string;
  public isUpdated: boolean;
  public children: Component[];
  public parent?: Component;
  public context: Context;
  public name: string;
  public width: number;
  public height: number;
  public transform: Matrix3x2;
  public model: Matrix3x2;

  protected ctx2D: CanvasRenderingContext2D;
  protected treeIdx: number;

  static components: Record<string, Component> = {};

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.box = new Box();
    this.uuid = generateUUID();
    this.model = Matrix3x2.identity();
    this.transform = Matrix3x2.identity();
    this.isUpdated = false;
    this.treeIdx = 0;
    this.children = [];
    this.width = 0;
    this.height = 0;
    this.name = "Component";
    this.context = { tree: [] };
    Component.components[this.uuid] = this;
  }

  protected _init() {}
  protected _update(t: number) {
    this.isUpdated = true;
  }

  protected _prevDraw() {}
  protected _draw() {}

  draw() {
    this.ctx2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx2D.save();
    if (this.parent == undefined) {
      this.transform.applyToContext(this.ctx2D);
      this.model.applyToContext(this.ctx2D);
    }
    this._prevDraw();
    for (let i = 0; i < this.children.length; i++) {
      this.ctx2D.save();
      this.children[i].transform.applyToContext(this.ctx2D);
      this.children[i].model.applyToContext(this.ctx2D);
      this.ctx2D.drawImage(this.children[i].canvas, 0, 0);
      this.ctx2D.restore();
    }
    this._draw();
    this.ctx2D.restore();
  }

  init() {
    this.initTree();
    this._init();
  }

  update(t: number) {
    this.updateTree(t);
  }

  protected setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private initTree() {
    let list: Component[] = [this];

    while (list.length > 0) {
      const child = list.shift() as Component;
      child.context = this.context;
      this.context.tree[child.treeIdx] ||= [];
      this.context.tree[child.treeIdx].push(child.uuid);
      child._init();
      for (let subChild of child.children) {
        subChild.treeIdx = child.treeIdx + 1;
        list.push(subChild);
      }
    }
  }
  private updateTree(t: number) {
    const context = { ...this.context };
    for (let i = context.tree.length - 1; 0 <= i; --i) {
      const count = context.tree[i].length;
      for (let j = 0; j < count; j++) {
        const child = Component.components[context.tree[i][j]];

        if (!child.isUpdated) {
          child._update(t);
          child.draw();
          if (child.parent) {
            child.parent.isUpdated = false;
          }
        }
      }
    }
  }

  addChild(children: Component[] | Component) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    for (let child of children) {
      child.parent = this;
      child.context = this.context;
    }
    this.children.push(...children);
  }
}
