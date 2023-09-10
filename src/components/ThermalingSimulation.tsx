import { useRef, useEffect } from "react";

import { World } from "../models/World";
import { useState } from "react";
import { Container, List, Slider, Text } from "@mantine/core";
import { Thermal } from "../models/Thermal";
import { GliderController } from "../models/GliderController";
import { Glider } from "../models/Glider";

type ThermalingSimulationProps = {
  x: number;
  y: number;
  controller: GliderController;
  duration: number;
};

function makeWorld(x: number, y: number, controller: GliderController): World {
  const thermal = new Thermal(300, 300, 5, 250);

  return new World(600, 800, thermal, new Glider(x, y, "#00F", controller));
}

export const ThermalingSimulation = ({
  x,
  y,
  controller,
  duration,
}: ThermalingSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(2);
  const [world, setWorld] = useState(makeWorld(x, y, controller));

  useEffect(() => {
    let stop = false;

    const startTime = Date.now();
    let prevTimeStamp: number | null = startTime;

    function loop() {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || stop) return;

      ctx.clearRect(0, 0, world.width, world.height);

      const nextTimeStamp = Date.now();
      if (nextTimeStamp - startTime > duration) {
        setWorld(makeWorld(x, y, controller));
      }
      world.update(
        prevTimeStamp === null ? 0 : (nextTimeStamp - prevTimeStamp) / 1000
      );
      prevTimeStamp = nextTimeStamp;
      world.draw(ctx);
      requestAnimationFrame(loop);
    }

    loop();

    return () => {
      stop = true;
    };
  }, [controller, duration, world, x, y]);
  world.timeAcceleration = speed;
  return (
    <div>
      {/* <Container fluid style={{ flexGrow: 1 }}>
        <Text size="sm">Simulation Speed</Text>
        <Slider
          defaultValue={1}
          min={0}
          max={10}
          label={(value) => `${value.toFixed(1)}x`}
          step={1}
          value={speed}
          mb="xl"
          onChange={(s) => {
            setSpeed(s);
          }}
          marks={[
            { value: 1, label: "1.0x" },
            { value: 2, label: "2.0x" },
            { value: 5, label: "5.0x" },
            { value: 10, label: "10.0x" },
          ]}
        />
      </Container> */}
      <div>
        <canvas
          ref={canvasRef}
          width={`${world.scaleToPixel(world.width)}px`}
          height={`${world.scaleToPixel(world.height)}px`}
          style={{ display: "block" }}
        ></canvas>
      </div>
    </div>
  );
};
