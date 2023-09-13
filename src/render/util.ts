function parseDimension(value: number | null, maxValue: number) {
  if (value === null) {
    return maxValue;
  }

  if (value < 0) {
    return maxValue - value;
  }

  if (value > maxValue && value < 0) {
    throw new Error(`Out of bounds. maxValue=${maxValue} value=${value}`);
  }

  return value;
}
export class BoundedRenderingContext {
  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D,
    public pixelRatio: number,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  createNew(x: number, y: number, width: number | null, height: number | null) {
    return new BoundedRenderingContext(
      this.canvas,
      this.ctx,
      this.pixelRatio,
      this.x + x,
      this.y + y,
      parseDimension(width, this.width),
      parseDimension(height, this.height)
    );
  }

  clear() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  scalePixel(value: number): number {
    return value * this.pixelRatio;
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
