export class Variometer {
  public lift: number = 0;

  constructor() {}

  update(lift: number) {
    this.lift = lift;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
    // Dimensions
    const centerX = x;
    const centerY = y + height / 2;

    // Drawing properties
    const scaleRadius = height / 4;
    const scaleStartAngle = Math.PI / 4; // Starting at SE position
    const scaleEndAngle = (8 * Math.PI) / 4; // Ending at NE position
    const scaleDivisions = 10; // From -5 to +5
    const scaleDivisionAngle =
      (scaleEndAngle - scaleStartAngle) / scaleDivisions;

    // Draw Scale
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(centerX, centerY, scaleRadius, 0, scaleEndAngle);
    ctx.stroke();

    // Draw Scale Divisions and Labels
    for (let i = 0; i <= scaleDivisions; i++) {
      const angle = scaleStartAngle + i * scaleDivisionAngle;
      const x1 = centerX + scaleRadius * Math.cos(angle);
      const y1 = centerY + scaleRadius * Math.sin(angle);
      const x2 = centerX + (scaleRadius - 10) * Math.cos(angle);
      const y2 = centerY + (scaleRadius - 10) * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.stroke();

      const label = i - 5; // Labels range from -5 to +5
      const labelX = centerX + (scaleRadius - 20) * Math.cos(angle) - 5; // -5 for text alignment
      const labelY = centerY + (scaleRadius - 20) * Math.sin(angle) + 5; // +5 for text alignment
      ctx.fillText(label.toString(), labelX, labelY);
    }

    // To update the variometer needle, calculate the angle based on the current lift value
    // and draw a line from the center to the edge of the circle at that angle.
    const needleLength = scaleRadius - 10; // Define your desired needle length
    const normalizedLift = (this.lift + 5) / 10; // Normalize lift to [0, 1]
    const needleAngle =
      scaleStartAngle + normalizedLift * (scaleEndAngle - scaleStartAngle);

    const needleX = centerX + needleLength * Math.cos(needleAngle);
    const needleY = centerY + needleLength * Math.sin(needleAngle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleX, needleY);
    ctx.lineWidth = 1; // Set line width as needed
    ctx.stroke();
  }
}
