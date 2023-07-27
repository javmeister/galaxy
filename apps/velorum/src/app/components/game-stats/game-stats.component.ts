import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DataManagerService, EventManagerService, OnShowGalaxyStatsEvent, OnShowSectorStatsEvent } from '@velorum/shared';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'velorum-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss'],
})
export class GameStatsComponent implements OnDestroy, OnInit  {
  private name = 'GameStatsComponent';

  public fadeIn$: Subject<boolean> = new Subject();

  public showSectors = true;
  public showSystems = false;

  private _sectorsValue = '';
  private _systemsValue = '';

  private _sectorsTooltip = 'Sectors';
  private _systemsTooltip = 'Solar Systems';

  private _subShow!: Subscription;
  private _subHide!: Subscription;

  constructor(private readonly dataManager: DataManagerService,
    private readonly eventManager: EventManagerService,
    private readonly changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._subShow = this.eventManager.on(OnShowGalaxyStatsEvent, () => {
      // Galaxy
      this._sectorsValue = this.dataManager.velorum.sectors.length.toLocaleString();
      this._systemsValue = this.dataManager.velorum.solarSystems.length.toString();

      this._sectorsTooltip = 'Sectors';
      this._systemsTooltip = 'Solar Systems';

      this.showSectors = true;
      this.showSystems = true;

      this.fadeIn$.next(true);
      this.changeDetector.detectChanges();
    }, this);

    this._subHide = this.eventManager.on(OnShowSectorStatsEvent, () => {
      // Sector
      this._sectorsValue = this.dataManager.velorum.SelectedSector?.name;
      this._systemsValue = this.dataManager.velorum.SelectedSector?.solarSystems?.length.toLocaleString() || '0';

      this._sectorsTooltip = 'Current Sector';
      this._systemsTooltip = 'Solar Systems in this Sector';

      this.showSectors = true;
      this.showSystems = true;

      this.fadeIn$.next(true);
      this.changeDetector.detectChanges();
    }, this);
  }

  ngOnDestroy(): void {
    this.eventManager.off(OnShowSectorStatsEvent, this._subHide);
    this.eventManager.off(OnShowGalaxyStatsEvent, this._subShow);
  }

  public get sectorsValue() {
    return this._sectorsValue;
  }

  public get systemsValue() {
    return this._systemsValue;
  }

  public get sectorsTooltip() {
    return this._sectorsTooltip;
  }

  public get systemsTooltip() {
    return this._systemsTooltip;
  }
}
