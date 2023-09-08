export class Thermal {
  constructor(
    public x: number,
    public y: number,
    public maxLift: number,
    public radius: number
  ) {}

  calculateLift(x: number, y: number): number {
    const distanceToCenter = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);

    if (distanceToCenter > this.radius) {
      return 0;
    }
    return this.maxLift * (1 - distanceToCenter / this.radius);
  }

  calculateDistanceToCenterFromLift(lift: number): number {
    return this.radius * (1 - lift / this.maxLift);
  }

  draw(ctx: CanvasRenderingContext2D, scaleFactor: number) {
    for (let i = 0; i <= 4; i++) {
      const lift = (i / 5) * this.maxLift;
      const radius = this.calculateDistanceToCenterFromLift(lift) * scaleFactor;
      ctx.strokeStyle = "#f00";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(
        this.x * scaleFactor,
        this.y * scaleFactor,
        radius,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
  }
}
