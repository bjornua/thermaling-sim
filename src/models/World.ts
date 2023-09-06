import { Glider } from "./Glider";
import { Thermal } from "./Thermal";

export class World {
  constructor(
    public width: number,
    public height: number,
    public thermal: Thermal,
    public gliders: Glider[]
  ) {}

  update() {
    this.gliders.forEach((glider) => {
      const lift = this.thermal.calculateLift(glider.x, glider.y);
      glider.update(lift);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.thermal.draw(ctx);
    for (const glider of this.gliders) {
      glider.draw(ctx);
    }
  }
}
