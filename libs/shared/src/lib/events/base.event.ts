import { ReplaySubject, Subject, Subscription } from "rxjs";

export abstract class Event<T> {
  public type!: T;
  public abstract subscriptions: Array<Subscription>;

  public abstract subject: Subject<T>;

  public abstract subscribe(next: (value: T) => void): Subscription;
  public abstract emit(params?: T): void;

  public dispose(subscription?: Subscription): void {
    if (subscription) {
      const subIndex = this.subscriptions.findIndex(sub => sub === subscription);
      this.subscriptions[subIndex]?.unsubscribe?.();
      this.subscriptions.splice(subIndex, 1);
      return;
    }
    this.subscriptions.forEach(sub => sub?.unsubscribe?.());
    this.subscriptions = [];
  }
}

export abstract class ReplayEvent<T> {
  public type!: T;
  public abstract subscriptions: Array<Subscription>;

  public abstract subject: ReplaySubject<T>;

  public abstract subscribe(next: (value: T) => void): Subscription;
  public abstract emit(params?: T): void;

  public dispose(subscription?: Subscription): void {
    if (subscription) {
      const subIndex = this.subscriptions.findIndex(sub => sub === subscription);
      this.subscriptions[subIndex]?.unsubscribe?.();
      this.subscriptions.splice(subIndex, 1);
      return;
    }
    this.subscriptions.forEach(sub => sub?.unsubscribe?.());
    this.subscriptions = [];
  }
}

export class BaseEvent<K = any> extends Event<K> {
  public subject: Subject<typeof this.type> = new Subject();
  public subscriptions: Subscription[] = [];

  public subscribe(next: (value: typeof this.type) => void): Subscription {
    const sub = this.subject.subscribe(next);
    this.subscriptions.push(sub);
    return sub;
  }

  public emit(params: typeof this.type) {
    this.subject.next(params);
  }
}

export class BaseReplayEvent<K = any> extends ReplayEvent<K> {
  public subject: ReplaySubject<typeof this.type> = new ReplaySubject(1);
  public subscriptions: Subscription[] = [];

  public subscribe(next: (value: typeof this.type) => void): Subscription {
    const sub = this.subject.subscribe(next);
    this.subscriptions.push(sub);
    return sub;
  }

  public emit(params: typeof this.type) {
    this.subject.next(params);
  }
}
