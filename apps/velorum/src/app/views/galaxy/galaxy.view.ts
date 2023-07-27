import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SceneManagerService } from '../../services/scene-manager.service';
import { Title } from '@angular/platform-browser';
import { EventManagerService, LogManagerService, OnGalaxyCalloutToggleEvent,
  OnGalaxySectorClickEvent, OnGameStartedEvent, OnIntroAlreadyCompletedEvent, OnIntroCompleteEvent,
  OnLoadingScreenFadedOutEvent, OnScenesReadyEvent, OnSectorDeselectedEvent, OnShowActionButtonsEvent,
  OnShowGalaxyStatsEvent, OnShowHeadlineEvent, OnShowSocialIconsEvent } from '@velorum/shared';
import { OnShowVersionNumberEvent } from '@velorum/shared/events/game.events';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import { DialogsService } from '../../services/dialogs.service';

@Component({
  selector: 'velorum-galaxy-view',
  templateUrl: './galaxy.view.html',
  styleUrls: ['./galaxy.view.scss'],
})
export class GalaxyView implements OnInit, OnDestroy, AfterViewInit {
  private name = 'GalaxyView';

  @ViewChild('dialog') dialog!: ElementRef<SlDialog>;
  @Input() routeName?: string;

  private _onGalaxySectorClickEventSubscription!: Subscription;
  private _onLoadingScreenFadedOutEventSubscription!: Subscription;
  private _onScenesReadySubscription!: Subscription;
  private _onShowActionButtonsEventSubscription!: Subscription;

  public showActionButtons = false;

  constructor(private readonly sceneManager: SceneManagerService,
    private readonly eventManager: EventManagerService,
    private readonly log: LogManagerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly title: Title) {

    // subscribe to the scenes loaded event not the data, we do need the galaxy and sector scenes being fully warmed up in here
    this._onScenesReadySubscription = this.eventManager.on(OnScenesReadyEvent, () => {
        this.init();
    }, this);
  }

  ngOnInit(): void {
    this.log.warn('onInit', this);

    this._onShowActionButtonsEventSubscription = this.eventManager.on(OnShowActionButtonsEvent, () => { this.showActionButtons = true; }, this);
  }

  ngOnDestroy(): void {
    this.log.warn('onDestroy', this);

    this.removeEvents();

    // Deactivate the galaxy scene
    this.sceneManager.GetSceneByName('Galaxy Scene')?.deactivate?.();
  }

  ngAfterViewInit(): void {
    this.log.warn('onAfterViewInit', this);

    this.addEvents();
  }

  private init() {
    if (this.route.snapshot.data['routeName'] === 'map-galaxy-view') {
      // Change the page title
      this.title.setTitle(`Velorum Galaxy`);

      // Activate the galaxy scene
      this.sceneManager.GetSceneByName('Galaxy Scene')?.activate?.();

      // Send the event back to the
      this.eventManager.emit(OnSectorDeselectedEvent, undefined, this);
    }
  }

  public addEvents() {
    // When the loading screen fades out, kick start things
    this._onLoadingScreenFadedOutEventSubscription = this.eventManager.on(OnLoadingScreenFadedOutEvent, () => this.onLoadingScreenFadedOut(), this);

    // Selected a Callout on the Galaxy Map
    this._onGalaxySectorClickEventSubscription = this.eventManager.on(OnGalaxySectorClickEvent, (object) => this.onGalaxySectorClick(object), this);
  }

  public removeEvents() {
    this.eventManager.off(OnGalaxySectorClickEvent, this._onGalaxySectorClickEventSubscription);
    this.eventManager.off(OnLoadingScreenFadedOutEvent, this._onLoadingScreenFadedOutEventSubscription);

    this.eventManager.off(OnScenesReadyEvent, this._onScenesReadySubscription);
    this.eventManager.off(OnShowActionButtonsEvent, this._onShowActionButtonsEventSubscription);
  }

  public close() {
    this.dialog.nativeElement.hide();
  }

  /**
   * Event triggered by the Callouts Toggle game button
   * @param event
   */
  public onCalloutsToggleActionClick(event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    event?.stopImmediatePropagation();

    this.eventManager.emit(OnGalaxyCalloutToggleEvent, undefined, this);
  }


  private onLoadingScreenFadedOut() {
    // This should be done now on all scenes, so maybe move it to the scenemanager instead, or the root view
    if (this.sceneManager.IntroComplete) {
      this.eventManager.emit(OnIntroAlreadyCompletedEvent, undefined, this);
      this.eventManager.emit(OnIntroCompleteEvent, undefined, this);
      this.eventManager.emit(OnShowSocialIconsEvent, undefined, this);
      this.eventManager.emit(OnShowActionButtonsEvent, undefined, this);
      // These two need to stay here though
      this.eventManager.emit(OnShowGalaxyStatsEvent, undefined, this);
      this.eventManager.emit(OnShowVersionNumberEvent, undefined, this);
      this.eventManager.emit(OnShowHeadlineEvent, { text: 'VELORUM GALAXY', duration: 6000 }, this);
    }

    // Game Started! this triggers more than once!
    this.eventManager.emit(OnGameStartedEvent, undefined, this);
  }

  private onGalaxySectorClick(object: { id: number, x: number, y: number } | undefined): void {
    // TODO: start the camera animation here

    // Navigate to it
    this.router.navigate(['galaxy', object?.id]);
  }
}
