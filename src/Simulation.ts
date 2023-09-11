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

  draw(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    shouldRenderOverheadView: boolean
  ) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    canvasWidth = canvasWidth < 100 ? 100 : canvasWidth;
    canvasHeight = canvasHeight < 100 ? 100 : canvasHeight;

    const width = canvasWidth / 3;

    renderAttitudeIndicator(
      ctx,
      width * 0 + 10,
      10,
      width - 20,
      canvasHeight - 20,
      this.world.glider.bankAngle
    );
    renderVarioMeter(
      ctx,
      width * 1 + 10,
      10,
      width - 20,
      canvasHeight - 20,
      this.world.glider.lift
    );

    if (shouldRenderOverheadView) {
      renderOverheadView(
        ctx,
        width * 2 + 10,
        10,
        width - 20,
        canvasHeight - 20,
        0,
        0,
        600,
        600,
        this.world.thermal,
        this.world.glider
      );
    }
  }
}
