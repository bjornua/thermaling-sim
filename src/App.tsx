import { Container, MantineProvider } from "@mantine/core";
import { TypographyStylesProvider } from "@mantine/core";
import { SingleGliderSimulation } from "./components/SingleGliderSimulation";
import { ThreeGlidersSimulation } from "./components/ThreeGlidersSimulation";
import {
  AdaptiveBanking,
  LagCompensatingController,
} from "./models/GliderController";
import { World } from "./models/World";
import { Thermal } from "./models/Thermal";
import { Glider } from "./models/Glider";

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
            strategies to harness their lift. This webpage presents an attempt
            of demystifying the dynamics at play and centering strategies. The
            animations are live simulations based on a simple thermal and
            gliding model.
          </p>
          <h2 id="basic-awareness">Basic Awareness</h2>
          <p>
            At its most fundamental level, thermal soaring involves recognizing
            that you are in a thermal.
          </p>
          <SingleGliderSimulation
            controller={new AdaptiveBanking(0, 0, 0)}
            duration={25}
            x={100}
            y={150}
            variolag={0}
            alwaysRenderOverheadView={false}
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
          <SingleGliderSimulation
            controller={new AdaptiveBanking(45, 45, 45)}
            duration={60}
            x={150}
            y={150}
            variolag={0}
            alwaysRenderOverheadView={false}
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
          <SingleGliderSimulation
            controller={new AdaptiveBanking(60, 45, 45)}
            duration={40}
            x={200}
            y={200}
            variolag={0}
            alwaysRenderOverheadView={false}
          />
          <p>
            If you click "Reveal thermal?", you'll notice how,
            counterintuitively, this strategy is actually a pretty reliable way
            of exiting the thermal!
          </p>
          <h2 id="centering">Centering in a Thermal</h2>
          <p>
            A better technique is to widen the turn when the variometer
            indicates <strong>rising lift</strong>, as it suggests that the
            glider is nearing going towards the core of the thermal.
          </p>
          <SingleGliderSimulation
            controller={new AdaptiveBanking(30, 45, 45)}
            duration={80}
            x={100}
            y={150}
            variolag={0}
            alwaysRenderOverheadView={false}
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
          <SingleGliderSimulation
            controller={new AdaptiveBanking(30, 45, 60)}
            duration={80}
            x={100}
            y={150}
            variolag={0}
            alwaysRenderOverheadView={false}
          />
          <p>
            The animation portrays this dynamic adjustment, demonstrating how a
            glider can quickly find and stay in the thermal's core by
            effectively widening and tightening its turns based on the lift
            experienced.
          </p>
          <h2 id="vario-lag">Variometer Lag</h2>
          <p>
            Variometer lag refers to the delay between an actual change in
            vertical speed and the moment the variometer displays this change.
            This lag can arise due to inherent mechanical or electronic delays
            in the device or designed response times to filter out short-term
            fluctuations. In essence, variometer lag means that the readings
            reflect past changes in altitude, not immediate ones, potentially
            affecting a pilot's real-time decisions based on the instrument's
            output.
          </p>
          <p>
            The following simulations shows the widening and tightening
            technique, but introduces various amounts of lag from left to right.
            The lag for each glider is: 0, 1 and 3 seconds respectively.
          </p>
          <ThreeGlidersSimulation
            world={
              new World(600, 600, new Thermal(300, 300, 5, 250), [
                new Glider(
                  100,
                  150,
                  "#00F",
                  0,
                  new AdaptiveBanking(30, 45, 60)
                ),
                new Glider(
                  100,
                  150,
                  "#00F",
                  1,
                  new AdaptiveBanking(30, 45, 60)
                ),
                new Glider(
                  100,
                  150,
                  "#00F",
                  3,
                  new AdaptiveBanking(30, 45, 60)
                ),
              ])
            }
            duration={120}
          />
          <p>
            As demonstrated, variometer lag has significant impact on the
            ability to easily and efficiently center in thermals using the
            variometer alone.
          </p>

          <h2>Dealing With Vario Lag</h2>

          <h3>Your Toolbox: Two Bank Angles</h3>

          <p>
            To get started, let's understand the two bank angles you'll use:
            <ul>
              <li>
                A standard bank angle of 45°, which results in a turn rate of
                22.5°/s when flying at a speed of 90 km/h.
              </li>
              <li>
                A gentler bank angle of 30°, which gives you a turn rate of
                13.0°/s at the same speed.
              </li>
            </ul>
          </p>

          <h3>The Challenge: Vario Lag</h3>

          <p>
            The variometer typically has a lag of around 3 seconds. This means
            that when you notice the lift is going up or down, the actual change
            occurred 3 seconds—or 67.5°—ago.
          </p>

          <h3>The Pitfall: Late Reaction to Rising Lift</h3>

          <p>
            If you wait until the variometer shows rising lift, you're already
            67.5° late. This leaves you with just 45°, or approximately 2
            seconds, to adjust position in the remaining half-circle. That's
            hardly enough time to optimize your position.
          </p>

          <h3>The Strategy: Timing Your Turn on Falling Lift</h3>

          <p>
            Here's what you can do: When you notice the lift is falling,
            continue your turn for the remaining 112.5°, which will take about 5
            seconds. Then, switch to a gentler 30° bank angle for 13.8 seconds.
            This will help you make the most of the thermal's lift and get you
            centered effectively.
          </p>
          <p>
            <SingleGliderSimulation
              controller={new LagCompensatingController()}
              duration={180}
              x={100}
              y={150}
              variolag={3}
              alwaysRenderOverheadView={false}
            />
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
            Overall, while theories and simulations are informative, there's no
            substitute for hands-on experience.
          </p>
          <p>
            The source code for these simulations is publicly available here:{" "}
            <a href="https://github.com/bjornua/thermaling-sim">
              https://github.com/bjornua/thermaling-sim
            </a>
          </p>
          <h1>Further reading</h1>
          <ul>
            <li>
              <a href="https://members.gliding.co.uk/wp-content/uploads/sites/3/2017/08/6-24-THERMALLING-2017.pdf">
                https://members.gliding.co.uk/wp-content/uploads/sites/3/2017/08/6-24-THERMALLING-2017.pdf
              </a>
            </li>
          </ul>
        </Container>
      </MantineProvider>
    </TypographyStylesProvider>
  );
}
