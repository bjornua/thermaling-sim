import { Glider } from "../models/Glider";
import { Thermal } from "../models/Thermal";
import { BoundedContext, Rectangle } from "./util";

export default class Renderer {
  private scaleX: number;
  private scaleY: number;
  private scaleFactor: number;
  private gapX: number;
  private gapY: number;

  private lastRenderedThermal: Thermal | null = null;
  private thermalCanvas: HTMLCanvasElement;
  private thermalCtx: CanvasRenderingContext2D;

  constructor(public ctx: BoundedContext, public worldRect: Rectangle) {
    this.scaleX = this.ctx.rect.width / this.worldRect.width;
    this.scaleY = this.ctx.rect.height / this.worldRect.height;
    this.scaleFactor = Math.min(this.scaleX, this.scaleY);
    this.gapX = this.ctx.rect.width - this.worldRect.width * this.scaleFactor;
    this.gapY = this.ctx.rect.height - this.worldRect.height * this.scaleFactor;

    this.thermalCanvas = document.createElement("canvas");
    this.thermalCanvas.width = this.ctx.rect.width;
    this.thermalCanvas.height = this.ctx.rect.height;
    const thermalCtx = this.thermalCanvas.getContext("2d");
    if (thermalCtx === null) {
      throw new Error("Context doesn't exist");
    }
    this.thermalCtx = thermalCtx;
  }

  private toCanvasX(wx: number): number {
    return this.worldToCanvas(wx, this.worldRect.left);
  }

  private toCanvasY(wy: number): number {
    return this.worldToCanvas(wy, this.worldRect.top);
  }

  public render(thermal: Thermal, glider: Glider): void {
    if (this.lastRenderedThermal !== thermal) {
      this.drawThermal(thermal);
      this.lastRenderedThermal = thermal;
    }
    // Copy the cached thermal drawing onto the main canvas
    this.ctx.ctx.drawImage(
      this.thermalCanvas,
      this.ctx.rect.left,
      this.ctx.rect.top
    );
    this.drawGlider(glider);
  }

  private worldToCanvas(worldCoord: number, worldStart: number): number {
    return (worldCoord - worldStart) * this.scaleFactor;
  }

  private drawGlider(glider: Glider): void {
    const pixelX = this.toCanvasX(glider.x) + this.ctx.rect.top + this.gapX / 2;
    const pixelY =
      this.toCanvasY(glider.y) + this.ctx.rect.left + this.gapY / 2;
    console.log({ rectLeft: this.ctx.rect.left, pixelX, pixelY });

    // Draw the glider itself
    this.ctx.ctx.fillStyle = glider.color;
    this.ctx.ctx.beginPath();
    this.ctx.ctx.arc(pixelX, pixelY, 10, 0, 2 * Math.PI);
    this.ctx.ctx.fill();

    // Draw the bank angle
    this.ctx.ctx.fillStyle = "#000";
    this.ctx.ctx.font = `${this.ctx.scalePixel(12)}px Arial`;
    this.ctx.ctx.fillText(
      `Bank: ${glider.bankAngle.toFixed(0)}°`,
      pixelX + this.ctx.scalePixel(15),
      pixelY - this.ctx.scalePixel(6)
    );

    // Draw the lift value
    this.ctx.ctx.fillText(
      `Lift: ${glider.variometer.getLiftValueWithDelay().toFixed(2)} m/s`,
      pixelX + this.ctx.scalePixel(15),
      pixelY + this.ctx.scalePixel(6)
    );

    // Draw the height
    this.ctx.ctx.fillText(
      `Height: ${glider.height.toFixed(0)}m`,
      pixelX + this.ctx.scalePixel(15),
      pixelY + this.ctx.scalePixel(18)
    );

    // Draw trace
    for (let i = 1; i < glider.trace.length; i++) {
      const prevPoint = glider.trace[i - 1];
      const point = glider.trace[i];

      const prevPixelX =
        this.toCanvasX(prevPoint.x) + this.ctx.rect.left + this.gapX / 2;
      const prevPixelY =
        this.toCanvasY(prevPoint.y) + this.ctx.rect.top + this.gapY / 2;

      const pointPixelX =
        this.toCanvasX(point.x) + this.ctx.rect.left + this.gapX / 2;
      const pointPixelY =
        this.toCanvasY(point.y) + this.ctx.rect.top + this.gapY / 2;

      const strokeWeight = this.getStrokeWeight(point.bankAngle);

      this.ctx.ctx.beginPath();
      this.ctx.ctx.moveTo(prevPixelX, prevPixelY);
      this.ctx.ctx.lineTo(pointPixelX, pointPixelY);
      this.ctx.ctx.lineWidth = strokeWeight;
      this.ctx.ctx.strokeStyle = glider.color;
      this.ctx.ctx.stroke();
    }
  }

  private getStrokeWeight(bankAngle: number): number {
    const minStrokeWidth = this.ctx.scalePixel(4);
    const maxStrokeWidth = this.ctx.scalePixel(1);
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
    this.thermalCtx.clearRect(0, 0, this.ctx.rect.width, this.ctx.rect.height);

    for (let i = 0; i <= 4; i++) {
      const lift = (i / 5) * thermal.maxLift;
      const worldRadius = thermal.calculateDistanceToCenterFromLift(lift);
      const canvasRadius = worldRadius * this.scaleFactor;

      this.thermalCtx.strokeStyle = "#f00";
      this.thermalCtx.lineWidth = this.ctx.scalePixel(1);
      this.thermalCtx.beginPath();
      this.thermalCtx.arc(centerX, centerY, canvasRadius, 0, 2 * Math.PI);
      this.thermalCtx.stroke();
    }
  }
}
