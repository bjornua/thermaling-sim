import { BoundedContext, OffscreenBoundedContext } from "../util";

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
  public ctx: BoundedContext;

  constructor(fullCtx: BoundedContext) {
    this.diameter = Math.min(fullCtx.rect.width, fullCtx.rect.height);
    this.ctx = fullCtx.getSubContext({
      top: (fullCtx.rect.height - this.diameter) / 2,
      left: (fullCtx.rect.width - this.diameter) / 2,
      width: this.diameter,
      height: this.diameter,
    });

    this.diameter = Math.min(this.ctx.rect.width, this.ctx.rect.height);
    this.radius = Math.floor(this.diameter / 2);

    this.offscreenCtx = this.ctx.createOffScreenCanvas();

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
    maskCtx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
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

  private drawOuterCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = BLACK;
    ctx.arc(
      this.radius,
      this.radius,
      this.radius - this.ctx.scalePixel(1),
      0,
      2 * Math.PI
    );
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

    this.drawOuterCircle(offscreenCtx);

    this.drawTrianglePointer(offscreenCtx);
    this.drawAircraftSymbol(offscreenCtx, this.radius * 0.3);

    return offscreenCanvas;
  }

  private drawDynamicContents(bankAngle: number) {
    this.offscreenCtx.ctx.save();
    this.offscreenCtx.ctx.translate(this.radius, this.radius);
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

    this.drawBankMarkers(this.offscreenCtx.ctx);

    // Draw horizon line
    this.offscreenCtx.ctx.strokeStyle = HORIZON;
    this.offscreenCtx.ctx.beginPath();
    this.offscreenCtx.ctx.moveTo(-this.radius, 0);
    this.offscreenCtx.ctx.lineTo(this.radius, 0);
    this.offscreenCtx.ctx.lineWidth = this.ctx.scalePixel(2);
    this.offscreenCtx.ctx.stroke();

    this.offscreenCtx.ctx.restore();
  }

  private drawBankMarkers(ctx: CanvasRenderingContext2D) {
    const drawMarker = (angle: number, length: number, lineWidth: number) => {
      const angleInRadians = (Math.PI / 180) * (angle - 90);
      const x1 = this.radius * Math.cos(angleInRadians);
      const y1 = this.radius * Math.sin(angleInRadians);
      const x2 = (this.radius - length) * Math.cos(angleInRadians);
      const y2 = (this.radius - length) * Math.sin(angleInRadians);

      ctx.strokeStyle = HORIZON;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = lineWidth * this.ctx.scalePixel(1);
      ctx.stroke();
    };

    drawMarker(0, this.radius * 0.1, this.ctx.scalePixel(1));
    for (const angle of [0, 10, 20, 30, 45, 60]) {
      drawMarker(angle, this.radius * 0.1, this.ctx.scalePixel(1));
      drawMarker(-angle, this.radius * 0.1, this.ctx.scalePixel(1));
    }
  }

  private drawTrianglePointer(ctx: CanvasRenderingContext2D) {
    const triangleSize = this.radius * 0.1;
    const halfSize = triangleSize / 2;
    ctx.strokeStyle = YELLOW;
    ctx.beginPath();
    ctx.moveTo(this.radius, this.radius * 0.1); // top point
    ctx.lineTo(this.radius - halfSize, this.radius * 0.1 + 2 * halfSize); // bottom left
    ctx.lineTo(this.radius + halfSize, this.radius * 0.1 + 2 * halfSize); // bottom right
    ctx.closePath();
    ctx.stroke();
  }

  private drawAircraftSymbol(ctx: CanvasRenderingContext2D, size: number) {
    const halfWingLength = size * 0.75;

    ctx.strokeStyle = YELLOW; // You can adjust the color if necessary.
    ctx.lineWidth = this.ctx.scalePixel(3);

    // Draw aircraft body (vertical line)
    ctx.beginPath();
    ctx.moveTo(this.radius, this.radius - size * 0.5);
    ctx.lineTo(this.radius, this.radius);
    ctx.stroke();

    // Draw aircraft wings (horizontal line)
    ctx.beginPath();
    ctx.moveTo(this.radius - halfWingLength, this.radius);
    ctx.lineTo(this.radius + halfWingLength, this.radius);
    ctx.stroke();
  }
}

export default AttitudeIndicator;
