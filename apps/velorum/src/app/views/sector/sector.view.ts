import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManagerService, EventManagerService, LogManagerService, OnClickSolarSystemEvent, OnGalaxyClickEvent,
  OnGoBackToGalaxyEvent, OnIntroAlreadyCompletedEvent, OnIntroCompleteEvent, OnLoadingScreenFadedOutEvent,
  OnScenesReadyEvent, OnSectorSelectedEvent, OnShowActionButtonsEvent, OnShowHeadlineEvent, OnShowSectorStatsEvent,
  OnShowSocialIconsEvent, SolarSystem } from '@velorum/shared';
import { Subscription } from 'rxjs';
import '../../extensions/string.extensions';

import { SceneManagerService } from '../../services/scene-manager.service';

@Component({
  selector: 'velorum-sector-view',
  templateUrl: './sector.view.html',
  styleUrls: ['./sector.view.scss'],
})
export class SectorView implements OnInit, OnDestroy {
  private name = 'SectorView';

  @Input() routeName?: string;
  @Input() sectorid?: string;

  private _onSelectSolarSystemEventSubscription !: Subscription;
  private _onLoadingScreenFadedOutEventSubscription !: Subscription;
  private _onGalaxyClickSubscription!: Subscription;
  private _onGoBackToGalaxySubscription!: Subscription;
  private _onShowActionButtonsEventSubscription!: Subscription;

  public showActionButtons = false;

  constructor(private readonly sceneManager: SceneManagerService,
    private readonly eventManager: EventManagerService,
    private readonly log: LogManagerService,
    private readonly dataManager: DataManagerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly title: Title) {}

  ngOnInit(): void {
    this.log.warn('onInit', this);

    // subscribe to the scenes loaded event not the data, we do need the galaxy and sector scenes being fully warmed up in here
    this.eventManager.on(OnScenesReadyEvent, () => this.init(), this);

    // Add events after the view is init
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.log.warn('onDestroy', this);

    this.removeEvents();

    // Only deactivate if we are going to the galaxy view, not the solar system view
    if (this.router.routerState.snapshot.url === '/galaxy') {
      this.sceneManager.GetSceneByName('Sector Scene')?.deactivate?.();
    }
  }

  private init() {
    if (this.route.snapshot.data['routeName'] === 'map-sector-view') {
      // Deselect the selected solar system if there are any, obviously do this before deselecting the sector
      this.dataManager.velorum.SelectedSector?.SelectedSystem?.deselect?.();
      // Deselect/select the sector in the route params id
      this.dataManager.velorum.SelectedSector?.deselect();
      this.dataManager.velorum.SelectSector(parseInt(this.sectorid as string, 10));

      // Change the page title
      this.title.setTitle(`Velorum Galaxy :: Sector ${this.dataManager.velorum.SelectedSector.name}`);

      // Activate this scene only if scenes ready event is triggered or data is loaded
      this.sceneManager.GetSceneByName('Sector Scene')?.activate?.(true);

      // Send the event back to the sector scene to do the camera adjusts
      this.eventManager.emit(OnSectorSelectedEvent, this.dataManager.velorum.SelectedSector, this);
    }
  }

  public addEvents() {
    if (this.route.snapshot.data['routeName'] === 'map-sector-view') {
      this._onShowActionButtonsEventSubscription = this.eventManager.on(OnShowActionButtonsEvent, () => { this.showActionButtons = true; }, this);
      this._onSelectSolarSystemEventSubscription = this.eventManager.on(OnClickSolarSystemEvent,  (system) => this.onSolarSystemClick(system), this);
      this._onLoadingScreenFadedOutEventSubscription = this.eventManager.on(OnLoadingScreenFadedOutEvent, () => this.onLoadingScreenFadedOut(), this);
      this._onGalaxyClickSubscription = this.eventManager.on(OnGalaxyClickEvent, () => this.onGoBackToGalaxy(), this);
      this._onGoBackToGalaxySubscription = this.eventManager.on(OnGoBackToGalaxyEvent, () => this.onGoBackToGalaxy(), this);
    }
  }

  public removeEvents() {
    this.eventManager.off(OnClickSolarSystemEvent,  this._onSelectSolarSystemEventSubscription);
    this.eventManager.off(OnLoadingScreenFadedOutEvent, this._onLoadingScreenFadedOutEventSubscription);
    this.eventManager.off(OnGalaxyClickEvent, this._onGalaxyClickSubscription);
    this.eventManager.off(OnGoBackToGalaxyEvent, this._onGoBackToGalaxySubscription);
    this.eventManager.off(OnShowActionButtonsEvent, this._onShowActionButtonsEventSubscription);
}

  private onLoadingScreenFadedOut() {
    // This should be done now on all scenes, so maybe move it to the scenemanager instead, or the root view
    if (this.sceneManager.IntroComplete) {
      this.eventManager.emit(OnIntroAlreadyCompletedEvent, undefined, this);
      this.eventManager.emit(OnIntroCompleteEvent, undefined, this);
      this.eventManager.emit(OnShowSocialIconsEvent, undefined, this);
      this.eventManager.emit(OnShowActionButtonsEvent, undefined, this);
      // These two need to stay here though
      this.eventManager.emit(OnShowSectorStatsEvent, undefined, this);
      this.eventManager.emit(OnShowHeadlineEvent, { text: `SECTOR ${this.dataManager.velorum.SelectedSector.name.toUpperCase()}`, duration: 5000 }, this);
    }
  }

  private onSolarSystemClick(system: SolarSystem): void {
    // Navigate to it
    this.router.navigate(['galaxy', this.dataManager.velorum.SelectedSector.id, system.id]);
  }

  private onGoBackToGalaxy(): void {
    // Deselect the sector
    this.dataManager.velorum.SelectedSector?.deselect();

    // Reset the camera for the galaxy
    this.sceneManager.Controls.moveTo(-10000, 6000, 500, false);
    this.sceneManager.Controls.setTarget(0, 0, 0, false);

    // Route to the galaxy
    this.router.navigate(['galaxy']);
  }

  /**
   * Event triggered by the Galaxy View game button
   * @param event
   */
  public onGalaxyViewActionClick(event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    event?.stopImmediatePropagation();

    this.eventManager.emit(OnGalaxyClickEvent, undefined, this);
  }

}
