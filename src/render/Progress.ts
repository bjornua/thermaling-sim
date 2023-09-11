export default function renderProgressWidget(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  ratio: number
): void {
  // Extract properties

  // Calculate progress width based on the ratio
  const progressWidth = ratio * width;

  // Draw the progress line
  ctx.fillStyle = "#AAAAAA";
  ctx.fillRect(x, y, progressWidth, height);
}
