import { BoundedContext, OffscreenBoundedContext } from "./util";

// Constants
const SKY_COLOR = "#54899e";
const GROUND_COLOR = "#69330e";
const HORIZON = "#EEEEEE";
const BLACK = "black";
const YELLOW = "#FFFF00";

class AttitudeIndicator {
  private offscreenCtx: OffscreenBoundedContext;

  private staticContents: HTMLCanvasElement;
  private circularMask: HTMLCanvasElement;
  private diameter: number;
  private radius: number;
  private centerX: number;
  private centerY: number;

  constructor(public ctx: BoundedContext) {
    this.diameter = Math.min(this.ctx.rect.width, this.ctx.rect.height);
    this.radius = Math.floor(this.diameter / 2);
    this.centerX = Math.floor(
      (this.ctx.rect.width - this.diameter) / 2 + this.radius
    );
    this.centerY = Math.floor(
      (this.ctx.rect.height - this.diameter) / 2 + this.radius
    );

    this.offscreenCtx = ctx.createOffScreenCanvas();

    // Initialize static contents
    this.staticContents = this.drawStaticContents();
    this.circularMask = this.generateCircularMask();
  }

  generateCircularMask(): HTMLCanvasElement {
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = this.ctx.rect.width;
    maskCanvas.height = this.ctx.rect.height;

    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) throw new Error("Context doesn't exist");

    // Fill the entire canvas with white
    maskCtx.fillStyle = "#FFFFFF";
    maskCtx.fillRect(0, 0, this.ctx.rect.width, this.ctx.rect.height);

    // Clear the circular area, making it transparent
    maskCtx.globalCompositeOperation = "destination-out";
    maskCtx.beginPath();
    maskCtx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    maskCtx.fill();

    // Reset composite operation
    maskCtx.globalCompositeOperation = "source-over";

    return maskCanvas;
  }

  public render(bankAngle: number) {
    this.drawDynamicContents(bankAngle);
    this.offscreenCtx.drawToParent();
    this.ctx.ctx.drawImage(
      this.staticContents,
      this.ctx.rect.left,
      this.ctx.rect.top,
      this.ctx.rect.width,
      this.ctx.rect.height
    );
    this.ctx.ctx.drawImage(
      this.circularMask,
      this.ctx.rect.left,
      this.ctx.rect.top,
      this.ctx.rect.width,
      this.ctx.rect.height
    );
  }

  private drawOuterCircle(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.strokeStyle = BLACK;
    ctx.arc(centerX, centerY, radius - this.ctx.scalePixel(1), 0, 2 * Math.PI);
    ctx.lineWidth = 2 * this.ctx.scalePixel(1);
    ctx.stroke();
  }

  private drawStaticContents(): HTMLCanvasElement {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = this.ctx.rect.width;
    offscreenCanvas.height = this.ctx.rect.height;

    const offscreenCtx = offscreenCanvas.getContext("2d", { alpha: true });
    if (!offscreenCtx) {
      throw new Error("Context doesn't exist");
    }

    this.drawOuterCircle(offscreenCtx, this.centerX, this.centerY, this.radius);

    this.drawTrianglePointer(offscreenCtx, this.centerX, this.radius * 0.1);
    this.drawAircraftSymbol(
      offscreenCtx,
      this.centerX,
      this.centerY,
      this.radius * 0.3
    );

    return offscreenCanvas;
  }

  private drawDynamicContents(bankAngle: number) {
    this.offscreenCtx.ctx.save();
    this.offscreenCtx.ctx.translate(this.centerX, this.centerY);
    this.offscreenCtx.ctx.rotate(-bankAngle * (Math.PI / 180));

    // Draw sky and ground
    this.offscreenCtx.ctx.fillStyle = SKY_COLOR;
    this.offscreenCtx.ctx.fillRect(
      -this.radius,
      -this.radius,
      2 * this.radius,
      this.radius
    );
    this.offscreenCtx.ctx.fillStyle = GROUND_COLOR;
    this.offscreenCtx.ctx.fillRect(
      -this.radius,
      0,
      2 * this.radius,
      this.radius
    );

    this.drawBankMarkers(this.offscreenCtx.ctx, this.radius);

    // Draw horizon line
    this.offscreenCtx.ctx.strokeStyle = HORIZON;
    this.offscreenCtx.ctx.beginPath();
    this.offscreenCtx.ctx.moveTo(-this.radius, 0);
    this.offscreenCtx.ctx.lineTo(this.radius, 0);
    this.offscreenCtx.ctx.lineWidth = this.ctx.scalePixel(2);
    this.offscreenCtx.ctx.stroke();

    this.offscreenCtx.ctx.restore();
  }

  private drawBankMarkers(ctx: CanvasRenderingContext2D, radius: number) {
    const drawMarker = (angle: number, length: number, lineWidth: number) => {
      const angleInRadians = (Math.PI / 180) * (angle - 90);
      const x1 = radius * Math.cos(angleInRadians);
      const y1 = radius * Math.sin(angleInRadians);
      const x2 = (radius - length) * Math.cos(angleInRadians);
      const y2 = (radius - length) * Math.sin(angleInRadians);

      ctx.strokeStyle = HORIZON;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = lineWidth * this.ctx.scalePixel(1);
      ctx.stroke();
    };

    drawMarker(0, radius * 0.1, this.ctx.scalePixel(1));
    for (const angle of [0, 10, 20, 30, 45, 60]) {
      drawMarker(angle, radius * 0.1, this.ctx.scalePixel(1));
      drawMarker(-angle, radius * 0.1, this.ctx.scalePixel(1));
    }
  }

  private drawTrianglePointer(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    triangleSize: number
  ) {
    const halfSize = triangleSize / 2;
    ctx.strokeStyle = YELLOW;
    ctx.beginPath();
    ctx.moveTo(centerX, centerX * 0.1); // top point
    ctx.lineTo(centerX - halfSize, centerX * 0.1 + 2 * halfSize); // bottom left
    ctx.lineTo(centerX + halfSize, centerX * 0.1 + 2 * halfSize); // bottom right
    ctx.closePath();
    ctx.stroke();
  }

  private drawAircraftSymbol(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number
  ) {
    const halfWingLength = size * 0.75;

    ctx.strokeStyle = YELLOW; // You can adjust the color if necessary.
    ctx.lineWidth = this.ctx.scalePixel(3);

    // Draw aircraft body (vertical line)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.5);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Draw aircraft wings (horizontal line)
    ctx.beginPath();
    ctx.moveTo(centerX - halfWingLength, centerY);
    ctx.lineTo(centerX + halfWingLength, centerY);
    ctx.stroke();
  }
}

export default AttitudeIndicator;
