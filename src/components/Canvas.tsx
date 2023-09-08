import { useRef, useEffect, useMemo } from "react";

import { World } from "../models/World";
import { useState } from "react";
import { Container, Slider, Text } from "@mantine/core";
import { Thermal } from "../models/Thermal";
import {
  BankOnDecreasingLiftDelay,
  AlwaysBanking,
  NeverBanking,
  BankOnIncreasingLift,
  BankOnDecreasingLift,
} from "../models/GliderController";
import { Glider } from "../models/Glider";
import { Flex, Select } from "@mantine/core";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeControllerIndex, setActiveControllerIndex] = useState(0);
  const [speed, setSpeed] = useState(2);

  const controllers = useMemo(
    () => [
      new NeverBanking(35),
      new AlwaysBanking(45),
      new BankOnIncreasingLift(60, 40),
      new BankOnDecreasingLift(60, 40),
      new BankOnDecreasingLiftDelay(45, 65),
    ],
    []
  );

  const controller = controllers[activeControllerIndex];
  const world = useMemo(
    function () {
      const thermal = new Thermal(300, 300, 5, 250);

      return new World(
        600,
        600,
        thermal,
        new Glider(150, 150, "#00F", controller)
      );
    },
    [controller]
  );

  world.timeAcceleration = speed;

  useEffect(() => {
    let stop = false;
    let prevTimeStamp: number | null = null;

    function loop() {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || stop) return;

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

    return () => {
      stop = true;
    };
  }, [world]);

  return (
    <Flex align="flex-start">
      <Container fluid style={{ flexGrow: 1 }}>
        <Text size="sm">Simulation Speed</Text>
        <Slider
          defaultValue={1}
          min={0}
          max={10}
          label={(value) => `${value.toFixed(1)}x`}
          step={1}
          value={speed}
          mb={"xl"}
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

        <Select
          label="Simulation"
          placeholder="Pick Simulation"
          allowDeselect={false}
          data={controllers.map((c, i) => ({
            value: String(i),
            label: c.title(),
          }))}
          value={String(activeControllerIndex)}
          onChange={(v) => {
            if (v === null) {
              throw new Error("v was null");
            }

            setActiveControllerIndex(Number(v));
          }}
        />
        <Text mt="md">{world.glider.controller.description()}</Text>
      </Container>
      <div>
        <canvas
          ref={canvasRef}
          width={`${world.scaleToPixel(world.width)}px`}
          height={`${world.scaleToPixel(world.height)}px`}
          style={{ display: "block" }}
        ></canvas>
      </div>
    </Flex>
  );
};
