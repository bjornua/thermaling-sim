import Variometer from "./Variometer";

export interface GliderController {
  reset(): void;
  update(variometer: Variometer): number;
}

type AdaptiveBankingState = "increase" | "neutral" | "decrease";
export class AdaptiveBanking implements GliderController {
  public activeState: AdaptiveBankingState = "neutral";

  constructor(
    public bankWhenGainingLift: number,
    public bankWhenNeutral: number,
    public bankWhenLoosingLift: number
  ) {}

  reset() {
    this.activeState = "neutral";
  }

  private updateState(variometer: Variometer): void {
    const liftChangeOverTime = variometer.getLiftChangeOverTime(1);

    if (liftChangeOverTime > 0.05) {
      this.activeState = "increase";
    } else if (liftChangeOverTime < -0.05) {
      this.activeState = "decrease";
    } else {
      this.activeState = "neutral";
    }
  }

  update(variometer: Variometer): number {
    this.updateState(variometer);

    switch (this.activeState) {
      case "increase":
        return this.bankWhenGainingLift;
      case "decrease":
        return this.bankWhenLoosingLift;
      case "neutral":
        return this.bankWhenNeutral;
      default:
        throw new Error(`Invalid state: ${this.activeState}`);
    }
  }
}
