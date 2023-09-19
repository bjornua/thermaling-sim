import { GliderController } from "./GliderController";
import Variometer from "../models/Variometer";

export type BankingStrategy = (
  liftChange: number,
  elapsedTime: number
) => boolean;

export class Glider {
  public readonly speed = 90; // 90 km/h in m/s
  public readonly G = 9.81; // Acceleration due to gravity in m/s^2
  public readonly maxBankRate = 10; // Maximum rate of bank angle change in degrees per second
  public headingAngle = 0; // Current angle in radians
  public height = 500;
  public bankAngle = 0; // Bank angle in degrees
  public targetBankAngle = 0; // Target bank angle in degrees
  public trace: { x: number; y: number; bankAngle: number }[] = [];
  public x: number;
  public y: number;
  public totalElapsedTime = 0; // Total elapsed time for trace
  public lastTraceUpdateTime = 0;
  public variometer: Variometer;

  constructor(
    public startX: number,
    public startY: number,
    public color: string,
    variolag = 0,
    public controller: GliderController
  ) {
    this.x = this.startX;
    this.y = this.startY;

    this.variometer = new Variometer(variolag);
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
    this.headingAngle = 0;
    this.lastTraceUpdateTime = 0;
    this.variometer.reset();
  }

  update(lift: number, elapsedTime: number): void {
    this.height += elapsedTime * lift;
    // Update the variometer with current lift value and timestamp
    this.variometer.addLiftValue(lift, elapsedTime);
    this.targetBankAngle = this.controller.update(this, elapsedTime);
    this.updateBankAngle(elapsedTime);
    this.updatePosition(elapsedTime);

    // Update total elapsed time
    this.totalElapsedTime += elapsedTime;

    // Check if it's time to add a new trace point
    if (this.totalElapsedTime - this.lastTraceUpdateTime >= 0.2) {
      this.trace.push({
        x: this.x,
        y: this.y,
        bankAngle: this.bankAngle,
      });
      this.lastTraceUpdateTime = this.totalElapsedTime; // <-- Update the last trace update time
    }

    // Remove the outdated trace points
    while (this.trace.length > 500) {
      this.trace.shift();
    }
  }

  getTurnRate(bankAngle: number): number {
    // Calculate turn rate in radians per second
    const speedMetersPerSecond = (this.speed * 1000) / 3600;
    const angularSpeed =
      (this.G / speedMetersPerSecond) * Math.tan((bankAngle * Math.PI) / 180);

    // Convert turn rate to degrees per second
    const turnRateDegreesPerSecond = angularSpeed * (180 / Math.PI);

    return turnRateDegreesPerSecond;
  }

  private updatePosition(elapsedTime: number): void {
    const speedMetersPerSecond = (this.speed * 1000) / 3600;
    const turnRateDegreesPerSecond = this.getTurnRate(this.bankAngle);

    // Convert the turn rate back to radians per second for angularSpeed
    const angularSpeed = turnRateDegreesPerSecond * (Math.PI / 180);

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
