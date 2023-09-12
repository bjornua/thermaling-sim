import { Glider } from "../models/Glider";
import { Thermal } from "../models/Thermal";

export default class Renderer {
  private scaleX: number;
  private scaleY: number;
  private scaleFactor: number;
  private gapX: number;
  private gapY: number;

  private lastRenderedThermal: Thermal | null = null;
  private thermalCanvas: HTMLCanvasElement;
  private thermalCtx: CanvasRenderingContext2D;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public worldX: number,
    public worldY: number,
    public worldWidth: number,
    public worldHeight: number
  ) {
    this.scaleX = this.width / this.worldWidth;
    this.scaleY = this.height / this.worldHeight;
    this.scaleFactor = Math.min(this.scaleX, this.scaleY);
    this.gapX = this.width - this.worldWidth * this.scaleFactor;
    this.gapY = this.height - this.worldHeight * this.scaleFactor;

    this.thermalCanvas = document.createElement("canvas");
    this.thermalCanvas.width = this.width;
    this.thermalCanvas.height = this.height;
    const thermalCtx = this.thermalCanvas.getContext("2d");
    if (thermalCtx === null) {
      throw new Error("Context doesn't exist");
    }
    this.thermalCtx = thermalCtx;
  }

  private toCanvasX(wx: number): number {
    return this.worldToCanvas(wx, this.worldX);
  }

  private toCanvasY(wy: number): number {
    return this.worldToCanvas(wy, this.worldY);
  }

  public render(thermal: Thermal, glider: Glider): void {
    if (this.lastRenderedThermal !== thermal) {
      this.drawThermal(thermal);
      this.lastRenderedThermal = thermal;
    }
    // Copy the cached thermal drawing onto the main canvas
    this.ctx.drawImage(
      this.thermalCanvas,
      this.x + this.gapX / 2,
      this.y + this.gapY / 2
    );
    this.drawGlider(glider);
  }

  private worldToCanvas(worldCoord: number, worldStart: number): number {
    return (worldCoord - worldStart) * this.scaleFactor;
  }

  private drawGlider(glider: Glider): void {
    const pixelX = this.toCanvasX(glider.x) + this.x + this.gapX / 2;
    const pixelY = this.toCanvasY(glider.y) + this.y + this.gapY / 2;

    // Draw the glider itself
    this.ctx.fillStyle = glider.color;
    this.ctx.beginPath();
    this.ctx.arc(pixelX, pixelY, 10, 0, 2 * Math.PI);
    this.ctx.fill();

    // Draw the bank angle
    this.ctx.fillStyle = "#000";
    this.ctx.font = `${12 * window.devicePixelRatio}px Arial`;
    this.ctx.fillText(
      `Bank: ${glider.bankAngle.toFixed(0)}°`,
      pixelX + 15 * window.devicePixelRatio,
      pixelY - 6 * window.devicePixelRatio
    );

    // Draw the lift value
    this.ctx.fillText(
      `Lift: ${glider.lift.toFixed(2)} m/s`,
      pixelX + 15 * window.devicePixelRatio,
      pixelY + 6 * window.devicePixelRatio
    );

    // Draw the height
    this.ctx.fillText(
      `Height: ${glider.height.toFixed(0)}m`,
      pixelX + 15 * window.devicePixelRatio,
      pixelY + 18 * window.devicePixelRatio
    );

    // Draw trace
    for (let i = 1; i < glider.trace.length; i++) {
      const prevPoint = glider.trace[i - 1];
      const point = glider.trace[i];

      const prevPixelX = this.toCanvasX(prevPoint.x) + this.x + this.gapX / 2;
      const prevPixelY = this.toCanvasY(prevPoint.y) + this.y + this.gapY / 2;

      const pointPixelX = this.toCanvasX(point.x) + this.x + this.gapX / 2;
      const pointPixelY = this.toCanvasY(point.y) + this.y + this.gapY / 2;

      const strokeWeight = this.getStrokeWeight(point.bankAngle);

      this.ctx.beginPath();
      this.ctx.moveTo(prevPixelX, prevPixelY);
      this.ctx.lineTo(pointPixelX, pointPixelY);
      this.ctx.lineWidth = strokeWeight;
      this.ctx.strokeStyle = glider.color;
      this.ctx.stroke();
    }
  }

  private getStrokeWeight(bankAngle: number): number {
    const minStrokeWidth = 4 * window.devicePixelRatio;
    const maxStrokeWidth = 1 * window.devicePixelRatio;
    const minBankAngle = 35;
    const maxBankAngle = 60;

    const clippedBankAngle = Math.min(
      Math.max(bankAngle, minBankAngle),
      maxBankAngle
    );

    const weight =
      (clippedBankAngle - minBankAngle) / (maxBankAngle - minBankAngle);
    return minStrokeWidth + (maxStrokeWidth - minStrokeWidth) * weight;
  }

  private drawThermal(thermal: Thermal): void {
    const centerX = this.toCanvasX(thermal.x);
    const centerY = this.toCanvasY(thermal.y);

    // Clear the offscreen canvas before redrawing
    this.thermalCtx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i <= 4; i++) {
      const lift = (i / 5) * thermal.maxLift;
      const worldRadius = thermal.calculateDistanceToCenterFromLift(lift);
      const canvasRadius = worldRadius * this.scaleFactor;

      this.thermalCtx.strokeStyle = "#f00";
      this.thermalCtx.lineWidth = window.devicePixelRatio * 1;
      this.thermalCtx.beginPath();
      this.thermalCtx.arc(centerX, centerY, canvasRadius, 0, 2 * Math.PI);
      this.thermalCtx.stroke();
    }
  }
}
