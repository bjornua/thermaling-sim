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
      <h1>Thermal Centering Simulations</h1>
      <p>
        Welcome to the Thermal Centering Simulations! These simulations aims to
        showcase various strategies for centering in thermals by relying solely
        on a variometer, which measures your vertical speed in real-time.
      </p>
      <ul>
        <li>
          <b>Not Banking</b>: In this context, "not banking" means maintaining a
          40-degree bank angle, which serves as the default or neutral state.
        </li>
        <li>
          <b>Banking</b>: When the glider decides to bank, it will switch to a
          60-degree bank angle, representing a more aggressive turn into the
          thermal.
        </li>
      </ul>
      <p>
        In the simulations, dots represent gliders circling within thermals. The
        objective is to understand how different banking decisions affect the
        glider's ability to stay within the thermal's core and gain altitude.
      </p>
      <div className="simulations">{worlds}</div>
    </div>
  );
}
