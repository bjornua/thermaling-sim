import { BoundedContext } from "../util";

export default class Renderer {
  private staticContent: HTMLCanvasElement;

  private centerX: number;
  private centerY: number;
  private scaleRadius: number;
  private scaleStartAngle = Math.PI / 4;
  private scaleEndAngle = (7 * Math.PI) / 4;
  private scaleDivisions = 10;
  private scaleDivisionAngle: number;
  private divisionLength: number;
  private labelOffset: number;

  constructor(public ctx: BoundedContext) {
    this.divisionLength = this.ctx.scalePixel(10);
    this.labelOffset = this.ctx.scalePixel(20);
    this.centerX = this.ctx.rect.width / 2;
    this.centerY = this.ctx.rect.height / 2;
    this.scaleRadius = Math.min(this.ctx.rect.width, this.ctx.rect.height) / 2;
    this.scaleDivisionAngle =
      (this.scaleEndAngle - this.scaleStartAngle) / this.scaleDivisions;

    this.staticContent = this.renderStaticContents();
  }

  private renderStaticContents(): HTMLCanvasElement {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = this.ctx.rect.width;
    offscreenCanvas.height = this.ctx.rect.height;
    const offscreenCtx = offscreenCanvas.getContext("2d", { alpha: false });
    if (!offscreenCtx) throw new Error("Context doesn't exist");

    offscreenCtx.fillStyle = "#ffffff";
    offscreenCtx.fillRect(0, 0, this.ctx.rect.width, this.ctx.rect.height);
    this.drawScale(offscreenCtx);
    this.drawScaleDivisionsAndLabels(offscreenCtx);

    return offscreenCanvas;
  }

  public render(lift: number): void {
    this.ctx.ctx.drawImage(
      this.staticContent,
      this.ctx.rect.left,
      this.ctx.rect.top,
      this.ctx.rect.width,
      this.ctx.rect.height
    );
    this.drawNeedle(lift);
  }

  private drawScale(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.lineWidth = this.ctx.scalePixel(2);
    ctx.arc(
      this.centerX,
      this.centerY,
      this.scaleRadius - this.ctx.scalePixel(1),
      this.scaleStartAngle,
      this.scaleEndAngle
    );
    ctx.stroke();
  }

  private drawScaleDivisionsAndLabels(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i <= this.scaleDivisions; i++) {
      const angle = this.scaleStartAngle + i * this.scaleDivisionAngle;
      const [x1, y1] = Renderer.pointOnCircle(
        this.centerX,
        this.centerY,
        this.scaleRadius,
        angle
      );
      const [x2, y2] = Renderer.pointOnCircle(
        this.centerX,
        this.centerY,
        this.scaleRadius - this.divisionLength,
        angle
      );

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.lineWidth = this.ctx.scalePixel(2);
      ctx.stroke();

      const label = (i - 5).toString();
      const [labelX, labelY] = Renderer.pointOnCircle(
        this.centerX,
        this.centerY,
        this.scaleRadius - this.labelOffset,
        angle
      );

      ctx.fillStyle = "#000";
      ctx.font = `bold ${this.ctx.scalePixel(12)}px Arial`;
      ctx.fillText(
        label,
        labelX - ctx.measureText(label).width / 2,
        labelY + this.ctx.scalePixel(6)
      );
    }
  }

  private drawNeedle(lift: number) {
    const normalizedLift = (lift + 5) / 10;
    const needleAngle =
      this.scaleStartAngle +
      normalizedLift * (this.scaleEndAngle - this.scaleStartAngle);
    const [needleX, needleY] = Renderer.pointOnCircle(
      this.centerX,
      this.centerY,
      this.scaleRadius - this.divisionLength,
      needleAngle
    );

    this.ctx.ctx.strokeStyle = "#000000";
    this.ctx.ctx.beginPath();
    this.ctx.ctx.moveTo(
      this.ctx.rect.left + this.centerX,
      this.ctx.rect.top + this.centerY
    );
    this.ctx.ctx.lineTo(
      this.ctx.rect.left + needleX,
      this.ctx.rect.top + needleY
    );
    this.ctx.ctx.lineWidth = this.ctx.scalePixel(2);
    this.ctx.ctx.stroke();
  }

  private static pointOnCircle(
    cx: number,
    cy: number,
    r: number,
    angle: number
  ): [number, number] {
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }
}
