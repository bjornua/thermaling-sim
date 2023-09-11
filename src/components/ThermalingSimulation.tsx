import { useRef, useEffect, useMemo } from "react";

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
  timeAcceleration: number,
  duration: number
): Simulation {
  const thermal = new Thermal(300, 300, 5, 250);

  const world = new World(
    600,
    800,
    thermal,
    new Glider(x, y, "#00F", controller)
  );

  const simulation = new Simulation(world, timeAcceleration, duration);

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

  const simulation = useMemo(() => {
    return makeSimulation(x, y, controller, speed, duration);
  }, [controller, duration, x, y]);

  simulation.shouldRenderOverheadView = shouldRenderOverheadView;

  useEffect(() => {
    let stop = false;
    let isInView = false;

    let prevTimeStamp: number = Date.now();

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const ctx = canvasElement.getContext("2d", { alpha: false });

    if (!ctx) return;

    function loop() {
      if (stop || !ctx || !canvasElement) return;

      const nextTimeStamp = Date.now();

      simulation.update((nextTimeStamp - prevTimeStamp) / 1000);
      prevTimeStamp = nextTimeStamp;

      if (isInView) {
        simulation.draw(ctx, canvasElement.width, canvasElement.height);
      }
      requestAnimationFrame(loop);
    }
    loop();

    const observer = new ResizeObserver((elements) => {
      for (const element of elements) {
        canvasElement.width = Math.floor(
          element.contentRect.width * window.devicePixelRatio
        );
        canvasElement.height = Math.floor(
          (200 / 600) * element.contentRect.width * devicePixelRatio
        );

        canvasElement.style.height = `${Math.floor(
          (200 / 600) * element.contentRect.width
        )}px`;

        return;
      }
    });
    observer.observe(canvasElement);

    // Create a new intersection observer
    const interSectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isInView = entry.isIntersecting;
      });
    });

    interSectionObserver.observe(canvasElement);

    return () => {
      stop = true;
      observer.disconnect();
      interSectionObserver.disconnect();
    };
  }, [simulation]);

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
          mb="md"
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
