import { Component } from "../core/Component";

interface GridData {
  chunks: number;
  cellSize: number;
}

export const gridData: GridData = {
  chunks: 2,
  cellSize: 50,
};

export class Grid extends Component {
  constructor() {
    super();
    const { width, height } = this.calcSize();
    this.canvas.width = width;
    this.canvas.height = height;
  }

  calcSize() {
    const screenWidth = innerWidth;
    const screenHeight = innerHeight;

    let gridDimX = Math.floor(screenWidth / gridData.cellSize);
    let gridDimY = Math.floor(screenHeight / gridData.cellSize);

    // convert to odd to center the gird in a cell
    gridDimX = gridDimX - (gridDimX % 2);
    gridDimY = gridDimY - (gridDimY % 2);

    return {
      width: gridData.cellSize * gridDimX * gridData.chunks,
      height: gridData.cellSize * gridDimY * gridData.chunks,
    };
  }
}
