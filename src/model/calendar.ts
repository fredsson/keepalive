import { Subject, Observer, Subscription } from "../util/subject";

export interface CalendarSubject {
  onHourChanged(observer: Observer<void>): Subscription;
}

export class Calendar implements CalendarSubject {
  private HourChangedSubject = new Subject<void>();
  private date: Date;
  private unixTime: number;

  constructor() {
    this.unixTime = 1577836800000;
    this.date = new Date(this.unixTime);
  }

  public tick(dt: number) {
    const previousDate = new Date(this.unixTime);
    this.unixTime += dt;
    this.date.setTime(this.unixTime);

    if (this.date.getUTCHours() !== previousDate.getUTCHours()) {
      this.HourChangedSubject.notify();
    }
  }

  public get currentDate(): string {
    return new Date(this.unixTime).toLocaleString();
  }

  public onHourChanged(observer: Observer<void>) {
    return this.HourChangedSubject.attach(observer);
  }
}