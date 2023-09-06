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

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 1; i <= 5; i++) {
      const lift = (i / 5) * this.maxLift;
      const radius = this.calculateDistanceToCenterFromLift(lift);
      ctx.strokeStyle = "#f00";
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

// export class Thermal {
//   constructor(
//     public x: number,
//     public y: number,
//     public maxLift: number,
//     public decayFactor: number
//   ) {}

//   calculateLift(x: number, y: number): number {
//     const distanceToCenter = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
//     return (
//       this.maxLift *
//       Math.exp(-this.decayFactor * distanceToCenter * distanceToCenter)
//     );
//   }

//   draw(ctx: CanvasRenderingContext2D) {
//     for (let i = 5; i > 0; i--) {
//       const radius = Math.sqrt(-Math.log(i / 5) / 0.0001);
//       ctx.strokeStyle = "#f00";
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
//       ctx.stroke();
//     }
//   }
// }
