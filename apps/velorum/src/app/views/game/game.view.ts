import { Component, ElementRef, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { GalaxyScene } from '../../scenes/galaxy.scene';
import { SectorScene } from '../../scenes/sector.scene';
import { SceneManagerService } from '../../services/scene-manager.service';
import { TextureManagerService } from '../../services/texture-manager.service';
import { DataManagerService, EventManagerService, LogManagerService, OnGalaxyModelReadyEvent,
  OnScenesReadyEvent, OnSectorSelectedEvent, Sector } from '@velorum/shared';


@Component({
  selector: 'velorum-galaxy-game',
  templateUrl: './game.view.html',
  styleUrls: ['./game.view.scss'],
})
export class GameView implements OnInit, OnDestroy {
  private name = 'GameView';

  @HostBinding('class.fade-out') get fadeOut() { return this._fadeOut; }
  @HostBinding('class.fade-in') get fadeIn() { return !this._fadeOut; }
  @HostBinding('class.anywhere') get anywhere() { return this._anywhere; }

  public showStart = false;
  public showSpinner = true;

  private _anywhere = false;
  private _fadeOut = false;
  private _clickListener!: () => void;

  private profileSubscription!: Subscription;
  private userSubscription!: Subscription;

  private _onGalaxyModelReadyEventSub!: Subscription;
  private _onSectorSelectedEventSub!: Subscription;

  private onWindowResizeCallback!: () => void;
  private onMouseMoveCallback!: (event: MouseEvent) => void;
  private onMouseDownCallback!: (event: MouseEvent) => void;
  private onMouseUpCallback!: (event: MouseEvent) => void;
  private onCanvasClickCallback!: (event: MouseEvent) => void;

  constructor(private readonly sceneManager: SceneManagerService,
    private readonly eventManager: EventManagerService,
    private readonly log: LogManagerService,
    private readonly textureManager: TextureManagerService,
    private readonly galaxyScene: GalaxyScene,
    private readonly sectorScene: SectorScene,
    private readonly dataManager: DataManagerService,
    private elementRef: ElementRef) {}


  ngOnInit(): void {
    this.log.warn('onInit', this);

    // Inject the canvas in the document
    const webglCanvas = this.createHtmlElement<'canvas'>('canvas', 'webgl', 'webgl');
    const css2dDivElement = this.createHtmlElement<'div'>('div', 'css2d', 'css2d');

    this.elementRef.nativeElement.appendChild(webglCanvas);
    this.elementRef.nativeElement.appendChild(css2dDivElement);

    // Getting native elements can only be done after the view has been initialized
    this.sceneManager.CanvasWebGL = webglCanvas;
    this.sceneManager.CanvasCSS2D = css2dDivElement;

    // Get skybox textures first
    this.textureManager.LoadSkyboxCubeTexturesFromHTMLImages();

    // Add all event listeners, this has to be done here
    // since the canvas element is only available afterviewinit
    this.addGlobalEvents();

    // Do this last, first the renderer needs to be initialized if we are calling the method directly
    // then you gotta wait to the entire galaxy is loaded to do anything beyond this
    if (this.dataManager.velorum.loaded) {
      // If it is already loaded, start

      // SO SO HACKY!
      // This blocks angular from showing the spinner, but if I move it into afterviewinit I get tons
      // of erros of changedafterchecked shit, so need to let angular finish the lifecycle by adding a hacky
      // 1ms delay, which will allow the components to load before this code runs and triggers threejs
      // blocking thread
      setTimeout(() => {
        this.onGalaxyModelReady();
      }, 1);
    } else {
      this._onGalaxyModelReadyEventSub = this.eventManager.on(OnGalaxyModelReadyEvent, () => this.onGalaxyModelReady(), this);
    }

    // Used to load the solar systems the player has claimed in a sector
    this._onSectorSelectedEventSub = this.eventManager.on(OnSectorSelectedEvent, (sector: Sector) => this.onSectorSelected(sector), this);

  }

  ngOnDestroy(): void {
    this.log.warn('onDestroy', this);

    // Subscriptions
    this.profileSubscription?.unsubscribe?.();
    this.userSubscription?.unsubscribe?.();

    // The scene manager will dispose all the scenes
    this.sceneManager.dispose();

    // Kill all the event listeners too
    this.eventManager.dispose();

    // And the manual click listener on the host
    this._clickListener?.();

    // Remove all event listeners
    this.removeGlobalEvents();
    this.removeListeners();
  }

  private addGlobalEvents() {
    this.onWindowResizeCallback = this.throttle(() => this.onWindowResize(), 250);
    window.addEventListener('resize', this.onWindowResizeCallback, true);

    this.onCanvasClickCallback = (event) => this.onCanvasClick(event);
    this.sceneManager.CanvasWebGL.addEventListener('click', this.onCanvasClickCallback, true);

    this.onMouseMoveCallback = (event) => this.onMouseMove(event);
    document.addEventListener('mousemove', this.onMouseMoveCallback, true);

    this.onMouseDownCallback = (event) => this.onMouseDown(event);
    document.addEventListener('mousedown', this.onMouseDownCallback, true);

    this.onMouseUpCallback = (event) => this.onMouseUp(event);
    document.addEventListener('mouseup', this.onMouseUpCallback, true);
  }

  private removeGlobalEvents() {
    // Remove event listeners
    this.sceneManager.CanvasWebGL.removeEventListener('click', this.onCanvasClickCallback, true);

    window.removeEventListener('resize', this.onWindowResizeCallback, true);

    document.removeEventListener('mousemove', this.onMouseMoveCallback, true);
    document.removeEventListener('mousedown', this.onMouseDownCallback, true);
    document.removeEventListener('mouseup', this.onMouseUpCallback, true);
  }

  private removeListeners() {
    this.eventManager.off(OnGalaxyModelReadyEvent, this._onGalaxyModelReadyEventSub);
    this.eventManager.off(OnSectorSelectedEvent, this._onSectorSelectedEventSub);
  }

  private onGalaxyModelReady() {
    // Add the scenes
    this.sceneManager.AddScene(this.galaxyScene);
    this.sceneManager.AddScene(this.sectorScene);

    // Initialize and Animate, the loading screen takes over
    this.sceneManager.Init();
    this.sceneManager.Animate();

    // Warm up all scenes here
    this.sceneManager.warmUpScenes();

    // Tell the app the game is fully ready
    this.eventManager.emit(OnScenesReadyEvent, undefined, this);
  }

  private onSectorSelected(sector: Sector) {
    // TODO:
  }


  private onWindowResize() {
    if(!this.sceneManager.Camera) {
      return;
    }

    this.sceneManager.Camera.aspect = window.innerWidth / window.innerHeight;
    this.sceneManager.Camera.updateProjectionMatrix();

    this.sceneManager.RendererWebGL.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.sceneManager.RendererWebGL.setPixelRatio(window.devicePixelRatio);

    this.sceneManager.RendererCSS2D.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.setCanvasDimensions(this.sceneManager.RendererWebGL.domElement, window.innerWidth, window.innerHeight);
  }

  private onMouseMove( event: MouseEvent ) {
    event.preventDefault();

    // Avoid null
    if (!this.sceneManager.Mouse) {
      return;
    }

    this.sceneManager.Mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.sceneManager.Mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // If we are panning, don't queue a raycast
    this.sceneManager.QueueRaycast = !this.sceneManager.MouseState.held;
  }

  // My app has panning, and we don't wanna keep raycasting during pan
  private onMouseDown(event: MouseEvent) {
    this.sceneManager.MouseState.lastClick = Date.now();
    this.sceneManager.MouseState.clicked = false;
    this.sceneManager.MouseState.held = true;
  }

  private onMouseUp(event: MouseEvent) {
    this.sceneManager.MouseState.held = false;
  }

  private onCanvasClick(event: MouseEvent) {
    // Left button click only
    if (event.button === 0) {
      this.sceneManager.OnClick(event);
    }
  }



  private setCanvasDimensions(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    set2dTransform = false
  ) {
    const ratio = window.devicePixelRatio;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (set2dTransform) {
      canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  private throttle(fn: any, wait = 300) {
    let inThrottle: boolean,
      lastFn: ReturnType<typeof setTimeout>,
      lastTime: number;
    return (...args: any[]) => {
      if (!inThrottle) {
        fn.apply(this, args);
        lastTime = Date.now();
        inThrottle = true;
      } else {
        clearTimeout(lastFn);
        lastFn = setTimeout(() => {
          if (Date.now() - lastTime >= wait) {
            fn.apply(this, args);
            lastTime = Date.now();
          }
        }, Math.max(wait - (Date.now() - lastTime), 0));
      }
    };
  };

  private createHtmlElement<K extends keyof HTMLElementTagNameMap>(tagName: K, id: string, className: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    element.id = id;
    element.className = className;

    return element;
  }
}
