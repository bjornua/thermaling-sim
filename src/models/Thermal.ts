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
}
