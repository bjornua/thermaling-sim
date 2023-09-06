import { useRef, useEffect } from "react";

import { World } from "../models/World";

type CanvasProps = {
  world: World;
};

export const Canvas = ({ world }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    let prevTimeStamp: number | null = null;

    function loop() {
      if (!ctx) return;

      ctx.clearRect(0, 0, world.width, world.height);

      const nextTimeStamp = Date.now();
      world.update(
        prevTimeStamp === null ? 0 : (nextTimeStamp - prevTimeStamp) / 1000
      );
      prevTimeStamp = nextTimeStamp;
      world.draw(ctx);
      requestAnimationFrame(loop);
    }

    loop();
  }, [world]);

  return (
    <div className="simulation">
      <h3>{world.glider.controller.title()}</h3>
      <p>{world.glider.controller.description()}</p>
      <canvas
        ref={canvasRef}
        width={`${world.scaleToPixel(world.width)}px`}
        height={`${world.scaleToPixel(world.height)}px`}
      ></canvas>
    </div>
  );
};
