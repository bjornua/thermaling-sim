import { GliderController } from "./GliderController";

export type BankingStrategy = (
  liftChange: number,
  elapsedTime: number
) => boolean;

export class Glider {
  public angle = 0; // Current angle in radians
  public speed = 90; // 90 km/h in m/s
  private readonly G = 9.81; // Acceleration due to gravity in m/s^2
  public lift = 0;
  public height = 500;
  public bankAngle = 0; // Bank angle in degrees
  public targetBankAngle = 0; // Target bank angle in degrees
  public maxBankRate = 10; // Maximum rate of bank angle change in degrees per second
  public trace: { x: number; y: number; bankAngle: number; time: number }[] =
    [];
  private traceDuration = 10;
  private totalElapsedTime = 0; // Total elapsed time for trace

  constructor(
    public x: number,
    public y: number,
    public color: string,
    public controller: GliderController
  ) {}

  update(lift: number, elapsedTime: number): void {
    this.height += elapsedTime * lift;
    this.targetBankAngle = this.controller.update(lift, elapsedTime);
    this.updateBankAngle(elapsedTime);
    this.lift = lift;
    this.updatePosition(elapsedTime);

    // Update total elapsed time
    this.totalElapsedTime += elapsedTime;

    // Add the new trace point
    this.trace.push({
      x: this.x,
      y: this.y,
      bankAngle: this.bankAngle,
      time: this.totalElapsedTime,
    });

    // Remove the outdated trace points
    const minTime = this.totalElapsedTime - this.traceDuration;
    while (this.trace.length > 0 && this.trace[0].time < minTime) {
      this.trace.shift();
    }
  }

  private updatePosition(elapsedTime: number): void {
    const speedMetersPerSecond = (this.speed * 1000) / 3600;
    const angularSpeed =
      (this.G / speedMetersPerSecond) *
      Math.tan((this.bankAngle * Math.PI) / 180); // Convert bank angle to radians
    const angularDistance = angularSpeed * elapsedTime;

    this.angle += angularDistance;

    const distance = speedMetersPerSecond * elapsedTime;
    this.x += distance * Math.cos(this.angle);
    this.y += distance * Math.sin(this.angle);
  }

  private updateBankAngle(elapsedTime: number): void {
    const maxBankDelta = this.maxBankRate * elapsedTime;
    let bankDelta = this.targetBankAngle - this.bankAngle;

    // Clip the bankDelta to the rate limit
    if (Math.abs(bankDelta) > maxBankDelta) {
      bankDelta = Math.sign(bankDelta) * maxBankDelta;
    }

    this.bankAngle += bankDelta;
  }

  draw(ctx: CanvasRenderingContext2D, scaleFactor: number): void {
    const pixelX = this.x * scaleFactor;
    const pixelY = this.y * scaleFactor;

    // Draw the glider itself
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 10 * scaleFactor, 0, 2 * Math.PI);
    ctx.fill();

    // Draw the bank angle
    ctx.fillStyle = "#000";
    ctx.font = `12px Arial`;
    ctx.fillText(
      `Bank: ${this.bankAngle.toFixed(0)}°`,
      pixelX + 15,
      pixelY - 6
    );

    // Draw the lift value
    // Assuming `this.lift` exists and is updated by the `update()` method
    ctx.fillText(`Lift: ${this.lift.toFixed(2)} m/s`, pixelX + 15, pixelY + 6);

    // Draw the lift value
    // Assuming `this.lift` exists and is updated by the `update()` method
    ctx.fillText(
      `Height: ${this.height.toFixed(0)}m`,
      pixelX + 15,
      pixelY + 18
    );

    // Draw trace
    for (let i = 1; i < this.trace.length; i++) {
      const prevPoint = this.trace[i - 1];
      const point = this.trace[i];

      const prevPixelX = prevPoint.x * scaleFactor;
      const prevPixelY = prevPoint.y * scaleFactor;

      const pixelX = point.x * scaleFactor;
      const pixelY = point.y * scaleFactor;

      const strokeWeight = this.getStrokeWeight(point.bankAngle);

      ctx.beginPath();
      ctx.moveTo(prevPixelX, prevPixelY);
      ctx.lineTo(pixelX, pixelY);
      ctx.lineWidth = strokeWeight;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
  }

  private getStrokeWeight(bankAngle: number): number {
    const minStrokeWidth = 3;
    const maxStrokeWidth = 0.1;
    const minBankAngle = 35; // Minimum bank angle for interpolation
    const maxBankAngle = 60; // Maximum bank angle for interpolation

    // Clip the bank angle to the [minBankAngle, maxBankAngle] range
    const clippedBankAngle = Math.min(
      Math.max(bankAngle, minBankAngle),
      maxBankAngle
    );

    // Linearly interpolate between minStrokeWidth and maxStrokeWidth based on bank angle
    const weight =
      (clippedBankAngle - minBankAngle) / (maxBankAngle - minBankAngle);
    return minStrokeWidth + (maxStrokeWidth - minStrokeWidth) * weight;
  }
}
