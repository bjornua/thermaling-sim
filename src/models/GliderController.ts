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

type ControllerState =
  | { kind: "WaitingForPeak"; lastTrend: VariometerTrend }
  | { kind: "Delaying"; degrees: number; elapsed: number }
  | { kind: "Banking"; degrees: number; elapsed: number };

export class LagCompensatingController implements GliderController {
  private state: ControllerState;
  private delayDuration = 5;
  private bankDuration = 13.8;
  public neutralBankAngle = 45;
  public fallingBankAngle = 30;

  constructor() {
    this.state = { kind: "WaitingForPeak", lastTrend: "neutral" };
  }

  reset() {
    this.state = { kind: "WaitingForPeak", lastTrend: "neutral" };
  }

  private updateState(glider: Glider, elapsedTime: number): void {
    const currentTrend = getLiftTrend(glider);

    switch (this.state.kind) {
      case "WaitingForPeak":
        if (this.state.lastTrend === "neutral") {
          this.state.lastTrend = currentTrend;
        }
        if (
          currentTrend !== "neutral" &&
          currentTrend !== this.state.lastTrend
        ) {
          this.state = {
            kind: "Delaying",
            degrees: this.fallingBankAngle,
            elapsed: 0,
          };
        }
        break;
      case "Delaying":
        if (this.state.elapsed >= this.delayDuration) {
          this.state = {
            kind: "Banking",
            degrees: this.state.degrees,
            elapsed: 0,
          };
        } else {
          this.state.elapsed += elapsedTime;
        }
        break;
      case "Banking":
        if (this.state.elapsed >= this.bankDuration) {
          this.state = { kind: "WaitingForPeak", lastTrend: currentTrend };
        } else {
          this.state.elapsed += elapsedTime;
        }
        break;
    }
  }

  update(glider: Glider, elapsedTime: number): number {
    this.updateState(glider, elapsedTime);

    switch (this.state.kind) {
      case "WaitingForPeak":
      case "Delaying":
        return this.neutralBankAngle;
      case "Banking":
        return this.state.degrees;
    }
  }
}
