import { Injectable } from "@angular/core";

import { Raycaster } from "three/src/core/Raycaster";
import { Matrix4 } from "three/src/math/Matrix4";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { DataManagerService, EventManagerService, GameScene, LogManagerService,
  OnGalaxyCalloutClickEvent, OnGalaxyCalloutToggleEvent, OnGalaxySectorClickEvent,
  OnIntroArgosCalloutClickEvent, OnIntroCompleteEvent, OnIntroCompleteSaveEvent,
  OnIntroShowArgosCalloutEvent, OnIntroShowSaulCalloutEvent,
  OnPlayerClaimedSectorsLoadedEvent } from "@velorum/shared";
import { HighlightedSectorMesh } from "../meshes/highlighted-sector.mesh";
import { SectorsGridMesh } from "../meshes/sectors-grid.mesh";
import { GalaxyMesh } from "../meshes/galaxy.mesh";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import { NebulaeCloudsMesh } from "../meshes/nebulae-clouds-instance.mesh";
import { NebulaeDustMesh } from "../meshes/nebulae-dust-instance.mesh";
import { NebulaeCoreMesh } from "../meshes/nebulae-core-instance.mesh";
import { GalaxySectorHoverMesh } from "../meshes/galaxy-sector-hover.mesh";
import { GalaxySectorPlayerOwnedMesh } from "../meshes/galaxy-sector-player-owned.mesh";

import * as brightnessContrastVertexShader from '../shaders/brightness-contrast.vs';
import * as brightnessContrastFragmentShader from '../shaders/brightness-contrast.fs';

import * as hueSaturationVertexShader from '../shaders/hue-saturation.vs';
import * as hueSaturationFragmentShader from '../shaders/hue-saturation.fs';

import { SceneManagerService } from "../services/scene-manager.service";
import { TextureManagerService } from "../services/texture-manager.service";
import { Box3 } from "three/src/math/Box3";
import { degToRad } from "three/src/math/MathUtils";
import { ObjectData } from "../types/galaxy-data.interface";
import { Subscription } from "rxjs";

  @Injectable({
    providedIn: 'root',
  })
export class GalaxyScene extends GameScene {
  // A flag to know when this scene has already been initialized
  private _initialized = false;

  private _composer!: EffectComposer;
  private _renderPass!: RenderPass;

  // The Galaxy meshes
  private _galaxy!: GalaxyMesh;
  private _grid!: SectorsGridMesh;
  private _clouds!: NebulaeCloudsMesh;
  private _dust!: NebulaeDustMesh;
  private _core!: NebulaeCoreMesh;

  // The sector highlighted floating callout
  private _sectorHighlightedCallout!: GalaxySectorHoverMesh;
  // The Sector highlighted hexagon hover mesh
  private _sectorHighlighted!: HighlightedSectorMesh;

  // The highlighted floating callout for the sectors with player owned systems
  private _sectorPlayerOwnedHighlighted: GalaxySectorPlayerOwnedMesh[] = [];
  private _sectorPlayerOwnedAdded = false;

  private BrightnessContrastShader = {
    uniforms: {
      tDiffuse: null,
      uContrast: {
        value: 0.04
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
        value: 0.25
      }
    },
    vertexShader: hueSaturationVertexShader.default,
    fragmentShader: hueSaturationFragmentShader.default
  };


  private _eventSub1!: Subscription;
  private _eventSub2!: Subscription;

  private _introSub1!: Subscription;
  private _introSub2!: Subscription;
  private _introSub3!: Subscription;
  private _introSub4!: Subscription;
  private _introSub5!: Subscription;

  constructor(private sceneManager: SceneManagerService,
    private readonly eventManager: EventManagerService,
    private readonly log: LogManagerService,
    private readonly textureManager: TextureManagerService,
    private readonly dataManager: DataManagerService) {
    super();

    this.name = 'Galaxy Scene';
  }

  public override get composer(): EffectComposer {
    return this._composer;
  }

