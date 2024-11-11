import { $DisplayEvents } from "components/Display/$Display";
import {
  Component,
  Matrix3x2,
  Vector2,
  RegisterEvent,
  Viewport,
} from "core/index";

export const gridData = {
  chunks: 3,
  cellSize: 50,
} as const;

export class $Grid extends Component {
  gridDimX!: number;
  gridDimY!: number;
  halfViewWidth!: number;
  halfViewHeight!: number;
  constructor(public screenWidth: number, public screenHeight: number) {
    super("Grid");
    this.viewport = new Viewport(0, 0);
  }
  _init(): void {
    const { gridDimX, gridDimY } = this.calcSize(
      this.screenWidth,
      this.screenHeight
    );
    const scale = 2 * gridData.chunks - 1;
    this.gridDimY = gridDimY * scale;
    this.gridDimX = gridDimX * scale;
    this.halfViewWidth = ((gridDimX - 1) / 2 + 0.5) * gridData.cellSize;
    this.halfViewHeight = ((gridDimY - 1) / 2 + 0.5) * gridData.cellSize;
    this.viewport.setSize(
      gridDimX * scale * gridData.cellSize,
      gridDimY * scale * gridData.cellSize
    );
  }
  _initLayout(): void {
    this.transform.model.translate(
      -this.viewport.width / 2,
      -this.viewport.height / 2
    );
  }

  _initEvents(): void {
    RegisterEvent(
      this.context,
      $DisplayEvents.onCameraUpdate,
      this.onCameraUpdate.bind(this)
    );
  }
  _ready(): void {
    console.log(this.globalPath);
  }

  _update(t: number): void {
    this.isUpdated = true;
  }

  onCameraUpdate(cameraPosition: Vector2): void {
    const position = this.transform.view.translation;
    const diff = cameraPosition.subV(position);
    if (diff.x > this.halfViewWidth) {
      this.transform.view.copy(
        Matrix3x2.translate(position.x + this.halfViewWidth, position.y)
      );
    }
    if (diff.x < -this.halfViewWidth) {
      this.transform.view.copy(
        Matrix3x2.translate(position.x - this.halfViewWidth, position.y)
      );
    }
    if (diff.y > this.halfViewHeight) {
      this.transform.view.copy(
        Matrix3x2.translate(position.x, position.y + this.halfViewHeight)
      );
    }
    if (diff.y < -this.halfViewWidth) {
      this.transform.view.copy(
        Matrix3x2.translate(position.x, position.y - this.halfViewHeight)
      );
    }
  }

  calcSize(screenWidth: number, screenHeight: number) {
    let gridDimX = Math.round(screenWidth / gridData.cellSize);
    let gridDimY = Math.round(screenHeight / gridData.cellSize);
    // convert to odd to center the gird in a cell
    gridDimX = gridDimX - (gridDimX % 2);
    gridDimY = gridDimY - (gridDimY % 2);
    return { gridDimX, gridDimY };
  }

  _draw(ctx: CanvasRenderingContext2D): void {
    const radius = 4;
    for (let i = 0; i < this.gridDimX; i++) {
      for (let j = 0; j < this.gridDimY; j++) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(
          i * gridData.cellSize,
          j * gridData.cellSize,
          radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}
