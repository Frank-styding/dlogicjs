import { Collider } from "./Collider";
import { generateUUID } from "./util/generateUUID";
import { Transform } from "./math/Transform";
import { Viewport } from "./Viewport";

export type Context = {
  tree: string[][];
  treeReady: boolean;
  rootId: string;
  events: Record<string, Function[]>;
} & Record<string, any>;

export class Component {
  static components: Record<string, Component> = {};

  private _viewport?: Viewport;
  public collider?: Collider;
  public parent?: string;

  public layerIdx: number;
  private treeIdx: number;

  protected relaComponents: string[];
  protected compViewports: string[];
  protected pathToBaseComp: string[];
  protected globalPath: string[];

  //* varibles of control
  public isUpdated: boolean;
  public isInitialized: boolean;
  public isLayoutInitialized: boolean;
  public isFirstDraw: boolean;

  //*context
  public context: Context;

  //*properties
  public id: string;
  public name: string;
  public children: string[];
  public visible: boolean;
  public active: boolean;
  public transform: Transform;
  public zIndex: number;
  public hasViewport: boolean;

  constructor(name?: string) {
    this.transform = new Transform(this);

    this.isUpdated = false;
    this.isInitialized = false;
    this.isLayoutInitialized = false;
    this.isFirstDraw = true;

    this.context = { tree: [], treeReady: false, rootId: "", events: {} };
    this.treeIdx = 0;
    this.layerIdx = -1;
    this.relaComponents = [];
    this.pathToBaseComp = [];
    this.compViewports = [];
    this.globalPath = [];

    this.name = name || "Component";
    this.id = generateUUID();
    this.visible = true;
    this.active = true;
    this.children = [];
    this.zIndex = 0;
    this.hasViewport = false;

    Component.components[this.id] = this;
  }

  get viewport() {
    return this._viewport as Viewport;
  }

  set viewport(viewport: Viewport) {
    this._viewport = viewport;
    this.hasViewport = true;
  }

  // * INTERNAL FUNCTIONS
  _update(t: number) {
    this.isUpdated = true;
  }

  _init() {}
  _initLayout() {}
  _ready() {}
  _initEvents() {}

  _prevDraw(ctx: CanvasRenderingContext2D) {}
  _draw(ctx: CanvasRenderingContext2D) {}

  //* ////////////////////

  init() {
    Component.initTree(this.id);
    this.context.treeReady = true;
    Component.initComponents({ ...this.context });
  }

  update(t: number) {
    Component.updateTree(t, { ...this.context });
  }

  draw() {
    if (this._viewport == undefined) return;
    this._viewport.clear();
    this._viewport.save();
    this._viewport.applyProjection();
    this._prevDraw(this._viewport.ctx);
    for (let i = 0; i < this.relaComponents.length; i++) {
      const component = Component.components[this.relaComponents[i]];
      this._viewport.save();

      for (let j = 0; j < component.pathToBaseComp.length; j++) {
        const subComponent = Component.components[component.pathToBaseComp[j]];
        this._viewport.applyTransform(subComponent.transform);
      }

      this._viewport.applyTransform(component.transform);

      if (component.hasViewport) {
        this._viewport.drawViewport(component._viewport as Viewport);
      } else {
        component._draw(this._viewport.ctx);
      }

      this._viewport.restore();
    }
    this._draw(this._viewport.ctx);
    this._viewport.restore();
  }

  addChild(children: Component[] | Component) {
    if (!Array.isArray(children)) {
      children = [children];
    }

    for (let child of children) {
      child.parent = this.id;
      child.context = this.context;
    }

    this.children.push(...children.map((child) => child.id));

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
    let list: string[] = [componentId];
    let paths: string[][] = [[]];

    while (list.length > 0) {
      const child = Component.components[list.shift() as string];
      const path = paths.shift() as string[];
      if (!child.isInitialized) {
        child.globalPath.push(...path);
        child.context = component.context;
        component.context.tree[child.treeIdx] ||= [];
        component.context.tree[child.treeIdx].push(child.id);

        child._init();
        child._initEvents();
        child.isInitialized = true;

        let count = -1;
        let invert = child.layerIdx < 0;

        let absLayerIdx =
          child.layerIdx > 0 ? child.layerIdx : Math.abs(child.layerIdx) - 1;

        let lastRelaCompIdx = -1;

        for (let i = 0; i < path.length; i++) {
          const idx = invert ? path.length - i - 1 : i;
          const compId = path[idx];
          const component = Component.components[compId];

          if (component._viewport) {
            count++;

            if (!child._viewport && count == absLayerIdx) {
              component.relaComponents.push(child.id);
            }

            if (count == absLayerIdx) {
              lastRelaCompIdx = idx;
            }

            if (invert) {
              child.compViewports.unshift(compId);
            } else {
              child.compViewports.push(compId);
            }
          }

          if (count >= absLayerIdx || count == -1) {
            if (invert) {
              child.pathToBaseComp.unshift(compId);
            } else {
              child.pathToBaseComp.push(compId);
            }
          }
        }

        if (lastRelaCompIdx != -1) {
          const component = Component.components[path[lastRelaCompIdx]];

          if (child._viewport) {
            component.relaComponents.push(child.id);
          } else {
            child._viewport = component.viewport;
          }
        }

        for (let subChildId of child.children) {
          const subChild = Component.components[subChildId];
          subChild.treeIdx = child.treeIdx + 1;
          subChild.zIndex = child.treeIdx;
          list.push(subChild.id);
          paths.push([...path, child.id]);
        }
      }
    }
  }

  static initComponents(context: Context): void {
    for (let i = context.tree.length - 1; 0 <= i; --i) {
      const count = context.tree[i].length;
      for (let j = 0; j < count; j++) {
        const child = Component.components[context.tree[i][j]];
        if (!child.isLayoutInitialized) {
          child._initLayout();
          child._ready();
          if (child.parent) {
            Component.components[child.parent].isLayoutInitialized = false;
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

        if ((!child.isUpdated && child.active) || child.isFirstDraw) {
          child.isFirstDraw = false;
          child._update(t);
          if (child.visible) {
            child.draw();
            for (let compId of child.compViewports) {
              Component.components[compId].isUpdated = false;
            }
          }
        }
      }
    }
  }

  static get(id: string) {
    return this.components[id];
  }
}
