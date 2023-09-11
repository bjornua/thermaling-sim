export function drawRectangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, width - 2, height - 2);
}
