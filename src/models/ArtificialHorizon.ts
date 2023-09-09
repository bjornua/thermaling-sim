export class ArtificialHorizon {
  public bankAngle: number = 0; // Bank angle in degrees

  constructor() {}

  update(bankAngle: number) {
    this.bankAngle = Math.min(Math.max(bankAngle, -90), 90);
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, diameter: number) {
    const radius = diameter / 2;
    const centerX = x + radius;
    const centerY = y + radius;

    // Clear previous drawings
    ctx.clearRect(x, y, diameter, diameter);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Clip to the outer circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.clip();

    // Rotate the context
    ctx.translate(centerX, centerY);
    ctx.rotate(-this.bankAngle * (Math.PI / 180));

    // Draw sky and ground
    ctx.fillStyle = "#87CEEB"; // Sky blue
    ctx.fillRect(-radius, -radius, diameter, radius);
    ctx.fillStyle = "#8B4513"; // Saddle brown
    ctx.fillRect(-radius, 0, diameter, radius);

    // Draw the bank angle markers and horizon
    ctx.strokeStyle = "white";
    const drawMarker = (angle: number, length: number, lineWidth: number) => {
      const angleInRadians = (Math.PI / 180) * (angle - 90); // Offset by 90 degrees
      const x1 = radius * Math.cos(angleInRadians);
      const y1 = radius * Math.sin(angleInRadians);
      const x2 = (radius - length) * Math.cos(angleInRadians);
      const y2 = (radius - length) * Math.sin(angleInRadians);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Draw minor, major markers, and dot
    for (const angle of [10, 20, 30, 45, 60]) {
      let length: number;
      let lineWidth: number;

      if (angle < 30) {
        length = radius * 0.1;
        lineWidth = 1;
      } else {
        length = radius * 0.2;
        lineWidth = 2;
      }

      drawMarker(angle, length, lineWidth);
      drawMarker(-angle, length, lineWidth);
    }

    // Draw horizon line
    ctx.beginPath();
    ctx.moveTo(-radius, 0);
    ctx.lineTo(radius, 0);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Restore the context
    ctx.restore();

    // Draw arrow indicating current bank angle
    ctx.strokeStyle = "red";
    ctx.beginPath();
    const arrowLength = radius * 0.8;
    const arrowX = centerX + arrowLength * Math.sin(0);
    const arrowY = centerY - arrowLength * Math.cos(0);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(arrowX, arrowY);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw airplane symbol at the center
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY);
    ctx.lineTo(centerX + 10, centerY);
    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX, centerY + 5);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
