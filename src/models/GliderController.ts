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

    return liftChangeRate > 0.025 ? this.turningBank : this.neutralBank;
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

    return liftChangeRate < -0.025 ? this.turningBank : this.neutralBank;
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

export class AdaptiveBanking implements GliderController {
  public previousLift = 0;

  constructor(
    public tightTurnBank: number,
    public neutralBank: number,
    public wideTurnBank: number
  ) {}

  update(lift: number, elapsedTime: number): number {
    if (elapsedTime === 0) {
      return this.neutralBank;
    }

    const liftChangeRate = (lift - this.previousLift) / elapsedTime;
    this.previousLift = lift;

    if (liftChangeRate > 0.05) {
      return this.tightTurnBank;
    } else if (liftChangeRate < -0.05) {
      return this.wideTurnBank;
    } else {
      return this.neutralBank;
    }
  }

  title(): string {
    return `Adaptive Banking: ${this.tightTurnBank}° tight, ${this.neutralBank}° neutral, ${this.wideTurnBank}° wide`;
  }

  description(): string {
    return `This strategy employs an adaptive banking angle depending on the rate of change in lift. Tight turns are executed when lift increases rapidly, wide turns when it decreases, and neutral banking otherwise.`;
  }

  stateText(): string {
    return "adaptive";
  }
}