  public dispose(): void {
    this.log.warn('onDispose', this);

    // Remove all the callouts and single instance meshes
    this.deactivate();

    this.removeGalaxy();

    this.removeEvents();

    this._galaxy?.dispose?.();
    this._grid?.dispose?.();
    this._clouds?.dispose?.();
    this._dust?.dispose?.();
    this._core?.dispose?.();

    // Finally reset the initialization state
    this._initialized = false;
  }



  public init(): GameScene {
    this.log.warn('onInit', this);

    // Avoid doing this initialization multiple times
    if (this._initialized) {
      return this;
    }

    this._renderPass = this.setupRenderpass();
    this._composer = this.setupComposer();

    this._galaxy = new GalaxyMesh(this.dataManager.velorum.solarSystems, this.sceneManager.Camera);
    this._clouds = new NebulaeCloudsMesh();
    this._dust = new NebulaeDustMesh();
    this._core = new NebulaeCoreMesh();

    this._grid = new SectorsGridMesh(this.dataManager.velorum.sectors);

    this._sectorHighlighted = new HighlightedSectorMesh();
    this._sectorHighlightedCallout = GalaxySectorHoverMesh.SetupCallout();

    // Do this last so the skybox exists
    this.setupPostProcessing();

    // Add the minimum subjects to the scene, the galaxy and skyboxes
    this
      .addBackground()
      .addGalaxy();

    // Listen to events
    this.addEvents();

    // Set as initialized
    this._initialized = true;

    return this;
  }

  public activate(onlyIfInactive = false): GameScene {
    if (onlyIfInactive && (this.sceneManager.GetActive() && this.sceneManager.GetActive()?.name === this.name)) {
      return this; // Return early if the active scene is this one
    }

    this.initRenderer(); // Do this before the camera so it updates its projection matrix accordingly
    this.initControls();
    this.initCamera();

    this.sceneManager.SetActiveByName(this.name);

    // If the intro is complete, turn everything on
    if (this.sceneManager.IntroComplete) {
      // Add the callouts with a nice fade in effect
      this.addSectorHoverCallout();
    }

    return this;
  }

  // This method is called when switching to a different scene,
  // It is NOT disposing, so only remove callouts that need to now show anywhere else
  public deactivate(): GameScene {
    // Remove callouts
    this.removeCallouts();
    this.removeSectorHoverCallout();
    this.removePlayerOwnedCallouts();
    this.removeSectorHighlight();

    return this;
  }

  public initRenderer(): GameScene {
    // Set the canvas temporarity to width by width to make the shader render things in the right ratio
    this.sceneManager.RendererWebGL.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.sceneManager.RendererWebGL.toneMappingExposure = 0.9;

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

    this.sceneManager.Controls.minDistance = 7500;
    this.sceneManager.Controls.maxDistance = 200000;
    this.sceneManager.Controls.distance = 70000; // This overrides the coordinates of the camera

    this.sceneManager.Controls.dollySpeed = 0.1;
    // this.sceneManager.Controls.truckSpeed = 2;
    // this.sceneManager.Controls.polarRotateSpeed = 2;
    // this.sceneManager.Controls.azimuthRotateSpeed = 2;

    // This controls the speed of transitions, if needed can be overriden
    this.sceneManager.Controls.dampingFactor = 0.1;

    this.sceneManager.Controls.setPosition(-65000, 39000, 900);

    this.sceneManager.Controls.setBoundary(new Box3(
      new Vector3( -50000, -5000, -50000 ),
      new Vector3( 50000, 5000, 50000 )
    ));

    return this;
  }

  private addEvents() {
    this._eventSub2 = this.eventManager.on(OnPlayerClaimedSectorsLoadedEvent, (sectors) => this.onPlayerClaimedSectorsLoaded(sectors), this);

    // Intro Events
    this._introSub1 = this.eventManager.on(OnIntroCompleteEvent, () => this.onIntroComplete(), this);
  }

