import { Injectable } from "@angular/core";
import { DataManagerService, EventManagerService, GameScene, LogManagerService,
  OnClickSolarSystemEvent, OnGoBackToGalaxyEvent, OnIntroBackToGalaxyViewEvent,
  OnIntroCompleteEvent, OnIntroShowSystemReticleEvent, OnIntroSystemReticleClickEvent,
  OnPlayerClaimedSolarSystemsLoadedEvent, OnSolarSystemDeselectedEvent,
  OnSolarSystemSelectedEvent, SolarSystem, StellarSize, OnMintedAvailableSolarSystemsLoadedEvent } from "@velorum/shared";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SectorStarMesh } from "../meshes/sector-stars.mesh";
import { Vector2 } from "three/src/math/Vector2";

import * as brightnessContrastVertexShader from '../shaders/brightness-contrast.vs';
import * as brightnessContrastFragmentShader from '../shaders/brightness-contrast.fs';

import * as hueSaturationVertexShader from '../shaders/hue-saturation.vs';
import * as hueSaturationFragmentShader from '../shaders/hue-saturation.fs';

import { Raycaster } from "three/src/core/Raycaster";
import { SectorStarsBoundaryMesh } from "../meshes/sector-stars-boundary.mesh";

import { SectorStarsBoundingBoxMesh } from "../meshes/sector-stars-bounding-box-instance.mesh";
import { SectorSystemCalloutMesh } from "../meshes/sector-system-callout.mesh";
import { SectorSelectedSystemCalloutMesh } from "../meshes/sector-selected-system-callout.mesh";
import { SectorHoverSystemCalloutMesh } from "../meshes/sector-hover-system-callout.mesh";
import { SectorIntroSystemCalloutMesh } from "../meshes/sector-intro-system-callout.mesh";
import { SectorClaimedStarsBoundaryMesh } from "../meshes/sector-claimed-stars-boundary.mesh";
import { SectorClaimedStarsIndicatorMesh } from "../meshes/sector-claimed-stars-indicator.mesh";
import { SectorPolarGridMesh } from "../meshes/sector-polar-grid.mesh";
import { TextureManagerService } from "../services/texture-manager.service";
import { degToRad } from "three/src/math/MathUtils";
import { Box3 } from "three/src/math/Box3";
import { Vector3 } from "three/src/math/Vector3";
import { SceneManagerService } from "../services/scene-manager.service";
import { Subscription } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class SectorScene extends GameScene {
  // A flag to know when this scene has already been initialized
  private _initialized = false;

  private _composer!: EffectComposer;

  private _sectorStars!: SectorStarMesh;
  private _sectorStarsBoundary!: SectorStarsBoundaryMesh;
  private _sectorStarsBoundingBox!: SectorStarsBoundingBoxMesh;

  private _sectorClaimedSystemsBoundary!: SectorClaimedStarsBoundaryMesh;
  private _sectorClaimedSystemsIndicator!: SectorClaimedStarsIndicatorMesh;

  private _polarGrid!: SectorPolarGridMesh;

  private BrightnessContrastShader = {
    uniforms: {
      tDiffuse: null,
      uContrast: {
        value: 0.05
      },
      uBrightness: {
        value: 0.01
      }
    },
    vertexShader: brightnessContrastVertexShader.default,
    fragmentShader: brightnessContrastFragmentShader.default
  };

  private HueSaturationShader = {
    uniforms: {
      tDiffuse: null,
      uHue: {
        value: 0
      },
      uSaturation: {
        value: 0.35
      }
    },
    vertexShader: hueSaturationVertexShader.default,
    fragmentShader: hueSaturationFragmentShader.default
  };

  private _hoverSystemCallout!: SectorHoverSystemCalloutMesh;
  private _selectedStarCallout!: SectorSelectedSystemCalloutMesh;

  private _introSystemCallout!: SectorIntroSystemCalloutMesh;

  private _systemCallouts: Array<SectorSystemCalloutMesh> = [];

  private _enabled = false;

  private _eventSub1!: Subscription;
  private _eventSub2!: Subscription;
  private _eventSub3!: Subscription;
  private _eventSub4!: Subscription;

  private _introSub1!: Subscription;
  private _introSub2!: Subscription;
  private _introSub3!: Subscription;
  private _introSub4!: Subscription;

  constructor(private readonly sceneManager: SceneManagerService,
    private readonly textureManager: TextureManagerService,
    private readonly log: LogManagerService,
    private readonly eventManager: EventManagerService,
    private readonly dataManager: DataManagerService) {
    super();

    this.name = 'Sector Scene';
  }

  public override get composer(): EffectComposer {
    return this._composer;
  }

  public dispose(): void {
    this.log.warn('onDispose', this);

    // Remove all the callouts and single instance meshes
    this.deactivate();

    this.removeMeshes();

    this.removeEvents();

    this._polarGrid?.dispose?.();
    this._sectorStars?.dispose?.();
    this._sectorStarsBoundary?.dispose?.();
    this._sectorStarsBoundingBox?.dispose?.();

    this._sectorClaimedSystemsBoundary?.dispose?.();
    this._sectorClaimedSystemsIndicator?.dispose?.();

    // Finally reset the initialization state
    this._initialized = false;
  }

  public init(): GameScene {
    this.log.warn('onInit', this);

    // Avoid doing this initialization multiple times
    if (this._initialized) {
      return this;
    }

    // Precompile all shaders in the scene, does this even do anything???
    this.sceneManager.RendererWebGL.compile(this, this.sceneManager.Camera);

    this._composer = this.setupComposer();

    // The polar grid needs the camera to rotate the text labels towards it
    this._polarGrid = new SectorPolarGridMesh(this.sceneManager.Camera);

    this.setupPostProcessing();

    this.addEvents();

    this
      .addBackground()
      .addMeshes()
      .addCallouts();

    // Set as initialized
    this._initialized = true;

    return this;
  }

  public activate(onlyIfInactive = false): GameScene {
    if (onlyIfInactive && (this.sceneManager.GetActive() && this.sceneManager.GetActive()?.name === this.name)) {
      return this; // Return early if the active scene is this one
    }

    this.initRenderer();
    this.initCamera();
    this.initControls();

    this.sceneManager.SetActiveByName(this.name);

    // Before creating the stars and callouts, remove the old ones if they are there
    this.removeStars();
    this.removeCallouts();
    this.removeIntroCallouts();
    this.removePlayerSystems();

    this.createSectorMeshes();

    // This is used in the intro for when the animation goes into the Styx sector
    if (!this.sceneManager.IntroComplete) {
      this.sceneManager.Controls.setPosition(14845, 241, 15683);
    }

    return this;
  }

  public deactivate(): GameScene {
    // Hide callouts when moving away to the galaxy
    this.hideCalloutSelectedStar();

    this.removeCallouts();
    this.removeIntroCallouts();

    // Remove the stars
    this.removeStars();

    // And the player systems if any
    this.removePlayerSystems();

    return this;
  }

  public initRenderer(): GameScene {
    // Set the canvas temporarity to width by width to make the shader render things in the right ratio
    this.sceneManager.RendererWebGL.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.sceneManager.RendererWebGL.toneMappingExposure = 0.8;

    return this;
  }

  public initCamera(): GameScene {
    this.sceneManager.Camera.near = 5;
    this.sceneManager.Camera.far = 5000000;

    this.sceneManager.Camera.updateProjectionMatrix();

    return this;
  }

  public initControls(): GameScene {
    // In the loading scene this is disabled, so make sure it works
    this.sceneManager.Controls.enabled = true;

    this.sceneManager.Controls.maxPolarAngle = degToRad(85);
    this.sceneManager.Controls.minPolarAngle = degToRad(5);

    this.sceneManager.Controls.minDistance = 20;
    this.sceneManager.Controls.maxDistance = 3000;
    this.sceneManager.Controls.distance = 1000;

    this.sceneManager.Controls.dollySpeed = 0.5;
    // controls.truckSpeed = 2;
    // controls.polarRotateSpeed = 2;
    // controls.azimuthRotateSpeed = 2;

    // This controls the speed of transitions, if needed can be overriden
    this.sceneManager.Controls.dampingFactor = 0.1;

    this.sceneManager.Controls.setBoundary(new Box3(
      new Vector3( -50000, -5000, -50000 ),
      new Vector3( 50000, 5000, 50000 )
    ));

    // Go to the sector, remember x and z are flipped
    this.sceneManager.Controls.setLookAt(
      this.dataManager.velorum.SelectedSector.center.z - 500,
      this.dataManager.velorum.SelectedSector.center.y + 150,
      this.dataManager.velorum.SelectedSector.center.x - 750,

      this.dataManager.velorum.SelectedSector.center.z,
      this.dataManager.velorum.SelectedSector.center.y,
      this.dataManager.velorum.SelectedSector.center.x,
      false
    );

    return this;
  }

  private addEvents() {
    this._eventSub1 = this.eventManager.on(OnSolarSystemSelectedEvent, (system) => this.onSolarSystemSelected(system), this);
    this._eventSub2 = this.eventManager.on(OnSolarSystemDeselectedEvent, () => this.onSolarSystemDeselected(), this);
    this._eventSub3 = this.eventManager.on(OnMintedAvailableSolarSystemsLoadedEvent, (systems) => this.onSectorMintedAvailableSystemsLoaded(systems), this);
    this._eventSub4 = this.eventManager.on(OnPlayerClaimedSolarSystemsLoadedEvent, (systems) => this.onPlayerClaimedSolarSystemsLoaded(systems), this);

    this.addIntroEvents();
  }

  private removeEvents() {
    this.eventManager.off(OnSolarSystemSelectedEvent, this._eventSub1);
    this.eventManager.off(OnSolarSystemDeselectedEvent, this._eventSub2);
    this.eventManager.off(OnMintedAvailableSolarSystemsLoadedEvent, this._eventSub3);
    this.eventManager.off(OnPlayerClaimedSolarSystemsLoadedEvent, this._eventSub4);

    this.removeIntroEvents();
  }

  private addIntroEvents() {
    // Intro Events
    this._introSub1 = this.eventManager.on(OnIntroCompleteEvent, () => this.onIntroComplete(), this);
    this._introSub2 = this.eventManager.on(OnIntroShowSystemReticleEvent, () => this.onIntroShowSystemReticle(), this);
    this._introSub3 = this.eventManager.on(OnIntroSystemReticleClickEvent, () => this.onIntroSystemReticleClick(), this);
    this._introSub4 = this.eventManager.on(OnIntroBackToGalaxyViewEvent, () => this.onIntroGoBackToGalaxyView(), this);
  }

  private removeIntroEvents() {
    // Intro Events
    this.eventManager.off(OnIntroCompleteEvent, this._introSub1);
    this.eventManager.off(OnIntroShowSystemReticleEvent, this._introSub2);
    this.eventManager.off(OnIntroSystemReticleClickEvent, this._introSub3);
    this.eventManager.off(OnIntroBackToGalaxyViewEvent, this._introSub4);
  }

  private onIntroComplete() {
    // Enable clicking on Solar Systems
    this._enabled = true;
  }

  public addBackground(): SectorScene {
    this.background = this.textureManager.galaxySkybox;

    return this;
  }

  public removeMeshes(): SectorScene {
    this.remove(
      this._polarGrid,
    );

    return this;
  }

  public addMeshes(): SectorScene {
    this.add(
      this._polarGrid,
    );

    return this;
  }

  public addCallouts(): SectorScene {
    this._hoverSystemCallout = SectorHoverSystemCalloutMesh.SetupCallout(undefined);
    this._selectedStarCallout = SectorSelectedSystemCalloutMesh.SetupCallout(undefined);

    // Hide them!!
    this._hoverSystemCallout.setPosition(new Vector3(0, 1000000, 0));
    this._selectedStarCallout.setPosition(new Vector3(0, 1000000, 0));

    // Add the CSS2Renderer objects separately
    this.add(
      this._hoverSystemCallout,
      this._selectedStarCallout
    );

    return this;
  }

  public addIntroCallout(): SectorScene {
    const grummieSystem = this.dataManager.velorum.solarSystems.find(s => s.id === 108459); // Grumium 23 in the Denkal sector, next to Styx
    this._introSystemCallout = SectorIntroSystemCalloutMesh.SetupCallout(grummieSystem);
    this._introSystemCallout.element.onclick = () => {
      this.eventManager.emit(OnIntroSystemReticleClickEvent, undefined, this);
    };

    this.add(
      this._introSystemCallout
    );

    return this;
  }

  public addSystemsCallouts(): SectorScene {
    // Add the system callouts
    this._systemCallouts = this.setupSystemCallouts();

    this.add(...this._systemCallouts);

    return this;
  }

  public removeStars(): SectorScene {
    this.remove(
      this._sectorStars,
      this._sectorStarsBoundary,
      this._sectorStarsBoundingBox,
    );

    return this;
  }

  public removePlayerSystems(): SectorScene {
    const boundaries = this.children.filter(c => c.name === SectorClaimedStarsBoundaryMesh.name);
    const indicators = this.children.filter(c => c.name === SectorClaimedStarsIndicatorMesh.name);

    if (boundaries.length > 0) {
      this.remove(...boundaries);
    }

    if (indicators.length > 0) {
      this.remove(...indicators);
    }

    return this;
  }

  public removeCallouts(): GameScene {
    // LOL REMOVING CSS2DObjects just doesnt work, using the DOM workaround
    this._hoverSystemCallout.remove();
    this._hoverSystemCallout.element.parentNode?.removeChild(this._hoverSystemCallout.element);

    this._selectedStarCallout.remove();
    this._selectedStarCallout.element.parentNode?.removeChild(this._selectedStarCallout.element);

    // And the solar system callouts when we leave so we dont leak memory like F, doing this by mesh name now
    const systemCallouts = this.children.filter(c => c.name === 'SectorSystemCalloutMesh');
    this.remove(...systemCallouts);

    // Clear the array!
    this._systemCallouts = [];

    return this;
  }

  public removeIntroCallouts(): GameScene {
    if (this._introSystemCallout) {
      this._introSystemCallout.remove();
      this._introSystemCallout.element.parentNode?.removeChild(this._introSystemCallout.element);
      this.remove(this._introSystemCallout);
    }

    return this;
  }

  public createSectorMeshes(): SectorScene {
    this._sectorStars = new SectorStarMesh(this.dataManager.velorum.SelectedSector);
    this._sectorStarsBoundary = new SectorStarsBoundaryMesh(this.dataManager.velorum.SelectedSector);
    this._sectorStarsBoundingBox = new SectorStarsBoundingBoxMesh(this.dataManager.velorum.SelectedSector);

    this._sectorStars.camera = this.sceneManager.Camera;

    this.add(
      this._sectorStars,
      this._sectorStarsBoundary,
      this._sectorStarsBoundingBox
    );

    this.addSystemsCallouts();

    // Move the polar grid to the center of the selected sector, remember x and z are flipped
    this._polarGrid.position.set(this.dataManager.velorum.SelectedSector.center.z,
      this.dataManager.velorum.SelectedSector.center.y,
      this.dataManager.velorum.SelectedSector.center.x);

    return this;
  }

  public update(delta?: number): GameScene {
    // Update the meshes
    this._sectorStars.update(delta);
    this._sectorStarsBoundary.update(delta);
    this._sectorStarsBoundingBox.update(delta);

    this._sectorClaimedSystemsBoundary?.update?.(delta);
    this._sectorClaimedSystemsIndicator?.update?.(delta);

    // Polar Grid text
    this._polarGrid?.update?.(delta);

    // Render!!
    this._composer.render(delta);

    // And CSS if needed
    this.sceneManager.RendererCSS2D.render(this, this.sceneManager.Camera);

    return this;
  }

  public override handleRaycast(raycaster: Raycaster): GameScene {
    let systemsHit = null;
    let systemsHitcount = 0;

    // Hits on the galaxy grid
    systemsHit = raycaster.intersectObject( this._sectorStarsBoundingBox );
    systemsHitcount = systemsHit.length;

    if ( systemsHitcount > 0 ) {
      const hit = systemsHit[ 0 ];

      // hit.instanceId is the int id of the solar system being hovered
      const instanceId = hit.instanceId as number;

      // Hovered solar system
      const system = this.dataManager.velorum.SelectedSector.solarSystems[instanceId];

      // If we are in the intro don't even hover!
      if (!this.sceneManager.IntroComplete && system.id === 108459) return this;

      this.onSystemMouseOver(system);
    } else {
      this.onSystemMouseOut();
    }

    return this;
  }

  public override onClick(raycaster: Raycaster): void {
    let systemsHit = null;
    let systemsHitcount = 0;

    // Exit early if not enabled
    if (!this._enabled) return;

    // Hits on the galaxy grid
    systemsHit = raycaster.intersectObject( this._sectorStarsBoundingBox );
    systemsHitcount = systemsHit.length;

    if ( systemsHitcount > 0 ) {
      const hit = systemsHit[ 0 ];

      // hit.instanceId is the int id of the solar system being hovered
      const instanceId = hit.instanceId as number;

      // Find the Solar system we clicked on by instanceId
      const system = this.dataManager.velorum.SelectedSector.solarSystems[instanceId];

      // Notify the scene manager which system we are selecting
      this.eventManager.emit(OnClickSolarSystemEvent, system, this);
    }
  }

  private onIntroShowSystemReticle() {
    this.addIntroCallout();
  }

  private onIntroSystemReticleClick() {
    // Before selecting, remove the intro callout bc the selected one is about to show
    this.removeIntroCallouts();

    // Actually select grummi system
    const grummieSystem = this.dataManager.velorum.solarSystems.find(s => s.id === 108459) as SolarSystem;

    this.eventManager.emit(OnClickSolarSystemEvent, grummieSystem, this);
  }

  private onIntroGoBackToGalaxyView() {
    // The order matters here, since deselecting a system will fail if we already went back to the galaxy
    this.eventManager.emit(OnSolarSystemDeselectedEvent, undefined, this);
    this.eventManager.emit(OnGoBackToGalaxyEvent, undefined, this);
  }

  private onSolarSystemSelected(system: SolarSystem) {
    if (this.dataManager.velorum.SelectedSector.SelectedSystem) {

      // Close up the camera
      this.sceneManager.Controls.setTarget(
        system.coordinates.x,
        system.coordinates.y,
        system.coordinates.z,
        true,
      );

      // Get close to that star, calculate how far we are to begin with, then dolly in to be about 500 units away from the star
      const cameraPosition = new Vector3();
      this.sceneManager.Controls.getPosition(cameraPosition);

      const dollyAmount = system.coordinates.distanceTo(cameraPosition) - 500;

      // If it is too close, it will dolly out being negative dollyAmount
      this.sceneManager.Controls.dolly(dollyAmount, true);

      // Show the selected star 2d callout
      this.changeSelectedStarCalloutDetails(system);

      // Hide the hover if being shown
      this.hideCalloutDetails();
    }
  }

  private onSolarSystemDeselected() {
    if (this.dataManager.velorum.SelectedSector.SelectedSystem) {
      // Move the camera out
      this.sceneManager.Controls.dolly(-500, true);

      // Hide the selected callout
      this.hideCalloutSelectedStar();
    }
  }

  private onSystemMouseOver(system: SolarSystem): void {
    if (!this.dataManager.velorum.SelectedSector.SelectedSystem || this.dataManager.velorum.SelectedSector.SelectedSystem.id !== system.id) {
      this.changeDetailsCalloutDetails(system);
    }
  }

  private onSystemMouseOut(): void {
    this.hideCalloutDetails();
  }

  private onSectorMintedAvailableSystemsLoaded(event: any[]): void {
    if (event.length === 0) return;

    const systems = this.dataManager.velorum.SelectedSector.solarSystems.filter(ss => event.find((es: any) => es.id === ss.id));

    // event.systems is the firestore data containing the array of claimed systems
    this._sectorClaimedSystemsBoundary = new SectorClaimedStarsBoundaryMesh(
      this.dataManager.velorum.SelectedSector,
      systems
    );

    this._sectorClaimedSystemsIndicator = new SectorClaimedStarsIndicatorMesh(
      this.dataManager.velorum.SelectedSector,
      systems
    );

    // Pass the camera for the always facing update shit
    this._sectorClaimedSystemsIndicator.camera = this.sceneManager.Camera;

    // Remove before adding
    this.removePlayerSystems();

    this.add(
      this._sectorClaimedSystemsBoundary,
      this._sectorClaimedSystemsIndicator
    );
  }

  private onPlayerClaimedSolarSystemsLoaded(event: any[]): void {
    if (event.length === 0) return;

    const sectorSystems = event.filter(s => s.sector === this.dataManager.velorum.SelectedSector.id);
    const systems = this.dataManager.velorum.SelectedSector.solarSystems.filter(ss => sectorSystems.some(s => s.id === ss.id));

    // event.systems is the firestore data containing the array of claimed systems
    this._sectorClaimedSystemsBoundary = new SectorClaimedStarsBoundaryMesh(
      this.dataManager.velorum.SelectedSector,
      systems
    );

    this._sectorClaimedSystemsIndicator = new SectorClaimedStarsIndicatorMesh(
      this.dataManager.velorum.SelectedSector,
      systems
    );

    // Pass the camera for the always facing update shit
    this._sectorClaimedSystemsIndicator.camera = this.sceneManager.Camera;

    // Remove before adding
    this.removePlayerSystems();

    this.add(
      this._sectorClaimedSystemsBoundary,
      this._sectorClaimedSystemsIndicator
    );
  }

  private setupPostProcessing() {
    const bloomEffect = new UnrealBloomPass(
      new Vector2( 1024, 1024 ),
      1.25, // strength
      0.75, // radius
      0.0, // threshold
    );

    this._composer.addPass(bloomEffect);
  }

  public setupComposer(): EffectComposer {
    const composer = new EffectComposer(this.sceneManager.RendererWebGL);

    composer.addPass(new RenderPass(this, this.sceneManager.Camera));
    composer.addPass(new ShaderPass(this.BrightnessContrastShader));
    composer.addPass(new ShaderPass(this.HueSaturationShader));

    return composer;
  }

  private getRandomSystems(count: number) {
    const shuffled = [...this.dataManager.velorum.SelectedSector.solarSystems].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, count);
  }

  private setupSystemCallouts(): SectorSystemCalloutMesh[] {
    // for each callout
    let callouts: SectorSystemCalloutMesh[] = [];

    // Randomly select systems depending on how many the sector has, the smaller the total, the more labels we show.
    // Clamped down to a maximum of 45
    const percentage = 1 - StellarSize.NormalizeToRange(this.dataManager.velorum.SelectedSector.solarSystems.length, 1, 750, 0, 1);
    const count = StellarSize.Clamp(this.dataManager.velorum.SelectedSector.solarSystems.length * percentage, 0, 45);
    let systems: SolarSystem[] = this.getRandomSystems(this.dataManager.velorum.SelectedSector.solarSystems.length < 45 ? this.dataManager.velorum.SelectedSector.solarSystems.length : count);

    if (!this.sceneManager.IntroComplete) {
      systems = systems.filter(s => s.id !== 108459);
    }

    callouts = systems.map(system => SectorSystemCalloutMesh.SetupCallout(system));

    return callouts;
  }

  private changeDetailsCalloutDetails(system: SolarSystem) {
    const systemName = this._hoverSystemCallout.element.querySelector('.name') as HTMLDivElement;
    systemName.innerHTML = system.name;

    this._hoverSystemCallout.position.set(system?.coordinates.x, system?.coordinates.y, system?.coordinates.z);
  }

  private hideCalloutDetails() {
    const systemName = this._hoverSystemCallout.element.querySelector('.name') as HTMLDivElement;
    systemName.innerHTML = '';

    this._hoverSystemCallout.position.set(0, 30000,0);
  }

  private changeSelectedStarCalloutDetails(system: SolarSystem) {
    const systemName = this._selectedStarCallout.element.querySelector('.name') as HTMLDivElement;
    systemName.innerHTML = system.name;

    this._selectedStarCallout.position.set(system?.coordinates.x, system?.coordinates.y, system?.coordinates.z);
  }

  private hideCalloutSelectedStar() {
    const systemName = this._selectedStarCallout.element.querySelector('.name') as HTMLDivElement;
    systemName.innerHTML = '';

    this._selectedStarCallout.position.set(0, 30000,0);
  }
}
