
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

  public notify(payload: T) {
    this.observers.forEach((o) => {
      o(payload);
    });
  }
}