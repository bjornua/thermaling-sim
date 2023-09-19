import { World } from "./models/World";

export class Simulation {
  public totalElapsed: number = 0;
  public lastUpdateTime: number = Date.now(); // 1. New state to track the last update time
  public shouldRenderOverheadView: boolean = false;

  constructor(
    public world: World,
    public timeAcceleration: number,
    public maxDuration: number | null
  ) {}

  update() {
    const currentTime = Date.now();
    const uncheckedClockElapsedTime =
      (currentTime - this.lastUpdateTime) / 1000; // 2. Compute elapsed time
    this.lastUpdateTime = currentTime; // 3. Reset lastUpdateTime

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
    this.lastUpdateTime = Date.now(); // 4. Reset the last update time
  }
}
