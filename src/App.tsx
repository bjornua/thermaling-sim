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
            We explore various strategies for centering in thermals, relying
            solely on output of the variometer. It's worth noting that in
            real-world applications, glider pilots may also sense changes in
            lift through change in acceleration.
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
