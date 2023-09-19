type VerticalSubRectangleOptions =
  | { top: number; height: number }
  | { bottom: number; height: number }
  | { top: number; bottom: number };

type HorizontalSubRectangleOptions =
  | { left: number; width: number }
  | { right: number; width: number }
  | { left: number; right: number };

type SubRectangleOptions = VerticalSubRectangleOptions &
  HorizontalSubRectangleOptions;

export class Rectangle {
  public left: number;
  public right: number;
  public top: number;
  public bottom: number;

  constructor(left: number, top: number, right: number, bottom: number) {
    if (right < left || bottom < top) {
      throw new Error(
        `Invalid rectangle coordinates. Provided values: left: ${left}, right: ${right}, top: ${top}, bottom: ${bottom}`
      );
    }

    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }

  get width(): number {
    return this.right - this.left;
  }

  get height(): number {
    return this.bottom - this.top;
  }

  public getSubRectangle(options: SubRectangleOptions): Rectangle {
    let newLeft = this.left;
    let newRight = this.right;
    let newTop = this.top;
    let newBottom = this.bottom;

    // Adjust the horizontal edges based on the options
    if ("left" in options && options.left !== 0) {
      newLeft =
        options.left >= 0
          ? this.left + options.left
          : this.right + options.left;
    }

    if ("right" in options && options.right !== 0) {
      newRight =
        options.right >= 0
          ? this.left + options.right
          : this.right + options.right;
    }

    if ("width" in options) {
      if ("left" in options) {
        newRight = newLeft + options.width;
      } else if ("right" in options) {
        newLeft = newRight - options.width;
      }
    }

    // Adjust the vertical edges based on the options
    if ("top" in options && options.top !== 0) {
      newTop =
        options.top >= 0 ? this.top + options.top : this.bottom + options.top;
    }

    if ("bottom" in options && options.bottom !== 0) {
      newBottom =
        options.bottom >= 0
          ? this.top + options.bottom
          : this.bottom + options.bottom;
    }

    if ("height" in options) {
      if ("top" in options) {
        newBottom = newTop + options.height;
      } else if ("bottom" in options) {
        newTop = newBottom - options.height;
      }
    }

    // Ensure correct values and bounds
    if (
      newRight < newLeft ||
      newBottom < newTop ||
      newLeft < this.left ||
      newRight > this.right ||
      newTop < this.top ||
      newBottom > this.bottom
    ) {
      throw new Error(
        `Sub-rectangle is out of bounds. Parent bounds (left: ${this.left}, right: ${this.right}, top: ${this.top}, bottom: ${this.bottom}), Sub-rectangle bounds (left: ${newLeft}, right: ${newRight}, top: ${newTop}, bottom: ${newBottom}).`
      );
    }

    return new Rectangle(newLeft, newTop, newRight, newBottom);
  }
  // Split the rectangle into columns
  public splitVertically(columns: number): Rectangle[] {
    const verticalRects: Rectangle[] = [];

    const baseColumnWidth = Math.floor(this.width / columns);
    const remainderWidth = this.width % columns;

    let previousRight = this.left;

    for (let col = 0; col < columns; col++) {
      const columnWidth = baseColumnWidth + (col < remainderWidth ? 1 : 0);
      const columnLeft = previousRight;

      // Utilize getSubRectangle
      const columnRect = this.getSubRectangle({
        top: 0,
        bottom: 0,
        left: columnLeft,
        width: columnWidth,
      });
      verticalRects.push(columnRect);

      previousRight = columnRect.right;
    }

    return verticalRects;
  }

  // Split the rectangle into rows
  public splitHorizontally(rows: number): Rectangle[] {
    const horizontalRects: Rectangle[] = [];

    const baseRowHeight = Math.floor(this.height / rows);
    const remainderHeight = this.height % rows;

    let previousBottom = this.top;

    for (let row = 0; row < rows; row++) {
      const rowHeight = baseRowHeight + (row < remainderHeight ? 1 : 0);
      const rowTop = previousBottom;

      // Utilize getSubRectangle
      const rowRect = this.getSubRectangle({
        top: rowTop,
        height: rowHeight,
        left: 0,
        right: 0,
      });
      horizontalRects.push(rowRect);

      previousBottom = rowRect.bottom;
    }

    return horizontalRects;
  }
}

export class BoundedContext {
  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D,
    public pixelRatio: number,
    public rect: Rectangle
  ) {}

  createOffScreenCanvas() {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = this.rect.width;
    offscreenCanvas.height = this.rect.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (offscreenCtx === null) {
      throw new Error("Context doesn't exist");
    }

    return new OffscreenBoundedContext(
      this,
      offscreenCanvas,
      offscreenCtx,
      this.pixelRatio,
      new Rectangle(0, 0, this.rect.width, this.rect.height)
    );
  }

  getSubContext(subRectangleOptions: SubRectangleOptions) {
    return new BoundedContext(
      this.canvas,
      this.ctx,
      this.pixelRatio,
      this.rect.getSubRectangle(subRectangleOptions)
    );
  }

  clear() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(
      this.rect.left,
      this.rect.top,
      this.rect.width,
      this.rect.height
    );
  }

  scalePixel(value: number): number {
    return value * this.pixelRatio;
  }

  splitVertically(columns: number): BoundedContext[] {
    return this.rect.splitVertically(columns).map((column) => {
      return new BoundedContext(this.canvas, this.ctx, this.pixelRatio, column);
    });
  }

  splitHorizontally(rows: number): BoundedContext[] {
    return this.rect.splitHorizontally(rows).map((row) => {
      return new BoundedContext(this.canvas, this.ctx, this.pixelRatio, row);
    });
  }
}

export class OffscreenBoundedContext extends BoundedContext {
  constructor(
    public parent: BoundedContext,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    pixelRatio: number,
    public rect: Rectangle
  ) {
    super(canvas, ctx, pixelRatio, rect);
    this.parent = parent;
  }

  drawToParent() {
    this.parent.ctx.drawImage(
      this.canvas,
      this.parent.rect.left,
      this.parent.rect.top,
      this.parent.rect.width,
      this.parent.rect.height
    );
  }
}

export function drawRectangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, width - 2, height - 2);
}
