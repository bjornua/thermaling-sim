import { useEffect, useState } from "react";
import { World } from "../models/World";

type ThermalInfoProps = {
  world: World;
};

export const ThermalInfo = ({ world }: ThermalInfoProps) => {
  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 100);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div>
      {world.gliders.map((glider, index) => (
        <div key={index}>
          Glider {index + 1} - Lift:{" "}
          {world.thermal.calculateLift(glider.x, glider.y).toFixed(1)} m/s, Turn
          Rate: {glider.turnRate}
        </div>
      ))}
    </div>
  );
};
