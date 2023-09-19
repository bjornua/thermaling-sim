import OverheadView from "./components/OverheadView";
import { Simulation } from "../Simulation";
import { BoundedContext, Rectangle } from "./util";
import ProgressRenderer from "./components/Progress";

export class MultiRenderer {
  private ctx: BoundedContext;
  private overheadViews: OverheadView[] = [];
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

    // Distribute canvas space for 3 overhead views
    const overheadViewContexts = this.ctx.splitVertically(3);
    for (let i = 0; i < 3; i++) {
      const subCtx = overheadViewContexts[i].getSubContext({
        left: 10,
        top: 10,
        bottom: -10,
        right: -10,
      });
      this.overheadViews.push(
        new OverheadView(subCtx, new Rectangle(0, 0, 600, 600))
      );
    }

    this.progressRenderer = new ProgressRenderer(
      this.ctx.getSubContext({ top: -3, bottom: 0, right: 0, left: 0 })
    );
  }

  draw(simulation: Simulation) {
    const { totalElapsed, maxDuration, world } = simulation;

    this.ctx.clear();

    // Render overhead views of the first 3 gliders
    for (let i = 0; i < Math.min(world.gliders.length, 3); i++) {
      this.overheadViews[i].render(world.thermal, world.gliders[i]);
    }

    if (maxDuration) {
      this.progressRenderer.render(totalElapsed / maxDuration);
    }
  }
}
