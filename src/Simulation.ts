import { World } from "./models/World";

export class Simulation {
  public totalElapsed: number = 0;
  public shouldRenderOverheadView: boolean = false;

  constructor(
    public world: World,
    public timeAcceleration: number,
    public maxDuration: number | null
  ) {}

  update(uncheckedClockElapsedTime: number) {
    // step no longer than 100ms. Also mitigates when user tabs away from page
    const clockElapsedTime = Math.min(0.1, uncheckedClockElapsedTime);
    const elapsedTime = this.timeAcceleration * clockElapsedTime;

    this.totalElapsed += elapsedTime;

    if (this.maxDuration !== null && this.totalElapsed > this.maxDuration) {
      this.reset();
    }
    this.world.update(elapsedTime);
  }

  reset() {
    this.totalElapsed = 0;
    this.world.reset();
  }
}
