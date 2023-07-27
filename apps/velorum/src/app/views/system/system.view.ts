import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManagerService, EventManagerService, LogManagerService, OnClickSolarSystemEvent, OnGoBackToGalaxyEvent,
  OnIntroAlreadyCompletedEvent, OnIntroCompleteEvent, OnLoadingScreenFadedOutEvent, OnScenesReadyEvent,
  OnSectorSelectedEvent, OnShowActionButtonsEvent, OnShowSectorStatsEvent, OnShowSocialIconsEvent,
  OnSolarSystemDeselectedEvent, OnSolarSystemSelectedEvent, SolarSystem } from '@velorum/shared';
import { Subscription } from 'rxjs';
import { SceneManagerService } from '../../services/scene-manager.service';

@Component({
  selector: 'velorum-system-view',
  templateUrl: './system.view.html',
  styleUrls: ['./system.view.scss'],
})
export class SystemView implements OnInit, OnDestroy {
  private name = 'SystemView';

  @Input() routeName?: string;
  @Input() sectorid?: string;
  @Input() systemid?: string;

  public showDetails = false;
  public showExtendedDetails = false;
  public showActionButtons = false;

  private _scenesReady = false;

  private _onSelectSolarSystemEventSubscription !: Subscription;
  private _onLoadingScreenFadedOutEventSubscription !: Subscription;
  private _onSectorClickSubscription!: Subscription;
  private _onShowActionButtonsEventSubscription!: Subscription;
  private _onGoBackToGalaxySubscription!: Subscription;

  constructor(private readonly sceneManager: SceneManagerService,
    private readonly eventManager: EventManagerService,
    private readonly log: LogManagerService,
    private readonly dataManager: DataManagerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly title: Title) {

    // Clicking on a different solar system won't refresh the data unless we tell angular to do so
    // Cant wait to have a solar system view
    this.route.params.subscribe(params => {
      // Here params has changed, so trigger init();
      if (this._scenesReady) {
        this.init();
      }
    });

    // subscribe to the scenes loaded event not the data, we do need the galaxy and sector scenes being fully warmed up in here
    this.eventManager.on(OnScenesReadyEvent, () => {
      this.init();
      this._scenesReady = true;
    }, this);
  }

  ngOnInit(): void {
    this.log.warn('onInit', this);

    this.addEvents();
  }

  ngOnDestroy(): void {
    this.log.warn('onDestroy', this);

    this.removeEvents();

    // Only deactivate if we are going to the galaxy view, not the solar system view
    // TODO: remove this as soon as we have the solar system view with planets and shit
    if (this.router.routerState.snapshot.url === '/velorum/galaxy') {
      // Deactivate the sector scene
      this.sceneManager.GetSceneByName('Sector Scene')?.deactivate?.();
    }
  }

  private init() {
    if (this.route.snapshot.data['routeName'] === 'map-system-view') {
      // Select the sector and the solar system in the route params id
      this.dataManager.velorum.SelectSector(parseInt(this.route.snapshot.paramMap.get('sectorid') as string, 10));
      this.dataManager.velorum.SelectedSector?.SelectedSystem?.deselect?.();
      this.dataManager.velorum.SelectedSector.SelectSystem(parseInt(this.route.snapshot.paramMap.get('systemid') as string, 10));

      // Change the page title
      this.title.setTitle(`Velorum Galaxy :: Sector ${this.dataManager.velorum.SelectedSector.name} :: System ${this.dataManager.velorum.SelectedSector.SelectedSystem.name}`);

      // Activate this scene only if scenes ready event is triggered or data is loaded
      this.sceneManager.GetSceneByName('Sector Scene')?.activate?.(true); // Pass true because it is likely the sector view will already be active

      // Send the event back to the sector scene to do the camera adjusts
      this.eventManager.emit(OnSolarSystemSelectedEvent, this.dataManager.velorum.SelectedSector?.SelectedSystem, this);

      // Send the event back to the sector scene to do the camera adjusts
      this.eventManager.emit(OnSectorSelectedEvent, this.dataManager.velorum.SelectedSector, this);

      // Show the details panels, wait 1ms to let it be added with opacity 0 then fade in or the flash effect sucks
      setTimeout(() => {
        this.showDetails = true;
        this.showExtendedDetails = true;
      }, 1);
    }
  }

  public addEvents() {
    if (this.route.snapshot.data['routeName'] === 'map-system-view') {
      this._onShowActionButtonsEventSubscription = this.eventManager.on(OnShowActionButtonsEvent, () => { this.showActionButtons = true; }, this);
      this._onSelectSolarSystemEventSubscription = this.eventManager.on(OnClickSolarSystemEvent,  (system) => this.onSolarSystemClick(system), this);
      this._onLoadingScreenFadedOutEventSubscription = this.eventManager.on(OnLoadingScreenFadedOutEvent, () => this.onLoadingScreenFadedOut(), this);
      this._onSectorClickSubscription = this.eventManager.on(OnSolarSystemDeselectedEvent, () => this.onSectorClick(), this);
      this._onGoBackToGalaxySubscription = this.eventManager.on(OnGoBackToGalaxyEvent, () => this.onGoBackToGalaxy(), this);
    }
  }

  public removeEvents() {
    this.eventManager.off(OnClickSolarSystemEvent,  this._onSelectSolarSystemEventSubscription);
    this.eventManager.off(OnLoadingScreenFadedOutEvent, this._onLoadingScreenFadedOutEventSubscription);
    this.eventManager.off(OnSolarSystemDeselectedEvent, this._onSectorClickSubscription);
    this.eventManager.off(OnShowActionButtonsEvent, this._onShowActionButtonsEventSubscription);
    this.eventManager.off(OnGoBackToGalaxyEvent, this._onGoBackToGalaxySubscription);
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
    }
  }

  private onSolarSystemClick(system: SolarSystem): void {
    // Navigate to it
    this.router.navigate(['galaxy', this.dataManager.velorum.SelectedSector.id, system.id]);
  }

  private onSectorClick(): void {
    // Route back to this sector
    this.router.navigate(['galaxy', this.dataManager.velorum.SelectedSector.id]);
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
   * Event triggered by the Deselect System game button
   * @param event
   */
  public onDeselectActionClick(event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    event?.stopImmediatePropagation();

    // Trigger this before routing to start the zoom out animation
    this.eventManager.emit(OnSolarSystemDeselectedEvent, undefined, this);
  }
}
