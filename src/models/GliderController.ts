export interface GliderController {
  reset(): void;
  update(lift: number, elapsedTime: number): number;
}

type AdaptiveBankingState = "increase" | "neutral" | "decrease";

export class AdaptiveBanking implements GliderController {
  public previousLift = 0;
  public activeState: AdaptiveBankingState = "neutral";

  constructor(
    public bankWhenGainingLift: number,
    public bankWhenNeutral: number,
    public bankWhenLoosingLift: number
  ) {}

  reset() {
    this.previousLift = 0;
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
}
