import { ArtificialHorizon } from "./ArtificialHorizon";
import { Glider } from "./Glider";
import { Thermal } from "./Thermal";
import { Variometer } from "./Variometer";

export class World {
  private scaleFactor: number; // Meters per pixel
  public timeAcceleration: number;
  public variometer: Variometer;
  public artificialHorizon: ArtificialHorizon;

  constructor(
    public width: number,
    public height: number,
    public thermal: Thermal,
    public glider: Glider
  ) {
    this.scaleFactor = 0.5; // Initialize with a suitable value; say 1 meter per pixel
    this.timeAcceleration = 1;
    this.variometer = new Variometer();
    this.artificialHorizon = new ArtificialHorizon();
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
    this.variometer.update(lift);
    this.glider.update(lift, acceleratedElapsedTime);

    this.artificialHorizon.update(this.glider.bankAngle);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.thermal.draw(ctx, this.scaleFactor);
    this.glider.draw(ctx, this.scaleFactor);
    this.variometer.draw(
      ctx,
      this.scaleToPixel(this.width - 400 / 4) - 1,
      this.scaleToPixel(this.height - (400 * 3) / 4),
      this.scaleToPixel(400)
    );
    this.artificialHorizon.draw(
      ctx,
      this.scaleToPixel(0) + 1,
      this.scaleToPixel(this.height - 200),
      this.scaleToPixel(200)
    );
  }
}
