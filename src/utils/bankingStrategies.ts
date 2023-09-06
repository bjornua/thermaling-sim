import { BankingStrategy } from "../models/Glider";

export const bankWhenLiftIsIncreasing: BankingStrategy = (liftChange) =>
  liftChange > 0;
export const bankWhenLiftIsDecreasing: BankingStrategy = (liftChange) =>
  liftChange <= 0;
