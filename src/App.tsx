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
        <div>
          <p>
            This overhead simulation is designed to explore various strategies
            for centering in thermals, relying solely on output of the
            variometer for real-time vertical speed measurements. It's worth
            noting that in real-world applications, glider pilots may also sense
            changes in lift through change in acceleration.
          </p>
          <p>
            In the simulation, the dot represents a glider maneuvering within a
            thermal column. The primary objective is to visualize how differing
            banking strategies affect the glider's ability to maintain
            positioning within the thermal's core and maximizing altitude gain.
          </p>
          <p>
            The source code for these simulations is publicly available here:{" "}
            <a href="https://github.com/bjornua/thermaling-sim">
              https://github.com/bjornua/thermaling-sim
            </a>
          </p>
        </div>
      </Container>
    </MantineProvider>
  );
}
