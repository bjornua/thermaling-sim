export interface GliderController {
  decideIsBanking(lift: number, elapsedTime: number): boolean;
  title(): string;
  description(): string;
  stateText(): string;
}

export class BankWhenLiftIsIncreasing implements GliderController {
  public previousLift = 0;
  public isBanking = false;

  decideIsBanking(lift: number): boolean {
    const liftChange = lift - this.previousLift;
    this.previousLift = lift;
    this.isBanking = liftChange > 0;
    return this.isBanking;
  }

  title() {
    return "Bank on Lift Gain";
  }

  description() {
    return "Bank when you feel lift? That's one way to leave a thermal — fast!";
  }

  stateText(): string {
    return this.isBanking ? "banking" : "notbanking";
  }
}

type BankDelayState =
  | { type: "banking" }
  | { type: "notbanking" }
  | { type: "holding"; elapsed: number };

export class BankWhenLiftIsDecreasingDelay implements GliderController {
  private previousLift: number = 0;
  private state: BankDelayState = { type: "notbanking" };

  updateState(lift: number, elapsedTime: number): BankDelayState {
    const liftChangeRage = (lift - this.previousLift) / elapsedTime;
    const liftIsDecreasing = liftChangeRage < 0;
    this.previousLift = lift;

    if (this.state.type === "holding") {
      if (this.state.elapsed <= 2) {
        return {
          type: "holding",
          elapsed: this.state.elapsed + elapsedTime,
        };
      }

      return { type: "notbanking" };
    }
    if (this.state.type === "banking") {
      if (liftIsDecreasing) {
        return this.state;
      }
      return { type: "holding", elapsed: 0 };
    }
    if (this.state.type === "notbanking") {
      if (liftIsDecreasing) {
        return { type: "banking" };
      }
      return this.state;
    }

    return this.state;
  }

  decideIsBanking(lift: number, elapsedTime: number): boolean {
    const newState = this.updateState(lift, elapsedTime);
    if (this.state.type !== newState.type) {
      console.log(newState.type);
    }
    this.state = newState;

    return this.state.type !== "notbanking";
  }

  title() {
    return `Hold Bank on Lift Gain`;
  }

  description() {
    return "Turn tight when the vario shows a drop in lift, but when it starts going up again, hold the turn for a couple more seconds to hug the thermal's core.";
  }

  stateText() {
    switch (this.state.type) {
      case "banking":
        return "banking";
      case "notbanking":
        return "notbanking";
      case "holding":
        return `holding(${this.state.elapsed.toFixed(2)}s)`;
    }
  }
}

export class BankWhenLiftIsDecreasing implements GliderController {
  public previousLift = 0;
  public isBanking = false;

  decideIsBanking(lift: number): boolean {
    const liftChange = lift - this.previousLift;
    this.previousLift = lift;
    this.isBanking = liftChange < 0;
    return this.isBanking;
  }

  title() {
    return "Bank on Lift Loss";
  }

  description() {
    return "Turn as soon as you feel/hear the lift dropping. You're basically chasing the core of the thermal.";
  }

  stateText(): string {
    return "notbanking";
  }
}

export class AlwaysBanking implements GliderController {
  decideIsBanking(): boolean {
    return true;
  }

  title() {
    return "Full Tilt";
  }

  description() {
    return "Who cares about the vario? Keep a steady 60° bank and hope you're in the thermal!";
  }

  stateText(): string {
    return "banking";
  }
}

export class NeverBanking implements GliderController {
  title(): string {
    return "No Banking (Only 40°)";
  }
  public previousLift = 0;

  decideIsBanking(): boolean {
    return false;
  }

  description() {
    return "Ignore the vario and maintain a 40° bank. You're not trying to center, just cruising along.";
  }

  stateText(): string {
    return "notbanking";
  }
}
