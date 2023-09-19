import { useRef, useEffect, useMemo } from "react";

import { World } from "../models/World";
import { useState } from "react";
import { Simulation } from "../Simulation";
import { Container } from "@mantine/core";
import { MultiRenderer } from "../render/MultiRenderer";
import CanvasAnimation, { CanvasAnimationRef } from "./CanvasAnimation";

type ThermalingSimulationProps = {
  world: World;
  duration: number;
};

export const ThreeGlidersSimulation = ({
  world,
  duration,
}: ThermalingSimulationProps) => {
  const canvasRef = useRef<CanvasAnimationRef>(null);
  useState(false);
  const rendererRef = useRef<MultiRenderer | null>(null);

  const simulation = useMemo(() => {
    const simulation = new Simulation(world, 2, duration);

    return simulation;
  }, [duration, world]);

  useEffect(() => {
    // Initialize the renderer once when the component mounts
    if (canvasRef.current === null || canvasRef.current.canvas === null) return;

    rendererRef.current = new MultiRenderer(
      canvasRef.current.canvas,
      window.devicePixelRatio
    );
  }, []);

  return (
    <Container fluid mb="md" mt="md">
      <CanvasAnimation
        ref={canvasRef}
        onDraw={() => {
          if (rendererRef.current === null) return;
          simulation.update();
          rendererRef.current.draw(simulation);
        }}
        onResize={() => {
          if (canvasRef.current === null || canvasRef.current.canvas === null)
            return;

          rendererRef.current = new MultiRenderer(
            canvasRef.current.canvas,
            window.devicePixelRatio
          );
        }}
      />
    </Container>
  );
};
