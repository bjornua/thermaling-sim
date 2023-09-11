const SKY_COLOR = "#87CEEB";
const GROUND_COLOR = "#8B4513";
const WHITE = "white";
const RED = "red";
const BLACK = "black";

export default function render(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  bankAngle: number
) {
  const diameter = Math.min(width, height);
  const radius = diameter / 2;
  const centerX = x + (width - diameter) / 2 + radius;
  const centerY = y + (height - diameter) / 2 + radius;

  drawDynamicContents(
    ctx,
    centerX,
    centerY,
    radius - 2 * window.devicePixelRatio,
    bankAngle
  );
  drawBankAngleArrow(
    ctx,
    centerX,
    centerY,
    radius - 2 * window.devicePixelRatio
  );
  drawOuterCircle(ctx, centerX, centerY, radius);
  drawPlaneSymbol(ctx, centerX, centerY);
}

function drawOuterCircle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  ctx.beginPath();
  ctx.strokeStyle = BLACK;
  ctx.arc(
    centerX,
    centerY,
    radius - 2 * window.devicePixelRatio,
    0,
    2 * Math.PI
  );
  ctx.lineWidth = 2 * window.devicePixelRatio;
  ctx.stroke();
}

function drawDynamicContents(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  bankAngle: number
) {
  ctx.save();

  // Clip to the outer circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.clip();

  // Rotate the context
  ctx.translate(centerX, centerY);
  ctx.rotate(-bankAngle * (Math.PI / 180));

  // Draw sky and ground
  ctx.fillStyle = SKY_COLOR;
  ctx.fillRect(-radius, -radius, 2 * radius, radius);
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(-radius, 0, 2 * radius, radius);

  drawBankMarkers(ctx, radius);

  // Draw horizon line
  ctx.strokeStyle = WHITE;
  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(radius, 0);
  ctx.lineWidth = 2 * window.devicePixelRatio;
  ctx.stroke();

  ctx.restore();
}

function drawBankMarkers(ctx: CanvasRenderingContext2D, radius: number) {
  const drawMarker = (angle: number, length: number, lineWidth: number) => {
    const angleInRadians = (Math.PI / 180) * (angle - 90);
    const x1 = radius * Math.cos(angleInRadians);
    const y1 = radius * Math.sin(angleInRadians);
    const x2 = (radius - length) * Math.cos(angleInRadians);
    const y2 = (radius - length) * Math.sin(angleInRadians);

    ctx.strokeStyle = WHITE;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  for (const angle of [10, 20, 30, 45, 60]) {
    const [length, lineWidth] =
      angle < 30 ? [radius * 0.1, 1] : [radius * 0.2, 2];
    drawMarker(angle, length, lineWidth * window.devicePixelRatio);
    drawMarker(-angle, length, lineWidth * window.devicePixelRatio);
  }
}

function drawBankAngleArrow(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  const arrowLength = radius * 0.8;
  const arrowX = centerX;
  const arrowY = centerY - arrowLength;

  ctx.strokeStyle = RED;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(arrowX, arrowY);
  ctx.lineWidth = 2 * window.devicePixelRatio;
  ctx.stroke();
}

function drawPlaneSymbol(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number
) {
  ctx.strokeStyle = BLACK;
  ctx.beginPath();
  ctx.moveTo(centerX - 10 * window.devicePixelRatio, centerY);
  ctx.lineTo(centerX + 10 * window.devicePixelRatio, centerY);
  ctx.moveTo(centerX, centerY - 5 * window.devicePixelRatio);
  ctx.lineTo(centerX, centerY + 5 * window.devicePixelRatio);
  ctx.lineWidth = 2 * window.devicePixelRatio;
  ctx.stroke();
}
