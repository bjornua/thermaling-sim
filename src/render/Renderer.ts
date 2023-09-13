import Variometer from "./Variometer";
import OverheadView from "./OverheadView";
import renderProgress from "./Progress";
import AttitudeIndicator from "./ArtificialHorizon";
import { Simulation } from "../Simulation";
import { BoundedRenderingContext } from "./util";

export class Renderer {
  private ctx: BoundedRenderingContext;
  private instrumentsCtx: BoundedRenderingContext;

  private gridWidth: number;
  private instrumentPadding: number;
  private progressBarHeight: number;
  private attitudeIndicator: AttitudeIndicator;
  private overheadview: OverheadView;
  private variometer: Variometer;

  constructor(canvas: HTMLCanvasElement, pixelRatio: number) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Context doesn't exist");

    this.ctx = new BoundedRenderingContext(
      canvas,
      ctx,
      pixelRatio,
      0,
      0,
      canvas.width < 100 ? 100 : canvas.width,
      canvas.height < 100 ? 100 : canvas.height
    );

    this.gridWidth = Math.floor(this.ctx.width / 3);

    this.instrumentPadding = 10;
    this.progressBarHeight = this.ctx.scalePixel(3);

    this.instrumentsCtx = this.ctx.createNew(
      0,
      0,
      this.gridWidth * 3,
      -this.instrumentPadding * 2 - this.progressBarHeight
    );

    const instrumentWidth = this.gridWidth - this.instrumentPadding * 2;

    this.attitudeIndicator = new AttitudeIndicator(
      this.instrumentsCtx.createNew(0, 0, instrumentWidth, null)
    );

    this.variometer = new Variometer(
      this.instrumentsCtx.createNew(
        this.gridWidth * 1 + this.instrumentPadding,
        0,
        instrumentWidth,
        null
      )
    );

    this.overheadview = new OverheadView(
      this.instrumentsCtx.createNew(
        this.gridWidth * 2 + this.instrumentPadding,
        0,
        instrumentWidth,
        null
      ),
      0,
      0,
      600,
      600
    );
  }

  draw(simulation: Simulation) {
    const { totalElapsed, maxDuration, shouldRenderOverheadView, world } =
      simulation;

    this.ctx.clear();
    this.attitudeIndicator.render(world.glider.bankAngle);
    this.variometer.render(world.glider.lift);

    if (shouldRenderOverheadView) {
      this.overheadview.render(world.thermal, world.glider);
    }

    if (maxDuration) {
      renderProgress(
        this.ctx.ctx,
        0,
        this.ctx.height - this.ctx.scalePixel(3),
        this.ctx.width,
        this.ctx.scalePixel(3),
        totalElapsed / maxDuration
      );
    }
  }
}
