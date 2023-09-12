// Constants
const SKY_COLOR = "#54899e";
const GROUND_COLOR = "#69330e";
const HORIZON = "#EEEEEE";
const BLACK = "black";
const YELLOW = "#FFFF00";

class AttitudeIndicator {
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private staticContents: HTMLCanvasElement;
  private circularMask: HTMLCanvasElement;
  private diameter: number;
  private radius: number;
  private centerX: number;
  private centerY: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    this.diameter = Math.min(this.width, this.height);
    this.radius = Math.floor(this.diameter / 2);
    this.centerX = Math.floor((this.width - this.diameter) / 2 + this.radius);
    this.centerY = Math.floor((this.height - this.diameter) / 2 + this.radius);

    // Initialize the offscreen canvas with a circular clip
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;

    const offscreenCtx = this.offscreenCanvas.getContext("2d", {
      alpha: false,
    });
    if (!offscreenCtx) {
      throw new Error("Context doesn't exist");
    }
    this.offscreenCtx = offscreenCtx;

    // Initialize static contents
    this.staticContents = this.drawStaticContents();
    this.circularMask = this.generateCircularMask();
  }

  generateCircularMask(): HTMLCanvasElement {
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = this.width;
    maskCanvas.height = this.height;

    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) throw new Error("Context doesn't exist");

    // Fill the entire canvas with white
    maskCtx.fillStyle = "#FFFFFF";
    maskCtx.fillRect(0, 0, this.width, this.height);

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
    this.ctx.drawImage(
      this.offscreenCanvas,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.ctx.drawImage(
      this.staticContents,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.ctx.drawImage(
      this.circularMask,
      this.x,
      this.y,
      this.width,
      this.height
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
    ctx.arc(centerX, centerY, radius - window.devicePixelRatio, 0, 2 * Math.PI);
    ctx.lineWidth = 2 * window.devicePixelRatio;
    ctx.stroke();
  }

  private drawStaticContents(): HTMLCanvasElement {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = this.width;
    offscreenCanvas.height = this.height;

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
    this.offscreenCtx.save();
    this.offscreenCtx.translate(this.centerX, this.centerY);
    this.offscreenCtx.rotate(-bankAngle * (Math.PI / 180));

    // Draw sky and ground
    this.offscreenCtx.fillStyle = SKY_COLOR;
    this.offscreenCtx.fillRect(
      -this.radius,
      -this.radius,
      2 * this.radius,
      this.radius
    );
    this.offscreenCtx.fillStyle = GROUND_COLOR;
    this.offscreenCtx.fillRect(-this.radius, 0, 2 * this.radius, this.radius);

    this.drawBankMarkers(this.offscreenCtx, this.radius);

    // Draw horizon line
    this.offscreenCtx.strokeStyle = HORIZON;
    this.offscreenCtx.beginPath();
    this.offscreenCtx.moveTo(-this.radius, 0);
    this.offscreenCtx.lineTo(this.radius, 0);
    this.offscreenCtx.lineWidth = 2 * window.devicePixelRatio;
    this.offscreenCtx.stroke();

    this.offscreenCtx.restore();
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
      ctx.lineWidth = lineWidth * window.devicePixelRatio;
      ctx.stroke();
    };

    drawMarker(0, radius * 0.1, 1 * devicePixelRatio);
    for (const angle of [0, 10, 20, 30, 45, 60]) {
      drawMarker(angle, radius * 0.1, 1 * devicePixelRatio);
      drawMarker(-angle, radius * 0.1, 1 * devicePixelRatio);
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
    ctx.lineWidth = 3 * window.devicePixelRatio;

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
