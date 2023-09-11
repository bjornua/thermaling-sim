import { GliderController } from "./GliderController";

export type BankingStrategy = (
  liftChange: number,
  elapsedTime: number
) => boolean;

export class Glider {
  public headingAngle = 0; // Current angle in radians
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
  public x: number;
  public y: number;
  constructor(
    public startX: number,
    public startY: number,
    public color: string,
    public controller: GliderController
  ) {
    this.x = this.startX;
    this.y = this.startY;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.bankAngle = 0;
    this.controller.reset();
    this.targetBankAngle = 0;
    this.height = 500;
    this.trace = [];
    this.totalElapsedTime = 0;
    this.lift = 0;
    this.headingAngle = 0;
  }

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

    this.headingAngle += angularDistance;

    const distance = speedMetersPerSecond * elapsedTime;
    this.x += distance * Math.cos(this.headingAngle);
    this.y += distance * Math.sin(this.headingAngle);
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
}
