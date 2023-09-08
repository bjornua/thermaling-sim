import { Container, MantineProvider } from "@mantine/core";
import { Canvas } from "./components/Canvas";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container size="sm">
        <h1>Thermal Centering</h1>
        <div className="simulations">
          <Canvas />
          <div className="buttons"></div>
        </div>
        <p>
          Welcome to the Thermal Centering Simulations! These simulations aims
          to showcase various strategies for centering in thermals by relying
          solely on a variometer, which measures your vertical speed in
          real-time.
        </p>
        <ul>
          <li>
            <b>Not Banking</b>: In this context, "not banking" means maintaining
            a 40-degree bank angle, which serves as the default or neutral
            state.
          </li>
          <li>
            <b>Banking</b>: When the glider decides to bank, it will switch to a
            60-degree bank angle, representing a more aggressive turn into the
            thermal.
          </li>
        </ul>
        <p>
          In the simulations, dots represent gliders circling within thermals.
          The objective is to understand how different banking decisions affect
          the glider's ability to stay within the thermal's core and gain
          altitude.
        </p>
        <p>
          The source code is freely available here:{" "}
          <a href="https://github.com/bjornua/thermaling-sim">
            https://github.com/bjornua/thermaling-sim
          </a>
        </p>
      </Container>
    </MantineProvider>
  );
}
