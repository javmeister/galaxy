import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event, ReplayEvent } from '../events/base.event';
import { LogManagerService } from './logmanager.service';


@Injectable()
export class EventManagerService {
  private name = 'EventManagerService';

  private _events: Array<Event<any> | ReplayEvent<any>> = [];

  constructor(private readonly log: LogManagerService) {}

  public get events() {
    return this._events;
  }

  public on<T extends Event<any> | ReplayEvent<any>>(event: { new(): T }, next: (value: T['type']) => void, context?: any): Subscription {
    // Find the event
    const ev: T = this._events.find(e => (e as any).name === (event as any).name) as T;

    // If it has not been created, instantiate it
    if (!ev) {
      this._events.push(new event());
    }

    const calle = context.name || context.constructor.name || '';
    const eventName = (event as any).name || event.constructor.name;

    this.log.debug(`Subscribing to ${eventName} ${context ? 'from [' + calle + ']': ''}`, this);

    // Now subscribe!
    return (this._events.find(e => (e as any).name === (event as any).name) as T)?.subscribe(next);
  }

  public off<T extends Event<any> | ReplayEvent<any>>(event: { new(): T }, subscription?: Subscription) {
    // Find the event
    const ev: T = this._events.find(e => (e as any).name === (event as any).name) as T;

    ev?.dispose?.(subscription);
  }

  public emit<T extends Event<any> | ReplayEvent<any>>(event: { new(): T }, params?: T['type'], context?: any) {
    // Find the event
    const ev: T = this._events.find(e => (e as any).name === (event as any).name) as T;

    // If it has not been created, instantiate it
    if (!ev) {
      this._events.push(new event());
    }

    const nev: T = this._events.find(e => (e as any).name === (event as any).name) as T;

    const calle = context.name || context.constructor.name || '';
    const eventName = (nev as any).name || nev.constructor.name;

    this.log.info(`Invoking ${eventName} ${context ? 'from [' + calle + '] ': ''}to ${nev.subscriptions.length} subscribers.`, this, params);

    nev?.emit(params);
  }

  public dispose(): void {
    // First unsub
    this._events.forEach(event => event?.dispose?.()); // Make it an optional invoke just in case Angular already got rid of it

    // Then delete
    this._events = [];
  }

}
