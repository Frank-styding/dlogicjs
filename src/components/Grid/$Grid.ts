/* import { Component, RegisterEvent, Matrix3x2, Vector2 } from "core/index";

interface GridData {
  chunks: number;
  cellSize: number;
}

export const gridData: GridData = {
  chunks: 3,
  cellSize: 50,
};

export const GridEvents = {
  onCameraUpdate: "onCameraUpdate",
};

export class $Grid extends Component {
  gridDimX!: number;
  gridDimY!: number;
  halfViewWidth!: number;
  halfViewHeight!: number;

  constructor(public screenWidth: number, public screenHeight: number) {
    super("Grid");
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

    this.setSize(
      gridDimX * scale * gridData.cellSize,
      gridDimY * scale * gridData.cellSize
    );
  }

  _initLayout(): void {
    this.model.translate(-this.width / 2, -this.height / 2);
  }

  _initEvents(): void {
    RegisterEvent(
      this.context,
      GridEvents.onCameraUpdate,
      this.onCameraUpdate.bind(this)
    );
  }

  onCameraUpdate(cameraPosition: Vector2): void {
    const position = this.transform.translation;
    const diff = cameraPosition.subV(position);
    if (diff.x > this.halfViewWidth) {
      this.transform.copy(
        Matrix3x2.translate(position.x + this.halfViewWidth, position.y)
      );
    }
    if (diff.x < -this.halfViewWidth) {
      this.transform.copy(
        Matrix3x2.translate(position.x - this.halfViewWidth, position.y)
      );
    }
    if (diff.y > this.halfViewHeight) {
      this.transform.copy(
        Matrix3x2.translate(position.x, position.y + this.halfViewHeight)
      );
    }
    if (diff.y < -this.halfViewWidth) {
      this.transform.copy(
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

  _draw(): void {
    const radius = 4;
    for (let i = 0; i < this.gridDimX; i++) {
      for (let j = 0; j < this.gridDimY; j++) {
        this.ctx2D.beginPath();
        this.ctx2D.fillStyle = "black";
        this.ctx2D.arc(
          i * gridData.cellSize,
          j * gridData.cellSize,
          radius,
          0,
          Math.PI * 2
        );
        this.ctx2D.fill();
      }
    }
  }
}
 */
