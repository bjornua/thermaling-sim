import { Container, MantineProvider } from "@mantine/core";
import { TypographyStylesProvider } from "@mantine/core";
import { ThermalingSimulation } from "./components/ThermalingSimulation";
import { AdaptiveBanking } from "./models/GliderController";

export default function App() {
  return (
    <TypographyStylesProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Container size="sm">
          <h1>Navigating the Invisible: Understanding Thermal Soaring</h1>
          <p>
            Thermal soaring presents a fascinating yet challenging paradigm for
            aviators. Thermals, columns of rising air, are invisible, often
            requiring pilots to rely on indirect cues and sophisticated
            strategies to harness their lift. This webpage presents a guided
            walkthrough of strategies.
          </p>
          <h2>Level 1: Basic Awareness</h2>
          <p>
            At its most fundamental level, thermal soaring involves recognizing
            that you are in a thermal.
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(0, 0, 0)}
            duration={10000}
            x={0}
            y={150}
          />
          <p>
            Notice how as the glider passes through the thermal, the variometer
            is increasing as the glider is nearing the center, and then
            decreases again as continues through the thermal, until finally
            exiting it.
          </p>
          <h2>Level 2: Turning</h2>
          <p>
            Once a thermal is detected, an improvement to flying right through
            is to start banking at a fixed angle. That's it, you are now
            thermaling!
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(45, 45, 45)}
            duration={10000}
            x={150}
            y={150}
          />
          <p>
            The animation illustrates the immediate turn upon entering the
            thermal. Notice how the variometer is cycling between high and low
            as the glider makes its way around the thermal.
          </p>
          <h2>Level 3: First Attempt At Centering</h2>
          <p>
            To maximize the lift gained from a thermal, pilots aim to stay in
            its strongest core. This involves making adjustments to the turning
            radius and bank angle based on variometer readings and other sensory
            cues. The closer the glider is to the center, the more consistent
            and stronger the lift.
          </p>
          <p>
            An initial idea is to make adjustments by tightening the turn by
            increase the bank angle as the pilot notices the increase in lift.
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(60, 45, 45)}
            duration={10000}
            x={0}
            y={150}
          />
          <p>
            Notice how, counterintuitively, this strategy is actually a pretty
            reliable way of exiting the thermal!
          </p>
          <h2>Level 4: Centering in a Thermal</h2>
          <p>
            A better technique is to tighten the turn when the variometer
            indicates falling lift, as it suggests that the glider is nearing
            the edge of the thermal.
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(45, 45, 60)}
            duration={10000}
            x={0}
            y={150}
          />
          <p>
            The animation shows the glider adjusting its path based on the
            variometer readings, ensuring a more centered position in the
            thermal. As the lift decreases, the glider tightens its turn,
            successfully centering itself in the thermal.
          </p>
          <h2>Level 5: Widening and Tightening</h2>
          <p>
            For faster and more efficient centering, pilots can employ a
            combination of both widening and tightening their turns. When the
            lift increases, suggesting the glider is moving towards the
            thermal's center, the pilot can widen the turn. Conversely, when the
            lift decreases, indicating a move away from the center, the pilot
            should tighten the turn.
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(30, 45, 60)}
            duration={10000}
            x={0}
            y={150}
          />
          <p>
            The animation portrays this dynamic adjustment, demonstrating how a
            glider can quickly find and stay in the thermal's core by
            effectively widening and tightening its turns based on the lift
            experienced.
          </p>
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
    </TypographyStylesProvider>
  );
}
