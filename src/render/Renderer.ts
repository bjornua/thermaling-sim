import VarioMeter from "./Variometer";
import OverheadView from "./OverheadView";
import renderProgress from "./Progress";
import AttitudeIndicator from "./ArtificialHorizon";
import { Simulation } from "../Simulation";

export class Renderer {
  private width: number;
  private height: number;
  private instrumentWidth: number;
  private instrumentHeight: number;
  private gridWidth: number;
  private instrumentPadding: number;
  private progressBarHeight: number;
  private attitudeIndicator: AttitudeIndicator;
  private overheadview: OverheadView;
  private variometer: VarioMeter;

  constructor(
    private ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    this.width = width < 100 ? 100 : width;
    this.height = height < 100 ? 100 : height;

    this.gridWidth = Math.floor(this.width / 3);
    this.instrumentPadding = 10;
    this.progressBarHeight = devicePixelRatio * 3;

    this.instrumentWidth = this.gridWidth - this.instrumentPadding * 2;
    this.instrumentHeight =
      this.height - this.instrumentPadding * 2 - this.progressBarHeight;

    this.attitudeIndicator = new AttitudeIndicator(
      ctx,
      0,
      0,
      this.instrumentWidth,
      this.instrumentHeight
    );

    this.overheadview = new OverheadView(
      ctx,
      this.gridWidth * 2 + this.instrumentPadding,
      0,
      this.instrumentWidth,
      this.instrumentHeight,
      0,
      0,
      600,
      600
    );

    this.variometer = new VarioMeter(
      this.ctx,
      this.gridWidth * 1 + this.instrumentPadding,
      0,
      this.instrumentWidth,
      this.instrumentHeight
    );

    this.ctx = ctx;
  }

  draw(simulation: Simulation) {
    const { totalElapsed, maxDuration, shouldRenderOverheadView, world } =
      simulation;

    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.attitudeIndicator.render(world.glider.bankAngle);
    this.variometer.render(world.glider.lift);

    if (shouldRenderOverheadView) {
      this.overheadview.render(world.thermal, world.glider);
    }

    if (maxDuration) {
      renderProgress(
        this.ctx,
        0,
        this.height - 3 * window.devicePixelRatio,
        this.width,
        3 * window.devicePixelRatio,
        totalElapsed / maxDuration
      );
    }
  }
}
