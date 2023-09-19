import { useRef, useMemo } from "react";

import { World } from "../models/World";
import { useState } from "react";
import { Thermal } from "../models/Thermal";
import { GliderController } from "../models/GliderController";
import { Glider } from "../models/Glider";
import { Simulation } from "../Simulation";
import { Checkbox, Container } from "@mantine/core";
import { SingleRenderer } from "../render/SingleRenderer";
import CanvasAnimation, { CanvasAnimationRef } from "./CanvasAnimation";

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

  const world = new World(600, 800, thermal, [
    new Glider(x, y, "#00F", variolag, controller),
  ]);

  const simulation = new Simulation(world, timeAcceleration, duration);

  return simulation;
}

export const SingleGliderSimulation = ({
  x,
  y,
  controller,
  duration,
  variolag,
  alwaysRenderOverheadView,
}: ThermalingSimulationProps) => {
  const canvasRef = useRef<CanvasAnimationRef>(null);
  const [shouldRenderOverheadView, setShouldRenderOverheadView] =
    useState(false);

  const simulation = useMemo(() => {
    return makeSimulation(x, y, controller, 2, duration, variolag);
  }, [controller, duration, variolag, x, y]);

  let renderer: SingleRenderer | null = null;

  simulation.shouldRenderOverheadView =
    shouldRenderOverheadView || alwaysRenderOverheadView;

  return (
    <Container fluid mb="md" mt="md">
      <CanvasAnimation
        ref={canvasRef}
        onDraw={() => {
          if (renderer === null) return;
          simulation.update();
          renderer.draw(simulation);
        }}
        onResize={() => {
          renderer =
            canvasRef.current === null || canvasRef.current.canvas === null
              ? null
              : new SingleRenderer(
                  canvasRef.current.canvas,
                  window.devicePixelRatio
                );
        }}
      />
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
    </Container>
  );
};

/* <Container fluid style={{ flexGrow: 1 }}>
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
      </Container> */
