import { Glider } from "../models/Glider";
import { Thermal } from "../models/Thermal";

export class World {
  constructor(
    public width: number,
    public height: number,
    public thermal: Thermal,
    public gliders: Glider[]
  ) {}

  reset() {
    this.gliders.map((glider) => glider.reset());
  }

  update(elapsedTime: number) {
    this.gliders.map((glider) => {
      const lift = this.thermal.calculateLift(glider.x, glider.y);
      glider.update(lift, elapsedTime);
    });
  }
}
