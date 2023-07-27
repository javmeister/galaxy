import { Injectable } from '@angular/core';
import { Timer } from '../classes/timer.class';

@Injectable({
  providedIn: 'root',
})
export class TimerService {

  private _timers: Timer[] = [];

  newTimer(name: string, tick: number): Timer {
    const timer = new Timer(name, tick);
    this._timers.push(timer);
    return timer;
  }

  find(name: string): Timer {
    return this._timers.find(t => t.name === name) as Timer;
  }

}
