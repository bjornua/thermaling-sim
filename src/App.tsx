import "./App.css";
import { Glider } from "./models/Glider";
import {
  bankWhenLiftIsIncreasing,
  bankWhenLiftIsDecreasing,
} from "./utils/bankingStrategies";
import { Canvas } from "./components/Canvas";
import { ThermalInfo } from "./components/ThermalInfo";
import { World } from "./models/World";
import { Thermal } from "./models/Thermal";
import { GliderController } from "./models/GliderController";

export default function App() {
  const thermal = new Thermal(300, 300, 5, 300);
  const gliders = [
    new Glider(
      300,
      200,
      "#00f",
      new GliderController(bankWhenLiftIsIncreasing)
    ),
    new Glider(
      250,
      150,
      "#0f0",
      new GliderController(bankWhenLiftIsDecreasing)
    ),
  ];

  const world = new World(600, 600, thermal, gliders);

  return (
    <div>
      <h1>Thermal Centering Simulation</h1>
      <ThermalInfo world={world} />
      <Canvas world={world} />
    </div>
  );
}
