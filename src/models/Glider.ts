import { GliderController } from "./GliderController";

export type BankingStrategy = (
  liftChange: number,
  elapsedTime: number
) => boolean;

export class Glider {
  public angle = 0; // Current angle in radians
  public bankAngle = 45; // Bank angle in degrees
  private speed = (90 * 1000) / 3600; // 90 km/h in m/s
  private readonly G = 9.81; // Acceleration due to gravity in m/s^2
  public lift = 0;
  public height = 500;

  constructor(
    public x: number,
    public y: number,
    public color: string,
    public controller: GliderController
  ) {}

  update(lift: number, elapsedTime: number): void {
    this.height += elapsedTime * lift;
    this.bankAngle = this.controller.decideIsBanking(lift, elapsedTime)
      ? 60
      : 40;
    this.lift = lift;
    this.updatePosition(elapsedTime);
  }

  private updatePosition(elapsedTime: number): void {
    const angularSpeed =
      (this.G / this.speed) * Math.tan((this.bankAngle * Math.PI) / 180); // Convert bank angle to radians
    const angularDistance = angularSpeed * elapsedTime;

    this.angle += angularDistance;

    const distance = this.speed * elapsedTime;
    this.x += distance * Math.cos(this.angle);
    this.y += distance * Math.sin(this.angle);
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
    ctx.font = `${12}px Arial`;
    ctx.fillText(
      `State: ${this.controller.stateText()}`,
      pixelX + 15,
      pixelY - 5
    );

    // Draw the lift value
    // Assuming `this.lift` exists and is updated by the `update()` method
    ctx.fillText(`Lift: ${this.lift.toFixed(2)} m/s`, pixelX + 15, pixelY + 10);

    // Draw the lift value
    // Assuming `this.lift` exists and is updated by the `update()` method
    ctx.fillText(
      `Height: ${this.height.toFixed(0)}m`,
      pixelX + 15,
      pixelY + 25
    );
  }
}
