import { useRef, useEffect } from "react";

import { World } from "../models/World";

type CanvasProps = {
  world: World;
};

export const Canvas = ({ world }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    function loop() {
      if (!ctx) return;

      ctx.clearRect(0, 0, 600, 600);
      world.update();
      world.draw(ctx);
      requestAnimationFrame(loop);
    }

    loop();
  }, [world]);

  return <canvas ref={canvasRef} width="600" height="600"></canvas>;
};
