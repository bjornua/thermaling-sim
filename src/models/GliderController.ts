import { Glider } from "./Glider";

export interface GliderController {
  reset(): void;
  update(glider: Glider, elapsedTime: number): number;
}

type VariometerTrend = "increasing" | "neutral" | "decreasing";

function getLiftTrend(glider: Glider): VariometerTrend {
  const liftChangeOverTime = glider.variometer.getLiftChangeOverTime(0.5);

  if (liftChangeOverTime > 0.05) {
    return "increasing";
  }
  if (liftChangeOverTime < -0.05) {
    return "decreasing";
  }

  return "neutral";
}

export class AdaptiveBanking implements GliderController {
  constructor(
    public bankWhenGainingLift: number,
    public bankWhenNeutral: number,
    public bankWhenLoosingLift: number
  ) {}

  reset() {}

  update(glider: Glider): number {
    switch (getLiftTrend(glider)) {
      case "increasing":
        return this.bankWhenGainingLift;
      case "decreasing":
        return this.bankWhenLoosingLift;
      case "neutral":
        return this.bankWhenNeutral;
    }
  }
}

const varioLag = 3;
const turnRate30 = 13.0;
const turnRate45 = 22.5;
const bankDurationHdg = 45;
const delayDurationHdg =
  180 - varioLag * turnRate45 + (180 - bankDurationHdg) / 2;

const bankDuration = bankDurationHdg / turnRate30;
const delayDuration = delayDurationHdg / turnRate45;

type ControllerState =
  | { kind: "WaitingForPeak"; lastTrend: VariometerTrend }
  | { kind: "Delaying"; degrees: number; elapsed: number }
  | { kind: "Banking"; degrees: number; elapsed: number };

export class LagCompensatingController implements GliderController {
  private state: ControllerState;

  public neutralBankAngle = 45;
  public fallingBankAngle = 30;

  constructor() {
    this.state = { kind: "WaitingForPeak", lastTrend: "neutral" };
  }

  reset() {
    this.state = { kind: "WaitingForPeak", lastTrend: "neutral" };
  }

  private updateState(glider: Glider, elapsedTime: number): ControllerState {
    const { state } = this;
    switch (state.kind) {
      case "WaitingForPeak": {
        const currentTrend = getLiftTrend(glider);
        if (currentTrend === "decreasing") {
          // If the lift trend is decreasing, and it was previously increasing, then delay for a short period of time before banking.
          if (state.lastTrend === "increasing") {
            return {
              kind: "Delaying",
              degrees: this.fallingBankAngle,
              elapsed: 0,
            };
          }
          // If the lift trend is decreasing, and it was previously neutral, then wait for another peak before banking.
          if (state.lastTrend === "neutral") {
            return { kind: "WaitingForPeak", lastTrend: "decreasing" };
          }
        }
        // If the lift trend is increasing, then wait for another peak before banking.
        if (currentTrend === "increasing") {
          return { kind: "WaitingForPeak", lastTrend: "increasing" };
        }

        return state;
      }

      // If the state is currently delaying, then check whether enough time has passed to bank.
      case "Delaying": {
        if (state.elapsed >= delayDuration) {
          return { kind: "Banking", degrees: state.degrees, elapsed: 0 };
        } else {
          // If not enough time has passed, then continue delaying.
          return {
            kind: "Delaying",
            degrees: state.degrees,
            elapsed: state.elapsed + elapsedTime,
          };
        }
      }

      // If the state is currently banking, then check whether enough time has passed to unbank.
      case "Banking": {
        const currentTrend = getLiftTrend(glider);
        if (state.elapsed >= bankDuration) {
          return { kind: "WaitingForPeak", lastTrend: currentTrend };
        } else {
          // If not enough time has passed, then continue banking.
          return {
            kind: "Banking",
            degrees: state.degrees,
            elapsed: state.elapsed + elapsedTime,
          };
        }
      }
    }
  }

  update(glider: Glider, elapsedTime: number): number {
    this.state = this.updateState(glider, elapsedTime);

    switch (this.state.kind) {
      case "WaitingForPeak":
      case "Delaying":
        return this.neutralBankAngle;
      case "Banking":
        return this.state.degrees;
    }
  }
}
