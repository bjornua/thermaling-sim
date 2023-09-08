import { Glider } from "./Glider";
import { Thermal } from "./Thermal";

export class World {
  private scaleFactor: number; // Meters per pixel
  public timeAcceleration: number;

  constructor(
    public width: number,
    public height: number,
    public thermal: Thermal,
    public glider: Glider
  ) {
    this.scaleFactor = 0.6; // Initialize with a suitable value; say 1 meter per pixel
    this.timeAcceleration = 1;
  }

  // Utility function to scale real-world coordinates to pixel coordinates
  public scaleToPixel(value: number): number {
    return value * this.scaleFactor;
  }

  // Utility function to scale pixel coordinates to real-world coordinates
  public scaleToReal(value: number): number {
    return value / this.scaleFactor;
  }

  update(elapsedTime: number) {
    const acceleratedElapsedTime = this.timeAcceleration * elapsedTime;

    const lift = this.thermal.calculateLift(this.glider.x, this.glider.y);

    this.glider.update(lift, acceleratedElapsedTime);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.thermal.draw(ctx, this.scaleFactor);
    this.glider.draw(ctx, this.scaleFactor);
  }
}