  private removeEvents() {
    this.eventManager.off(OnGalaxyCalloutToggleEvent, this._eventSub1);
    this.eventManager.off(OnPlayerClaimedSectorsLoadedEvent, this._eventSub2);

    // Intro Events
    this.eventManager.off(OnIntroCompleteEvent, this._introSub1 );
    this.eventManager.off(OnIntroArgosCalloutClickEvent, this._introSub2);

    // Show argos
    this.eventManager.off(OnIntroShowArgosCalloutEvent, this._introSub3);
    // Show Saul
    this.eventManager.off(OnIntroShowSaulCalloutEvent, this._introSub4);
    // At the end of the intro, move the camera back to the center of the Galaxy
    this.eventManager.off(OnIntroCompleteSaveEvent, this._introSub5);
  }

  private onIntroComplete() {
    // Add all the missing things
    this
      .addSectorHighlight()
      .addSectorHoverCallout();

    // Race condition
    if (this._sectorPlayerOwnedAdded) {
      this.showPlayerOwnedCallouts();
    }

  }

  private onPlayerClaimedSectorsLoaded(systems: any[] | null) {
    // Systems come from firestore:
    // class, id, name, sector, type

    // Reset every time this loads
    this._sectorPlayerOwnedHighlighted = [];

    if (systems) {
      // Group by sector and add the systems
      const sectors: any[] = [];

      for (let i = 0; i < systems.length; i++) {
        const currentSystem = systems[i];

        // If sector doesnt exist yet create it
        const sector = sectors.find(sector => sector.id === currentSystem.sector);
        const vSystem = this.dataManager.velorum.solarSystems[currentSystem.id];

        if (!sector) {
          const vSector = this.dataManager.velorum.sectors[currentSystem.sector];
          sectors.push({ id: currentSystem.sector, sector: vSector, systems: [vSystem]});
        } else {
          sector.systems.push(vSystem);
        }

      }

      // Now create the callouts by sector
      sectors.forEach(sector => {
        const callout = GalaxySectorPlayerOwnedMesh.SetupCallout(sector.sector, sector.systems);
        callout.setPosition(sector.sector.coordinates);
        callout.element.onclick = () => {
          this.eventManager.emit(OnGalaxySectorClickEvent, { id: sector.sector.id, x: sector.sector.coordinates.x, y: sector.sector.coordinates.z }, this);
        }

        this._sectorPlayerOwnedHighlighted.push(callout);
      })

      this.removePlayerOwnedCallouts()
        .addPlayerOwnedCallouts()
        .showPlayerOwnedCallouts();
    }
  }

  private showPlayerOwnedCallouts() {
    this._sectorPlayerOwnedHighlighted.forEach(callout => callout.show());
  }

  public addPlayerOwnedCallouts(): GalaxyScene {
    if (this._sectorPlayerOwnedHighlighted.length > 0) {
      this.add(...this._sectorPlayerOwnedHighlighted);
    }

    // Keep a flag to know if we've added these or not, so we toggle them if the intro is complete (Race condition here)
    this._sectorPlayerOwnedAdded = true;

    return this;
  }

  public removePlayerOwnedCallouts(): GalaxyScene {
    const playerOwned = this.children.filter(c => c.name === GalaxySectorPlayerOwnedMesh.name);

    if (playerOwned.length > 0) {
      this.remove(...playerOwned);
    }

    return this;
  }

  public addGalaxy(): GalaxyScene {
    // Add our subjects to the scene
    this.add(
      this._galaxy,
      this._clouds,
      this._dust,
      this._core,
      this._grid,
      );


    return this;
  }

  public addSectorHighlight(): GalaxyScene {
    this.add(
      this._sectorHighlighted
    );

    return this;
  }

  public removeSectorHighlight(): GalaxyScene {
    this.remove(
      this._sectorHighlighted
    );

    return this;
  }

  public addBackground(): GalaxyScene {
    this.background = this.textureManager.galaxySkybox;

    return this;
  }

  public removeGalaxy(): GalaxyScene {

    this.remove(
      this._galaxy,
      this._clouds,
      this._dust,
      this._core,
      this._grid,
      );


    return this;
  }


