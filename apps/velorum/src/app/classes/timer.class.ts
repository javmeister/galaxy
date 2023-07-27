import { BehaviorSubject } from "rxjs";

export class Timer {
  private _timerName = 'default';
  private _timerTick = 1000;
  private _interval: any;
  private _elapsed = 0;

  public onTick: BehaviorSubject<number> = new BehaviorSubject(this._elapsed);

  public get name() {
    return this._timerName;
  }

  constructor(private _name: string, private _tick: number) {
    this._timerTick = _tick;
    this._timerName = _name;
  }

  start() {
    if (!this.onTick || this.onTick.closed) {
      this.onTick = new BehaviorSubject(this._elapsed);
    }

    this._interval = setInterval(() => {
      this._elapsed++;
      this.onTick.next(this._elapsed);
    }, this._timerTick)
  }

  pause() {
    clearInterval(this._interval);
    // also stop the tick
    this.onTick.complete();
  }

}
