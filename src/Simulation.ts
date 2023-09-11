import renderAttitudeIndicator from "./render/ArtificialHorizon";
import renderVarioMeter from "./render/Variometer";
import renderOverheadView from "./render/OverheadView";

import { World } from "./models/World";

export class Simulation {
  constructor(public world: World, public timeAcceleration: number) {}

  update(elapsedTime: number) {
    const acceleratedElapsedTime = this.timeAcceleration * elapsedTime;
    this.world.update(acceleratedElapsedTime);
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.clearRect(0, 0, width, height);

    // drawRectangle(ctx, 0, 0, 200, 200);
    // drawRectangle(ctx, 200, 0, 200, 200);
    // drawRectangle(ctx, 400, 0, 200, 200);
    renderAttitudeIndicator(ctx, 10, 10, 180, 180, this.world.glider.bankAngle);
    renderVarioMeter(ctx, 210, 10, 180, 180, this.world.glider.lift);
    renderOverheadView(
      ctx,
      410,
      10,
      180,
      180,
      0,
      0,
      600,
      600,
      this.world.thermal,
      this.world.glider
    );
  }
}
