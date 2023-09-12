export default class Renderer {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private staticContent: HTMLCanvasElement;

  private centerX: number;
  private centerY: number;
  private scaleRadius: number;
  private scaleStartAngle = Math.PI / 4;
  private scaleEndAngle = (7 * Math.PI) / 4;
  private scaleDivisions = 10;
  private divisionLength = 10 * window.devicePixelRatio;
  private labelOffset = 20 * window.devicePixelRatio;
  private scaleDivisionAngle: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.centerX = width / 2;
    this.centerY = height / 2;
    this.scaleRadius = Math.min(width, height) / 2;
    this.scaleDivisionAngle =
      (this.scaleEndAngle - this.scaleStartAngle) / this.scaleDivisions;

    this.staticContent = this.renderStaticContents();
  }

  private renderStaticContents(): HTMLCanvasElement {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = this.width;
    offscreenCanvas.height = this.height;
    const offscreenCtx = offscreenCanvas.getContext("2d", { alpha: false });
    if (!offscreenCtx) throw new Error("Context doesn't exist");

    offscreenCtx.fillStyle = "#ffffff";
    offscreenCtx.fillRect(0, 0, this.width, this.height);
    this.drawScale(offscreenCtx);
    this.drawScaleDivisionsAndLabels(offscreenCtx);

    return offscreenCanvas;
  }

  public render(lift: number): void {
    this.ctx.drawImage(
      this.staticContent,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.drawNeedle(lift);
  }

  private drawScale(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.lineWidth = window.devicePixelRatio * 2;
    ctx.arc(
      this.centerX,
      this.centerY,
      this.scaleRadius - window.devicePixelRatio,
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

      ctx.lineWidth = window.devicePixelRatio * 2;
      ctx.stroke();

      const label = (i - 5).toString();
      const [labelX, labelY] = Renderer.pointOnCircle(
        this.centerX,
        this.centerY,
        this.scaleRadius - this.labelOffset,
        angle
      );

      ctx.fillStyle = "#000";
      ctx.font = `bold ${12 * window.devicePixelRatio}px Arial`;
      ctx.fillText(
        label,
        labelX - ctx.measureText(label).width / 2,
        labelY + 6 * window.devicePixelRatio
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

    this.ctx.strokeStyle = "#000000";
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + this.centerX, this.y + this.centerY);
    this.ctx.lineTo(this.x + needleX, this.y + needleY);
    this.ctx.lineWidth = window.devicePixelRatio * 2;
    this.ctx.stroke();
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
