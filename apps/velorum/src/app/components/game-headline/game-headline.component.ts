import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { EventManagerService, OnShowHeadlineEvent } from '@velorum/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'velorum-game-headline',
  templateUrl: './game-headline.component.html',
  styleUrls: ['./game-headline.component.scss'],
})
export class GameHeadlineComponent implements OnDestroy, OnInit  {
  private name = 'GameHeadlineComponent';

  private _fadeOut = false;
  private _fadeIn = false;

  private _sub!: Subscription;
  private _timeout!: any;

  public text!: string;

  @HostBinding('class.fade-out') get fadeout() {
    return this._fadeOut;
  }

  @HostBinding('class.fade-in') get fadein() {
    return this._fadeIn;
  }

  constructor(private readonly eventManager: EventManagerService) {}

  ngOnInit(): void {
    this._sub = this.eventManager.on(OnShowHeadlineEvent, ({text, duration}) => {
      this._fadeIn = true;
      this._fadeOut = false;

      this.text = text;

      this._timeout = setTimeout(() => {
        this._fadeOut = true;
        this._fadeIn = false;
      }, duration);
    }, this);
  }

  ngOnDestroy(): void {
    this.clearTimeouts();

    // this._sub?.unsubscribe?.();
    this.eventManager.off(OnShowHeadlineEvent, this._sub);
  }

  private clearTimeouts(): void {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }
}
