import { Glider } from "./models/Glider";
import { Canvas } from "./components/Canvas";
import { World } from "./models/World";
import { Thermal } from "./models/Thermal";
import {
  BankWhenLiftIsDecreasing,
  BankWhenLiftIsDecreasingDelay,
  BankWhenLiftIsIncreasing,
  AlwaysBanking,
  NeverBanking,
} from "./models/GliderController";

export default function App() {
  const thermal = new Thermal(300, 300, 5, 250);

  const gliders = [
    new NeverBanking(),
    new AlwaysBanking(),
    new BankWhenLiftIsIncreasing(),
    new BankWhenLiftIsDecreasing(),
    new BankWhenLiftIsDecreasingDelay(),
  ];

  const worlds = gliders.map(function (glider) {
    return (
      <Canvas
        world={
          new World(600, 600, thermal, new Glider(150, 150, "#00F", glider))
        }
      />
    );
  });

  return (
    <div>
      <h1>Thermal Centering Simulation</h1>
      <p>
        Simulating different techniques for centering in thermals, by only using
        variometer, meaning the current vertical speed. The dots represent
        gliders circling in a thermals. The gliders can decide between
        "notbanking" (which in this case means banking 40 degrees), and banking
        60° degrees.
      </p>
      <div className="simulations">{worlds}</div>
    </div>
  );
}
