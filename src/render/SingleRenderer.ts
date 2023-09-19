import Variometer from "./components/Variometer";
import OverheadView from "./components/OverheadView";
import AttitudeIndicator from "./components/ArtificialHorizon";
import { Simulation } from "../Simulation";
import { BoundedContext, Rectangle } from "./util";
import ProgressRenderer from "./components/Progress";

export class SingleRenderer {
  private ctx: BoundedContext;

  private attitudeIndicator: AttitudeIndicator;
  private overheadview: OverheadView;
  private variometer: Variometer;
  progressRenderer: ProgressRenderer;

  constructor(canvas: HTMLCanvasElement, pixelRatio: number) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Context doesn't exist");

    this.ctx = new BoundedContext(
      canvas,
      ctx,
      pixelRatio,
      new Rectangle(
        0,
        0,
        Math.max(100, canvas.width),
        Math.max(100, canvas.height)
      )
    );
    this.ctx.clear();

    const progressBarHeight = this.ctx.scalePixel(3);

    const instrumentsCtx = this.ctx.getSubContext({
      left: 0,
      top: 0,
      right: 0,
      bottom: -progressBarHeight,
    });

    const grid = instrumentsCtx.splitVertically(3).map((ctx) => {
      return ctx.getSubContext({ left: 10, top: 10, bottom: -10, right: -10 });
    });

    this.attitudeIndicator = new AttitudeIndicator(grid[0]);

    this.variometer = new Variometer(grid[1]);

    this.overheadview = new OverheadView(
      grid[2],
      new Rectangle(0, 0, 600, 600)
    );

    this.progressRenderer = new ProgressRenderer(
      this.ctx.getSubContext({ top: -3, bottom: 0, right: 0, left: 0 })
    );
  }

  draw(simulation: Simulation) {
    const { totalElapsed, maxDuration, shouldRenderOverheadView, world } =
      simulation;

    this.ctx.clear();
    this.attitudeIndicator.render(world.gliders[0].bankAngle);
    this.variometer.render(world.gliders[0].variometer.getLiftValueWithDelay());

    if (shouldRenderOverheadView) {
      this.overheadview.render(world.thermal, world.gliders[0]);
    }

    if (maxDuration) {
      this.progressRenderer.render(totalElapsed / maxDuration);
    }
  }
}
