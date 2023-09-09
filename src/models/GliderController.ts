export interface GliderController {
  update(lift: number, elapsedTime: number): number;
  rules(): [boolean, string][];
}

type AdaptiveBankingState = "increase" | "neutral" | "decrease";

export class AdaptiveBanking implements GliderController {
  public previousLift = 0;
  public activeState: AdaptiveBankingState;

  constructor(
    public bankWhenGainingLift: number,
    public bankWhenNeutral: number,
    public bankWhenLoosingLift: number
  ) {
    // Initialize the activeState to 'neutral' or any other suitable default
    this.activeState = "neutral";
  }

  private updateState(lift: number, elapsedTime: number): void {
    if (elapsedTime === 0) {
      this.activeState = "neutral";
      return;
    }

    const liftChangeRate = (lift - this.previousLift) / elapsedTime;

    if (liftChangeRate > 0.05) {
      this.activeState = "increase";
    } else if (liftChangeRate < -0.05) {
      this.activeState = "decrease";
    } else {
      this.activeState = "neutral";
    }
  }

  update(lift: number, elapsedTime: number): number {
    this.updateState(lift, elapsedTime);
    this.previousLift = lift;

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

  rules(): [boolean, string][] {
    return [
      [
        "increase" === this.activeState,
        `When gaining lift, bank ${this.bankWhenGainingLift}`,
      ],
      [
        "neutral" === this.activeState,
        `When lift stays the same, bank ${this.bankWhenNeutral}`,
      ],
      [
        "decrease" === this.activeState,
        `When losing lift, bank ${this.bankWhenLoosingLift}`,
      ],
    ];
  }
}
