import { Glider } from "../models/Glider";
import { Thermal } from "../models/Thermal";

export class World {
  constructor(
    public width: number,
    public height: number,
    public thermal: Thermal,
    public glider: Glider
  ) {}

  reset() {
    this.glider.reset();
  }

  update(elapsedTime: number) {
    const lift = this.thermal.calculateLift(this.glider.x, this.glider.y);
    this.glider.update(lift, elapsedTime);
  }
}
