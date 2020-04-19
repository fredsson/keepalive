
export type Observer<T> = (payload: T) => void;

export type Subscription = () => void;

export class Subject<T> {
  private observers: Observer<T>[] = [];

  public attach(observer: Observer<T>): Subscription {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(o => o !== observer);
    };
  }

  public notify(payload: T): void {
    this.observers.forEach((o) => {
      o(payload);
    });
  }
}

export class ReplaySubject<T> extends Subject<T> {
  private lastPayload: T | undefined;

  public attach(observer: Observer<T>): Subscription {
    const sub = super.attach(observer);
    if (this.lastPayload) {
      observer(this.lastPayload);
    }

    return sub;
  }

  public notify(payload: T): void {
    this.lastPayload = payload;
    super.notify(payload);
  }

}