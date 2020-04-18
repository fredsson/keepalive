
export class Calendar {
  private unixTime: number;

  constructor() {
    this.unixTime = 1577836800000;
  }

  public tick(dt: number) {
    this.unixTime += dt;
  }

  public get currentDate(): string {
    return new Date(this.unixTime).toLocaleString();
  }
}