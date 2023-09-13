/**
 * Linearly interpolates between two values.
 *
 * @param a - The starting value.
 * @param b - The ending value.
 * @param t - The interpolation factor. (0 <= t <= 1)
 */
function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

class CircularBuffer<T> {
  private buffer: (null | T)[] = [];
  private currentIndex: number = 0;

  constructor(size: number) {
    this.buffer = new Array(size).fill(null);
  }

  advance(): void {
    this.currentIndex = (this.currentIndex + 1) % this.buffer.length;
  }

  set(value: T): void {
    this.buffer[this.currentIndex] = value;
  }

  add(value: T): void {
    this.set(value);
    this.advance();
  }

  getRelative(index: number): T | null {
    const actualIndex =
      (this.currentIndex + index + this.buffer.length) % this.buffer.length;
    return this.buffer[actualIndex];
  }
}

export default class Variometer {
  private readonly bufferSize: number = 200;
  private buffer = new CircularBuffer<{
    cumulativeTime: number;
    lift: number;
  }>(this.bufferSize);
  private cumulativeTime: number = 0;

  constructor(public variolag: number) {}

  public reset(): void {
    this.cumulativeTime = 0;
    this.buffer = new CircularBuffer(this.bufferSize);
  }

  addLiftValue(lift: number, elapsedTime: number): void {
    this.cumulativeTime += elapsedTime;
    this.buffer.set({ cumulativeTime: this.cumulativeTime, lift });

    const last = this.buffer.getRelative(-1);
    if (last === null || last.cumulativeTime + 0.1 < this.cumulativeTime) {
      this.buffer.advance();
    }
  }

  getLiftChangeOverTime(duration: number): number {
    const startTime = this.cumulativeTime - duration - this.variolag;
    const initialLiftValue = this.getLiftValueAtTime(startTime);
    const endLiftValue = this.getLiftValueWithDelay();

    return endLiftValue - initialLiftValue;
  }

  getLiftValueWithDelay(): number {
    const targetTime = this.cumulativeTime - this.variolag;
    return this.getLiftValueAtTime(targetTime);
  }

  private getLiftValueAtTime(targetTime: number): number {
    let current: { cumulativeTime: number; lift: number } | null = null;
    let next: { cumulativeTime: number; lift: number } | null = null;
    for (let i = 0; i > -this.bufferSize; i--) {
      current = this.buffer.getRelative(i);
      next = this.buffer.getRelative(i - 1);

      if (!current || !next) continue;

      if (current.cumulativeTime >= targetTime) {
        return current.lift;
      }

      if (
        next.cumulativeTime <= targetTime &&
        current.cumulativeTime > targetTime
      ) {
        const weight =
          (targetTime - next.cumulativeTime) /
          (current.cumulativeTime - next.cumulativeTime);

        return lerp(next.lift, current.lift, weight);
      }
    }

    return 0;
  }
}
