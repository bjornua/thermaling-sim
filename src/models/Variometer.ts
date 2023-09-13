export default class Variometer {
  private buffer: { cumulativeTime: number; lift: number }[] = [];
  private readonly interval: number = 0 / 0.05;
  private cumulativeTime: number = 0;
  private lastRecordedTime: number = 0;

  constructor(public variolag: number) {}

  addLiftValue(lift: number, elapsedTime: number): void {
    this.cumulativeTime += elapsedTime;

    if (this.cumulativeTime - this.lastRecordedTime >= this.interval) {
      this.buffer.push({ cumulativeTime: this.cumulativeTime, lift });
      this.lastRecordedTime = this.cumulativeTime;
    }

    const oldestRelevantTime = this.cumulativeTime - 10;
    while (
      this.buffer.length > 0 &&
      this.buffer[0].cumulativeTime < oldestRelevantTime
    ) {
      this.buffer.shift();
    }
  }

  getLiftChangeOverTime(duration: number): number {
    if (this.buffer.length === 0) {
      return 0;
    }

    // Find the start time for the duration we want to measure
    const startTime = this.cumulativeTime - duration - this.variolag;

    // Get the value of lift at the start of the duration using the variolag
    const initialLiftValue = this.getLiftValueAtTime(startTime);

    // Get the value of lift at the end of the duration using the variolag
    const endLiftValue = this.getLiftValueWithDelay();

    return endLiftValue - initialLiftValue;
  }

  getLiftValueWithDelay(): number {
    const targetTime = this.cumulativeTime - this.variolag;
    return this.getLiftValueAtTime(targetTime);
  }

  // This helper function gets the lift value at a specific time considering lerp
  private getLiftValueAtTime(targetTime: number): number {
    // If the buffer is empty or the oldest data in the buffer is newer than the target time, return 0.
    if (
      this.buffer.length === 0 ||
      this.buffer[0].cumulativeTime > targetTime
    ) {
      return 0;
    }

    let indexBeforeTarget: number | null = null;
    let indexAfterTarget: number | null = null;

    // Search for the indices just before and after the target time
    for (let i = this.buffer.length - 1; i >= 0; i--) {
      if (this.buffer[i].cumulativeTime <= targetTime) {
        indexBeforeTarget = i;
        indexAfterTarget = i + 1;
        break;
      }
    }

    // If we have only one value in the buffer, return it
    if (this.buffer.length === 1) {
      return this.buffer[0].lift;
    }

    // If target time is earlier than the first value in the buffer
    if (indexAfterTarget === null) {
      return this.buffer[0].lift;
    }

    // If indexBeforeTarget is null, then there's a logic flaw. Return a default value.
    if (indexBeforeTarget === null) {
      return 0;
    }

    // If indexBeforeTarget points to the last index or indexAfterTarget is out of bounds
    if (
      indexBeforeTarget === this.buffer.length - 1 ||
      indexAfterTarget >= this.buffer.length
    ) {
      return this.buffer[indexBeforeTarget].lift;
    }

    // Linear interpolation (lerp)
    const weight =
      (targetTime - this.buffer[indexBeforeTarget].cumulativeTime) /
      (this.buffer[indexAfterTarget].cumulativeTime -
        this.buffer[indexBeforeTarget].cumulativeTime);
    return (
      this.buffer[indexBeforeTarget].lift +
      weight *
        (this.buffer[indexAfterTarget].lift -
          this.buffer[indexBeforeTarget].lift)
    );
  }
}
