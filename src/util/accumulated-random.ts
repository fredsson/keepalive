
export class AccumulatedRandom {
  private accumulator: number = 0;
  constructor(private baseChance: number) {
    this.accumulator = this.baseChance;
  }

  public roll(): boolean {
    const value = Math.random();

    if (value < this.accumulator) {
      this.accumulator = this.baseChance;
      return true;
    }

    this.accumulator += this.baseChance;
    return false;
  }
}