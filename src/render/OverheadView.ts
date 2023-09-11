import { Glider } from "../models/Glider";
import { Thermal } from "../models/Thermal";

function worldToCanvas(
  worldCoord: number,
  worldStart: number,
  offset: number,
  scaleFactor: number
): number {
  return (worldCoord - worldStart) * scaleFactor + offset;
}

export default function renderView(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  worldX: number,
  worldY: number,
  worldWidth: number,
  worldHeight: number,
  thermal: Thermal,
  glider: Glider
): void {
  const scaleX = width / worldWidth;
  const scaleY = height / worldHeight;
  const scaleFactor = Math.min(scaleX, scaleY);

  const gapX = width - worldWidth * scaleFactor;
  const gapY = height - worldHeight * scaleFactor;

  const toCanvasX = (wx: number) =>
    worldToCanvas(wx, worldX, x + gapX / 2, scaleFactor);
  const toCanvasY = (wy: number) =>
    worldToCanvas(wy, worldY, y + gapY / 2, scaleFactor);

  drawThermal(ctx, toCanvasX, toCanvasY, scaleFactor, thermal);
  drawGlider(ctx, toCanvasX, toCanvasY, glider);
}

function drawGlider(
  ctx: CanvasRenderingContext2D,
  toCanvasX: (x: number) => number,
  toCanvasY: (y: number) => number,
  glider: Glider
): void {
  const pixelX = toCanvasX(glider.x);
  const pixelY = toCanvasY(glider.y);

  // Draw the glider itself
  ctx.fillStyle = glider.color;
  ctx.beginPath();
  ctx.arc(pixelX, pixelY, 10, 0, 2 * Math.PI);
  ctx.fill();

  // Draw the bank angle
  ctx.fillStyle = "#000";
  ctx.font = `12px Arial`;
  ctx.fillText(
    `Bank: ${glider.bankAngle.toFixed(0)}°`,
    pixelX + 15,
    pixelY - 6
  );

  // Draw the lift value
  ctx.fillText(`Lift: ${glider.lift.toFixed(2)} m/s`, pixelX + 15, pixelY + 6);

  // Draw the height
  ctx.fillText(
    `Height: ${glider.height.toFixed(0)}m`,
    pixelX + 15,
    pixelY + 18
  );

  // Draw trace
  for (let i = 1; i < glider.trace.length; i++) {
    const prevPoint = glider.trace[i - 1];
    const point = glider.trace[i];

    const prevPixelX = toCanvasX(prevPoint.x);
    const prevPixelY = toCanvasY(prevPoint.y);

    const pointPixelX = toCanvasX(point.x);
    const pointPixelY = toCanvasY(point.y);

    const strokeWeight = getStrokeWeight(point.bankAngle);

    ctx.beginPath();
    ctx.moveTo(prevPixelX, prevPixelY);
    ctx.lineTo(pointPixelX, pointPixelY);
    ctx.lineWidth = strokeWeight;
    ctx.strokeStyle = glider.color;
    ctx.stroke();
  }
}

function getStrokeWeight(bankAngle: number): number {
  const minStrokeWidth = 3;
  const maxStrokeWidth = 0.1;
  const minBankAngle = 35;
  const maxBankAngle = 60;

  const clippedBankAngle = Math.min(
    Math.max(bankAngle, minBankAngle),
    maxBankAngle
  );

  const weight =
    (clippedBankAngle - minBankAngle) / (maxBankAngle - minBankAngle);
  return minStrokeWidth + (maxStrokeWidth - minStrokeWidth) * weight;
}

function drawThermal(
  ctx: CanvasRenderingContext2D,
  toCanvasX: (x: number) => number,
  toCanvasY: (y: number) => number,
  scaleFactor: number,
  thermal: Thermal
): void {
  const centerX = toCanvasX(thermal.x);
  const centerY = toCanvasY(thermal.y);

  for (let i = 0; i <= 4; i++) {
    const lift = (i / 5) * thermal.maxLift;
    const worldRadius = thermal.calculateDistanceToCenterFromLift(lift);
    const canvasRadius = worldRadius * scaleFactor;

    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, canvasRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
