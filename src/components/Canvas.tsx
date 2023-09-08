import { useRef, useEffect, useMemo } from "react";

import { World } from "../models/World";
import { useState } from "react";
import { Slider, Text } from "@mantine/core";
import { Thermal } from "../models/Thermal";
import {
  BankWhenLiftIsDecreasing,
  BankWhenLiftIsDecreasingDelay,
  BankWhenLiftIsIncreasing,
  AlwaysBanking,
  NeverBanking,
} from "../models/GliderController";
import { Glider } from "../models/Glider";
import { Flex, Select } from "@mantine/core";

let loops = 0;

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeControllerIndex, setActiveControllerIndex] = useState(0);
  const [speed, setSpeed] = useState(1);

  const controllers = useMemo(
    () => [
      new NeverBanking(),
      new AlwaysBanking(),
      new BankWhenLiftIsIncreasing(),
      new BankWhenLiftIsDecreasing(),
      new BankWhenLiftIsDecreasingDelay(),
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
      <div>
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
        <>
          <Text>Simulation Speed</Text>
          <Slider
            defaultValue={1}
            min={0}
            max={10}
            label={(value) => `${value.toFixed(1)}x`}
            step={1}
            value={speed}
            onChange={(s) => {
              setSpeed(s);
            }}
            // styles={{ markLabel: { display: "none" } }}
            marks={[
              { value: 1, label: "1.0x" },
              { value: 2, label: "2.0x" },
              { value: 5, label: "5.0x" },
              { value: 10, label: "10.0x" },
            ]}
          />
        </>
        <p>{world.glider.controller.description()}</p>
      </div>
      <div>
        <canvas
          ref={canvasRef}
          width={`${world.scaleToPixel(world.width)}px`}
          height={`${world.scaleToPixel(world.height)}px`}
        ></canvas>
      </div>
    </Flex>
  );
};
