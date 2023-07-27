import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { EventManagerService, OnScenesReadyEvent, OnLoadingScreenFadedOutEvent } from '@velorum/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'velorum-game-loading',
  templateUrl: './game-loading.component.html',
  styleUrls: ['./game-loading.component.scss'],
})
export class GameLoadingComponent implements OnDestroy, OnInit {
  private name = 'GameLoadingComponent';

  private _fadeIn = false;
  private _fadeOut = false;

  private _sub!: Subscription;

  @HostBinding('class.fade-out') get fadeout() {
    return this._fadeOut;
  }

  @HostBinding('class.fade-in') get fadein() {
    return this._fadeIn;
  }

  constructor(private readonly eventManager: EventManagerService) {}

  ngOnInit(): void {
    this._fadeIn = true;

    this._sub = this.eventManager.on(OnScenesReadyEvent, () => {
      this._fadeOut = true;

      // After 1 second notify the loading screen is faded out and it is time to get things going
      setTimeout(() => {
        this.eventManager.emit(OnLoadingScreenFadedOutEvent, undefined, this);
      }, 500);
    }, this);
  }

  ngOnDestroy(): void {
    // this._sub?.unsubscribe?.();
    this.eventManager.off(OnScenesReadyEvent, this._sub);
  }

}
