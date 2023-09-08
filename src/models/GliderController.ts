export interface GliderController {
  update(lift: number, elapsedTime: number): number;
  title(): string;
  description(): string;
  stateText(): string;
}

export class BankOnIncreasingLift implements GliderController {
  public previousLift = 0;

  constructor(public neutralBank: number, public turningBank: number) {}

  update(lift: number, elapsedTime: number): number {
    if (elapsedTime === 0) {
      return this.neutralBank;
    }
    const liftChangeRate = (lift - this.previousLift) / elapsedTime;
    this.previousLift = lift;

    return liftChangeRate > 0 ? this.turningBank : this.neutralBank;
  }

  title(): string {
    return `Turn ${this.turningBank}° when lift is increasing, ${this.neutralBank}° otherwise`;
  }

  description(): string {
    return this.title();
  }

  stateText(): string {
    return "increasing";
  }
}

export class BankOnDecreasingLift implements GliderController {
  public previousLift = 0;

  constructor(public neutralBank: number, public turningBank: number) {}

  update(lift: number, elapsedTime: number): number {
    if (elapsedTime === 0) {
      return this.neutralBank;
    }
    const liftChangeRate = (lift - this.previousLift) / elapsedTime;
    this.previousLift = lift;

    return liftChangeRate < 0 ? this.turningBank : this.neutralBank;
  }

  title(): string {
    return `Turn ${this.turningBank}° when lift is decreasing, ${this.neutralBank}° otherwise`;
  }

  description(): string {
    return this.title();
  }

  stateText(): string {
    return "decreasing";
  }
}

type BankDelayState =
  | { type: "neutral" }
  | { type: "turning" }
  | { type: "holding"; elapsed: number };

export class BankOnDecreasingLiftDelay implements GliderController {
  private previousLift: number = 0;
  private state: BankDelayState = { type: "neutral" };

  constructor(public neutralBank: number, public turningBank: number) {}

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

      return { type: "neutral" };
    }
    if (this.state.type === "turning") {
      if (liftIsDecreasing) {
        return this.state;
      }
      return { type: "holding", elapsed: 0 };
    }
    if (this.state.type === "neutral") {
      if (liftIsDecreasing) {
        return { type: "turning" };
      }
      return this.state;
    }

    return this.state;
  }

  update(lift: number, elapsedTime: number): number {
    const newState = this.updateState(lift, elapsedTime);
    if (this.state.type !== newState.type) {
      console.log(newState.type);
    }
    this.state = newState;

    return this.state.type !== "neutral" ? this.turningBank : this.neutralBank;
  }

  title() {
    return `Delayed Hold: ${this.neutralBank}° to ${this.turningBank}° (Lift Gain)`;
  }

  description() {
    return "Turn tight when the vario shows a drop in lift, but when it starts going up again, hold the turn for a couple more seconds to hug the thermal's core.";
  }

  stateText() {
    switch (this.state.type) {
      case "turning":
        return "turning";
      case "neutral":
        return "neutral";
      case "holding":
        return `holding(${this.state.elapsed.toFixed(2)}s)`;
    }
  }
}

export class AlwaysBanking implements GliderController {
  constructor(public turningBank: number) {}

  update(): number {
    return this.turningBank;
  }

  title() {
    return `Constant Bank: ${this.turningBank}°`;
  }

  description() {
    return `Who cares about the vario? Keep a steady ${this.turningBank}° bank and hope you're in the thermal!`;
  }

  stateText(): string {
    return "banking";
  }
}

export class NeverBanking implements GliderController {
  constructor(public neutralBank: number) {}

  title(): string {
    return `Constant Bank: ${this.neutralBank}°`;
  }
  public previousLift = 0;

  update(): number {
    return this.neutralBank;
  }

  description() {
    return `Ignore the vario and maintain a ${this.neutralBank}° bank. You're not trying to center, just cruising along.`;
  }

  stateText(): string {
    return "notbanking";
  }
}
