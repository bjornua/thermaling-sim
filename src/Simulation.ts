import renderAttitudeIndicator from "./render/ArtificialHorizon";
import renderVarioMeter from "./render/Variometer";
import renderOverheadView from "./render/OverheadView";
import renderProgress from "./render/Progress";

import { World } from "./models/World";

export class Simulation {
  public totalElapsed: number = 0;
  public shouldRenderOverheadView: boolean = false;

  constructor(
    public world: World,
    public timeAcceleration: number,
    public maxDuration: number | null = null
  ) {}

  update(clockElapsedTime: number) {
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

  draw(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
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

    if (this.shouldRenderOverheadView) {
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

    if (this.maxDuration) {
      renderProgress(
        ctx,
        0,
        0,
        canvasWidth,
        1,
        this.totalElapsed / this.maxDuration
      );
    }
  }
}
