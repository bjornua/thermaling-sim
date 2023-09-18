import Variometer from "./Variometer";
import OverheadView from "./OverheadView";
import renderProgress from "./Progress";
import AttitudeIndicator from "./ArtificialHorizon";
import { Simulation } from "../Simulation";
import { BoundedContext, Rectangle } from "./util";
import ProgressRenderer from "./Progress";

export class Renderer {
  private ctx: BoundedContext;
  private instrumentsCtx: BoundedContext;

  private attitudeIndicator: AttitudeIndicator;
  private overheadview: OverheadView;
  private variometer: Variometer;
  progressRenderer: renderProgress;

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
        canvas.width < 100 ? 100 : canvas.width,
        canvas.height < 100 ? 100 : canvas.height
      )
    );

    const gridWidth = Math.floor(this.ctx.rect.width / 3);

    const instrumentPadding = 10;
    const progressBarHeight = this.ctx.scalePixel(3);

    this.instrumentsCtx = this.ctx.getSubContext({
      left: 0,
      top: 0,
      width: gridWidth * 3,
      bottom: -instrumentPadding * 2 - progressBarHeight,
    });

    const instrumentWidth = gridWidth - instrumentPadding * 2;

    this.attitudeIndicator = new AttitudeIndicator(
      this.instrumentsCtx.getSubContext({
        left: 0,
        top: 0,
        width: instrumentWidth,
        bottom: -1,
      })
    );

    this.variometer = new Variometer(
      this.instrumentsCtx.getSubContext({
        left: gridWidth + instrumentPadding,
        width: instrumentWidth,
        top: 0,
        bottom: 0,
      })
    );

    this.overheadview = new OverheadView(
      this.instrumentsCtx.getSubContext({
        top: 0,
        left: gridWidth * 2 + instrumentPadding,
        width: instrumentWidth,
        bottom: 0,
      }),
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
    this.attitudeIndicator.render(world.glider.bankAngle);
    this.variometer.render(world.glider.variometer.getLiftValueWithDelay());

    if (shouldRenderOverheadView) {
      this.overheadview.render(world.thermal, world.glider);
    }

    if (maxDuration) {
      this.progressRenderer.render(totalElapsed / maxDuration);
    }
  }
}
