import { useRef, useEffect, useMemo } from "react";

import { World } from "../models/World";
import { useState } from "react";
import { Thermal } from "../models/Thermal";
import { GliderController } from "../models/GliderController";
import { Glider } from "../models/Glider";
import { Simulation } from "../Simulation";
import { Checkbox } from "@mantine/core";
import { Renderer } from "../render/Renderer";

type ThermalingSimulationProps = {
  x: number;
  y: number;
  controller: GliderController;
  duration: number;
  variolag: number;
  alwaysRenderOverheadView: boolean;
};

function makeSimulation(
  x: number,
  y: number,
  controller: GliderController,
  timeAcceleration: number,
  duration: number,
  variolag: number
): Simulation {
  const thermal = new Thermal(300, 300, 5, 250);

  const world = new World(
    600,
    800,
    thermal,
    new Glider(x, y, "#00F", variolag, controller)
  );

  const simulation = new Simulation(world, timeAcceleration, duration);

  return simulation;
}

export const ThermalingSimulation = ({
  x,
  y,
  controller,
  duration,
  variolag,
  alwaysRenderOverheadView,
}: ThermalingSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speed = 2;
  const [shouldRenderOverheadView, setShouldRenderOverheadView] =
    useState(false);

  const simulation = useMemo(() => {
    return makeSimulation(x, y, controller, speed, duration, variolag);
  }, [controller, duration, variolag, x, y]);

  simulation.shouldRenderOverheadView =
    shouldRenderOverheadView || alwaysRenderOverheadView;

  useEffect(() => {
    let stop = false;
    let isInView = false;
    let stopped = true;

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    let renderer = new Renderer(canvasElement, window.devicePixelRatio);

    function start() {
      let prevTimeStamp: number = Date.now();
      stopped = false;

      function loop() {
        if (stop || !isInView || !canvasElement) {
          stopped = true;
          return;
        }

        const nextTimeStamp = Date.now();

        simulation.update((nextTimeStamp - prevTimeStamp) / 1000);
        prevTimeStamp = nextTimeStamp;

        if (isInView) {
          renderer.draw(simulation);
        }
        requestAnimationFrame(loop);
      }
      loop();
    }
    start();

    const observer = new ResizeObserver((elements) => {
      for (const element of elements) {
        const pixelRatio = window.devicePixelRatio;
        canvasElement.width = Math.floor(
          element.contentRect.width * pixelRatio
        );
        canvasElement.height = Math.floor(
          (200 / 600) * element.contentRect.width * pixelRatio
        );

        canvasElement.style.height = `${Math.floor(
          (200 / 600) * element.contentRect.width
        )}px`;
        renderer = new Renderer(canvasElement, window.devicePixelRatio);
        return;
      }
    });
    observer.observe(canvasElement);

    // Create a new intersection observer
    const interSectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isInView = entry.isIntersecting;
        if (stopped) {
          start();
        }
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
        {alwaysRenderOverheadView ? null : (
          <Checkbox
            mb="md"
            mt="md"
            label="Reveal thermal?"
            checked={shouldRenderOverheadView}
            onChange={(e) => {
              setShouldRenderOverheadView(e.target.checked);
            }}
          />
        )}
      </div>
    </div>
  );
};
