export type BankingStrategy = (liftChange: number) => boolean;

export class GliderController {
  public previousLift = 0;

  constructor(private bankingStrategy: BankingStrategy) {}

  decideTurnRate(lift: number): number {
    const liftChange = lift - this.previousLift;
    const isBanking = this.bankingStrategy(liftChange);
    this.previousLift = lift;
    return isBanking ? 15 : 25;
  }
}
