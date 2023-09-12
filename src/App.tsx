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
          <h2>Table of Contents</h2>
          <ul>
            <li>
              <a href="#basic-awareness">Basic Awareness</a>
            </li>
            <li>
              <a href="#turning">Turning</a>
            </li>
            <li>
              <a href="#first-attempt">First Attempt At Centering</a>
            </li>
            <li>
              <a href="#centering">Centering in a Thermal</a>
            </li>
            <li>
              <a href="#widening-tightening">Widening and Tightening</a>
            </li>
            <li>
              <a href="#caveats">Caveats and Considerations</a>
            </li>
          </ul>
          <p>
            Thermal soaring presents a fascinating yet challenging paradigm for
            aviators. Thermals, columns of rising air, are invisible, often
            requiring pilots to rely on indirect cues and sophisticated
            strategies to harness their lift. This webpage presents a guided
            walkthrough of strategies.
          </p>
          <h2 id="basic-awareness">Basic Awareness</h2>
          <p>
            At its most fundamental level, thermal soaring involves recognizing
            that you are in a thermal.
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(0, 0, 0)}
            duration={25}
            x={0}
            y={150}
          />
          <p>
            Notice how as the glider passes through the thermal, the variometer
            is increasing as the glider is nearing the center, and then
            decreases again as continues through the thermal, until finally
            exiting it.
          </p>
          <h2 id="turning">Turning</h2>
          <p>
            Once a thermal is detected, an improvement to flying right through
            is to start banking at a fixed angle. That's it, you are now
            thermaling!
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(45, 45, 45)}
            duration={60}
            x={150}
            y={150}
          />
          <p>
            The animation illustrates the immediate turn upon entering the
            thermal. Notice how the variometer is cycling between high and low
            as the glider makes its way around the thermal.
          </p>
          <h2 id="first-attempt">First Attempt At Centering</h2>
          <p>
            To maximize the lift gained from a thermal, pilots aim to stay in
            its strongest core. This involves making adjustments to the turning
            radius and bank angle based on variometer readings and other sensory
            cues. The closer the glider is to the center, the more consistent
            and stronger the lift.
          </p>
          <p>
            An initial idea is to make adjustments by{" "}
            <strong>tightening the turn</strong> by increase the bank angle as
            the pilot notices the <strong>increase in lift.</strong>
          </p>
          <p>
            Pay close attention to the timing of when the bank is increased.
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(60, 45, 45)}
            duration={40}
            x={200}
            y={200}
          />
          <p>
            If you click "Reveal thermal?", you'll notice how,
            counterintuitively, this strategy is actually a pretty reliable way
            of exiting the thermal!
          </p>
          <h2 id="centering">Centering in a Thermal</h2>
          <p>
            A better technique is to tighten the turn when the variometer
            indicates <strong>falling lift</strong>, as it suggests that the
            glider is nearing the edge of the thermal.
          </p>
          <ThermalingSimulation
            controller={new AdaptiveBanking(45, 45, 60)}
            duration={80}
            x={0}
            y={150}
          />
          <p>
            The animation shows the glider adjusting its path based on the
            variometer readings, ensuring a more centered position in the
            thermal. As the lift decreases, the glider tightens its turn,
            successfully centering itself in the thermal.
          </p>
          <h2 id="widening-tightening">Widening and Tightening</h2>
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
            duration={80}
            x={0}
            y={150}
          />
          <p>
            The animation portrays this dynamic adjustment, demonstrating how a
            glider can quickly find and stay in the thermal's core by
            effectively widening and tightening its turns based on the lift
            experienced.
          </p>

          <h2 id="caveats">Caveats and Considerations</h2>
          <p>
            The simulation is designed to provide a basic introduction to the
            principles of thermal soaring. However, it's a greatly simplified
            representation of real-world thermals. In reality, thermals can vary
            significantly in their characteristics and shapes, influenced by
            factors like terrain and weather.
          </p>
          <p>
            In the real world, you'll find that the variometer might momentarily
            respond to various disturbances that aren't necessarily thermals.
            Therefore, it's a good idea to exercise patience and consider moving
            on if you don't experience any lift.
          </p>
          <p>
            Moreover, while the variometer in the simulation reacts instantly,
            real-world variometers may have a lag of several seconds, adding
            another dimension of complexity.
          </p>
          <p>
            Overall, while theories and simulations are informative, there's no
            substitute for hands-on experience.
          </p>
          <p>
            The source code for these simulations is publicly available here:{" "}
            <a href="https://github.com/bjornua/thermaling-sim">
              https://github.com/bjornua/thermaling-sim
            </a>
          </p>
        </Container>
      </MantineProvider>
    </TypographyStylesProvider>
  );
}
