import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { EventManagerService } from '@velorum/shared';
import { OnShowVersionNumberEvent } from '@velorum/shared/events/game.events';
import { Subject, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'velorum-game-version',
  templateUrl: './game-version.component.html',
  styleUrls: ['./game-version.component.scss'],
})
export class GameVersionComponent implements OnDestroy, OnInit  {
  private name = 'GameVersionComponent';

  public fadeIn$: Subject<boolean> = new Subject();

  private _version = '1.0.0';

  private _subShow!: Subscription;

  constructor(private readonly eventManager: EventManagerService,
    private readonly changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._subShow = this.eventManager.on(OnShowVersionNumberEvent, () => {
      this.fadeIn$.next(true);
      this.changeDetector.detectChanges();
    }, this);
  }

  ngOnDestroy(): void {
    this.eventManager.off(OnShowVersionNumberEvent, this._subShow);
  }

  public get version() {
    return this._version;
  }
}
