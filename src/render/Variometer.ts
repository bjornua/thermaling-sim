export default function render(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  lift: number
) {
  // Dimensions
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const scaleRadius = Math.min(width, height) / 2;
  const divisionLength = 10; // Length of the division line
  const labelOffset = 20; // Offset from the division line to the label

  // Drawing properties
  const scaleStartAngle = Math.PI / 4;
  const scaleEndAngle = (7 * Math.PI) / 4;
  const scaleDivisions = 10;
  const scaleDivisionAngle = (scaleEndAngle - scaleStartAngle) / scaleDivisions;

  ctx.lineWidth = 1;

  drawScale(
    ctx,
    centerX,
    centerY,
    scaleRadius - 1,
    scaleStartAngle,
    scaleEndAngle
  );
  drawScaleDivisionsAndLabels(
    ctx,
    centerX,
    centerY,
    scaleRadius,
    scaleDivisions,
    divisionLength,
    labelOffset,
    scaleDivisionAngle
  );
  drawNeedle(
    ctx,
    centerX,
    centerY,
    scaleRadius,
    lift,
    scaleStartAngle,
    scaleEndAngle,
    divisionLength
  );
}

function drawScale(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.stroke();
}

function drawScaleDivisionsAndLabels(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  divisions: number,
  divisionLength: number,
  labelOffset: number,
  divisionAngle: number
) {
  for (let i = 0; i <= divisions; i++) {
    const angle = Math.PI / 4 + i * divisionAngle;
    const [x1, y1] = pointOnCircle(centerX, centerY, radius, angle);
    const [x2, y2] = pointOnCircle(
      centerX,
      centerY,
      radius - divisionLength,
      angle
    );

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const label = (i - 5).toString();
    const [labelX, labelY] = pointOnCircle(
      centerX,
      centerY,
      radius - labelOffset,
      angle
    );

    ctx.fillStyle = "#000";
    ctx.fillText(label, labelX - ctx.measureText(label).width / 2, labelY + 5); // Adjusting for text alignment
  }
}

function drawNeedle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  lift: number,
  startAngle: number,
  endAngle: number,
  divisionLength: number
) {
  const normalizedLift = (lift + 5) / 10;
  const needleAngle = startAngle + normalizedLift * (endAngle - startAngle);
  const [needleX, needleY] = pointOnCircle(
    centerX,
    centerY,
    radius - divisionLength,
    needleAngle
  );

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(needleX, needleY);
  ctx.stroke();
}

function pointOnCircle(
  cx: number,
  cy: number,
  r: number,
  angle: number
): [number, number] {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}
