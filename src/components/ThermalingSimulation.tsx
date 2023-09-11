import { useRef, useEffect } from "react";

import { World } from "../models/World";
import { useState } from "react";
import { Thermal } from "../models/Thermal";
import { GliderController } from "../models/GliderController";
import { Glider } from "../models/Glider";
import { Simulation } from "../Simulation";

type ThermalingSimulationProps = {
  x: number;
  y: number;
  controller: GliderController;
  duration: number;
};

function makeSimulation(
  x: number,
  y: number,
  controller: GliderController,
  timeAcceleration: number
): Simulation {
  const thermal = new Thermal(300, 300, 5, 250);

  const world = new World(
    600,
    800,
    thermal,
    new Glider(x, y, "#00F", controller)
  );

  const simulation = new Simulation(world, timeAcceleration);

  return simulation;
}

export const ThermalingSimulation = ({
  x,
  y,
  controller,
  duration,
}: ThermalingSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speed = 2;
  // const [speed, setSpeed] = useState(2);

  const [simulation, setSimulation] = useState(
    makeSimulation(x, y, controller, speed)
  );

  useEffect(() => {
    let stop = false;

    const startTime = Date.now();
    let prevTimeStamp: number | null = startTime;

    function loop() {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || stop) return;

      const nextTimeStamp = Date.now();
      if (nextTimeStamp - startTime > duration) {
        setSimulation(makeSimulation(x, y, controller, speed));
      }
      simulation.update(
        prevTimeStamp === null ? 0 : (nextTimeStamp - prevTimeStamp) / 1000
      );
      prevTimeStamp = nextTimeStamp;
      simulation.draw(ctx, 600, 200);
      requestAnimationFrame(loop);
    }

    loop();

    return () => {
      stop = true;
    };
  }, [controller, duration, simulation, x, y]);
  simulation.timeAcceleration = speed;
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
          width={`600px`}
          height={`200px`}
          style={{ display: "block" }}
        ></canvas>
      </div>
    </div>
  );
};
