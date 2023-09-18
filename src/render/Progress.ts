import { BoundedContext } from "./util";

export default class ProgressRenderer {
  constructor(public ctx: BoundedContext) {}

  public render(ratio: number): void {
    // Calculate progress width based on the ratio
    const progressWidth = ratio * this.ctx.rect.width;

    // Draw the progress line
    this.ctx.ctx.fillStyle = "#AAAAAA";
    this.ctx.ctx.fillRect(
      this.ctx.rect.left,
      this.ctx.rect.top,
      progressWidth,
      this.ctx.rect.height
    );
  }
}
