import { useRef, useEffect } from "react";

import { World } from "../models/World";
import { useState } from "react";
import { Thermal } from "../models/Thermal";
import { GliderController } from "../models/GliderController";
import { Glider } from "../models/Glider";
import { Simulation } from "../Simulation";
import { Checkbox } from "@mantine/core";

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
  const [shouldRenderOverheadView, setShouldRenderOverheadView] =
    useState(false);

  const [simulation, setSimulation] = useState(
    makeSimulation(x, y, controller, speed)
  );

  useEffect(() => {
    let stop = false;

    const startTime = Date.now();
    let prevTimeStamp: number | null = startTime;

    if (stop) return;

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const ctx = canvasElement.getContext("2d", {
      alpha: false,
    });

    if (!ctx) return;

    const observer = new ResizeObserver((elements) => {
      for (const element of elements) {
        canvasElement.width = element.contentRect.width;
        canvasElement.height = Math.floor(
          (200 / 600) * element.contentRect.width
        );
        return;
      }
    });

    observer.observe(canvasElement);

    function loop() {
      if (stop) return;
      if (!ctx) return;
      if (!canvasElement) return;

      const nextTimeStamp = Date.now();
      if (nextTimeStamp - startTime > duration) {
        setSimulation(makeSimulation(x, y, controller, speed));
      }
      simulation.update(
        prevTimeStamp === null ? 0 : (nextTimeStamp - prevTimeStamp) / 1000
      );
      prevTimeStamp = nextTimeStamp;

      simulation.draw(
        ctx,
        canvasElement.width,
        canvasElement.height,
        shouldRenderOverheadView
      );
      requestAnimationFrame(loop);
    }

    loop();

    return () => {
      stop = true;
      observer.disconnect();
    };
  }, [controller, duration, shouldRenderOverheadView, simulation, x, y]);
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
          style={{ display: "block", width: "100%" }}
        ></canvas>
        <Checkbox
          label="Reveal thermal?"
          checked={shouldRenderOverheadView}
          onChange={(e) => {
            setShouldRenderOverheadView(e.target.checked);
          }}
        ></Checkbox>
      </div>
    </div>
  );
};