  public addSectorHoverCallout(): GalaxyScene {
    // Add the CSS2Renderer objects separately
    this.add(
      this._sectorHighlightedCallout
    );

    return this;
  }

  public removeCallouts(): GalaxyScene {
    // Can't do this bc the code is minified!
    const callouts = this.children.filter(c => c.name === 'GalaxyCaptainPOIMesh' || c.name === 'GalaxyLocationPOIMesh');

    this.remove(
      ...callouts
    );

    return this;
  }

  public removeSectorHoverCallout(): GalaxyScene {
    this.remove(
      this._sectorHighlightedCallout
    );

    return this;
  }

  public update(delta?: number): GameScene {
    // Update the meshes
    this._galaxy.update(delta);
    this._grid.update(delta);
    this._sectorHighlighted.update(delta);
    this._clouds.update(delta);
    this._dust.update(delta);
    this._core.update(delta);

    // Update the Callouts
    this._sectorHighlightedCallout.update(delta);

    // Render!!
    this._composer.render(delta);

    // Finally the CSS Rendererers
    this.sceneManager.RendererCSS2D.render(this, this.sceneManager.Camera);

    return this;
  }

  public override handleRaycast(raycaster: Raycaster): GameScene {
    let gridHits = null;
    let gridHitcount = 0;

    // Hits on the galaxy grid
    gridHits = raycaster.intersectObject( this._grid );
    gridHitcount = gridHits.length;

    if ( gridHitcount > 0 ) {
      const hit = gridHits[ 0 ];

      // .point is the coordinates
      const matrix = new Matrix4();

      const mesh = this._grid as InstancedMesh;
      mesh.getMatrixAt(hit.instanceId as number, matrix);

      // Members 12 and 14 of the matrix are x and z coordinates of the hit, bet there is a better way to get the position
      const hoveredTilePosition = new Vector2(matrix.elements[12], matrix.elements[14]);

      // Move the hexSector mesh to the right position inside the rotating parent
      this._sectorHighlighted.moveTo(hoveredTilePosition);

      // Find the coordinates for the sector hovered, based on the instanceid of the grid
      const instanceId = hit.instanceId as number;
      const sector = this.dataManager.velorum.sectors[instanceId];

      // And store the coordinates and the id for the click event so we dont traverse the array
      this._sectorHighlighted.setTileCoordinates(sector.coordinates.x, sector.coordinates.y);
      this._sectorHighlighted.setInstanceId(instanceId);

      // Show the hover callout with the sector name
      this._sectorHighlightedCallout.setPositionVector2(hoveredTilePosition);
      this._sectorHighlightedCallout.setText(sector.name);
    }

    return this;
  }

  public override onClick(raycaster: Raycaster): void {
    let sectorHits = null;
    let sectorHitcount = 0;

    // Hits on the galaxy grid
    sectorHits = raycaster.intersectObject( this._sectorHighlighted );
    sectorHitcount = sectorHits.length;

    if ( sectorHitcount > 0 ) {
      // Notify the scene manager which sector we are loading
      this.eventManager.emit(OnGalaxySectorClickEvent, { id: this._sectorHighlighted.instanceId, x: this._sectorHighlighted.tilex, y: this._sectorHighlighted.tiley }, this);
    }
  }

  private setupPostProcessing() {
    const bloomEffect = new UnrealBloomPass(
      new Vector2( 512, 512 ),
      1.25, // strength
      0.25, // radius
      0.0, // threshold
    );

    this._composer.addPass(bloomEffect);
  }

  public setupRenderpass(): RenderPass {
    return new RenderPass(this, this.sceneManager.Camera);
  }

  public setupComposer(): EffectComposer {
    const composer = new EffectComposer(this.sceneManager.RendererWebGL);

    composer.addPass(this._renderPass);
    composer.addPass(new ShaderPass(this.BrightnessContrastShader));
    composer.addPass(new ShaderPass(this.HueSaturationShader));

    return composer;
  }

}
