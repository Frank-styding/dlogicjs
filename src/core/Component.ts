import { Collider } from "./Box";
import { generateUUID } from "./generateUUID";
import { Matrix3x2 } from "./Matrix3x2";

export type Context = {
  tree: string[][];
  treeReady: boolean;
  rootId?: string;
} & Record<string, any>;

export class Component {
  //* canvas
  public canvas: HTMLCanvasElement;
  protected ctx2D: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  //* varibles of control
  public isUpdated: boolean;
  public isInitialized: boolean;
  public isLayoutInitialized: boolean;

  //*context
  public context: Context;

  //*properties
  public name: string;
  public id: string;
  public collider: Collider;
  public children: Component[];
  public parent?: Component;
  public visible: boolean;
  protected treeIdx: number;

  //*transform;
  public view: Matrix3x2;
  public transform: Matrix3x2;
  public model: Matrix3x2;
  //* record of components
  static components: Record<string, Component> = {};

  constructor(name?: string) {
    this.canvas = document.createElement("canvas");
    this.ctx2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.width = 0;
    this.height = 0;

    this.collider = new Collider();

    this.model = Matrix3x2.identity();
    this.transform = Matrix3x2.identity();
    this.view = Matrix3x2.identity();

    this.isUpdated = false;
    this.isInitialized = false;
    this.isLayoutInitialized = false;

    this.context = { tree: [], treeReady: false };
    this.treeIdx = 0;

    this.name = name || "Component";
    this.id = generateUUID();
    this.visible = true;
    this.children = [];

    Component.components[this.id] = this;
  }

  // * INTERNAL FUNCTIONS
  _update(t: number) {
    this.isUpdated = true;
  }

  _init() {}
  _initLayout() {}
  _ready() {}
  _initEvents() {}

  _prevDraw() {}
  _draw() {}

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  //* ////////////////////

  init() {
    Component.initTree(this.id);
    this.context.treeReady = true;
    this.context.rootId = this.id;
    Component.initComponents({ ...this.context });
  }

  update(t: number) {
    Component.updateTree(t, { ...this.context });
  }

  draw() {
    this.ctx2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx2D.save();
    this.view.applyToContext(this.ctx2D);
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

  addChild(children: Component[] | Component) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    for (let child of children) {
      child.parent = this;
      child.context = this.context;
    }
    this.children.push(...children);

    if (this.context.treeReady) {
      for (let child of children) {
        Component.initTree(child.id);
      }
      Component.initComponents(this.context);
    }
  }

  //* /////////////////

  static initTree(componentId: string) {
    const component = Component.components[componentId];
    let list: Component[] = [component];
    while (list.length > 0) {
      const child = list.shift() as Component;
      if (!child.isInitialized) {
        child.context = component.context;
        component.context.tree[child.treeIdx] ||= [];
        component.context.tree[child.treeIdx].push(child.id);

        child._init();
        child._initEvents();
        child.isInitialized = true;

        for (let subChild of child.children) {
          subChild.treeIdx = child.treeIdx + 1;
          list.push(subChild);
        }
      }
    }
  }

  static initComponents(context: Context): void {
    for (let i = context.tree.length - 1; 0 <= i; --i) {
      const count = context.tree[i].length;
      for (let j = 0; j < count; j++) {
        const child = Component.components[context.tree[i][j]];
        if (!child.isLayoutInitialized && child.visible) {
          child._initLayout();
          child._ready();
          if (child.parent) {
            child.parent.isLayoutInitialized = false;
          }
          child.isLayoutInitialized = true;
        }
      }
    }
  }

  static updateTree(t: number, context: Context) {
    for (let i = context.tree.length - 1; 0 <= i; --i) {
      const count = context.tree[i].length;
      for (let j = 0; j < count; j++) {
        const child = Component.components[context.tree[i][j]];

        if (!child.isUpdated && child.visible) {
          child._update(t);
          child.draw();
          if (child.parent) {
            child.parent.isUpdated = false;
          }
        }
      }
    }
  }
}
