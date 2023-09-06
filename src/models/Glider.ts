import { GliderController } from "./GliderController";

export type BankingStrategy = (liftChange: number) => boolean;

export class Glider {
  public angle = 0;
  public turnRate = 20; // Default turn rate in seconds

  constructor(
    public x: number,
    public y: number,
    public color: string,
    private controller: GliderController
  ) {}

  update(lift: number): void {
    this.turnRate = this.controller.decideTurnRate(lift);
    this.updatePosition();
  }

  updatePosition(): void {
    const angularSpeed = (2 * Math.PI) / this.turnRate;
    const angularDistance = angularSpeed * (1 / 60);
    this.angle += angularDistance;
    const speed = (90 * 1000) / 3600;
    const distance = speed * (1 / 60);
    this.x += distance * Math.cos(this.angle);
    this.y += distance * Math.sin(this.angle);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  }
}
