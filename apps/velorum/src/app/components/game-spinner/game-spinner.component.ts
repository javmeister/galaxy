import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { EventManagerService, OnScenesReadyEvent } from '@velorum/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'velorum-game-spinner',
  templateUrl: './game-spinner.component.html',
  styleUrls: ['./game-spinner.component.scss'],
})
export class GameSpinnerComponent implements OnDestroy, OnInit {
  private name = 'GameSpinnerComponent';

  private _fadeOut = false;
  private _sub!: Subscription;

  @HostBinding('class.fade-out') get fadeout() {
    return this._fadeOut;
  }

  constructor(private readonly eventManager: EventManagerService) {}

  ngOnInit(): void {
    this._sub = this.eventManager.on(OnScenesReadyEvent, () => {
      this._fadeOut = true;
    }, this);
  }

  ngOnDestroy(): void {
    // this._sub?.unsubscribe?.();
    this.eventManager.off(OnScenesReadyEvent, this._sub);
  }

}
