/* import { Component, Vector2, Direction } from "core/index";
interface ContainerData {
  horizontal: boolean;
  gap: number;
  directon: Direction;
  margin: [number, number];
}

export class $Container extends Component {
  constructor(public data: ContainerData) {
    super("Container");
  }

  _initLayout(): void {
    let margin = new Vector2(this.data.margin[0], this.data.margin[1]);
    let translation = new Vector2();
    let height = 10;
    let width = 10;

    for (let child of this.children) {
      child.transform.translation = margin.clone().addV(translation);
      if (this.data.horizontal) {
        height = Math.max(height, child.height);
        translation.addV(new Vector2(child.width + this.data.gap, 0));
      } else {
        width = Math.max(width, child.width);
        translation.addV(new Vector2(0, child.height + this.data.gap));
      }
    }

    if (this.data.horizontal) {
      width = translation.x;
    } else {
      height = translation.y;
    }
    if (width == 0) {
      width = 10;
    }
    if (height == 0) {
      height = 10;
    }

    this.setSize(width, height);

    if (this.data.directon == Direction.RIGHT) {
      this.model.translate(-this.width, 0);
    }
    if (this.data.directon == Direction.BOTTOM) {
      this.model.translate(0, -this.height);
    }
  }
}
 */
