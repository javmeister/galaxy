import { Injectable } from '@angular/core';
import { GameScene, THREE_SUBSET } from '@velorum/shared';
import CameraControls from 'camera-controls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { ACESFilmicToneMapping } from 'three/src/constants';
import { Clock } from 'three/src/core/Clock';
import { Raycaster } from 'three/src/core/Raycaster';
import { degToRad } from 'three/src/math/MathUtils';
import { Vector2 } from 'three/src/math/Vector2';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';

@Injectable({
  providedIn: 'root',
})
export class SceneManagerService {
  private name = 'SceneManagerService';

  // Internal flag
  private _initialized = false;

  // Canvas & Renderers
  private _rendererWebGL!: WebGLRenderer;
  private _rendererCSS2D!: CSS2DRenderer;
  private _canvasWebGL!: HTMLCanvasElement;
  private _divElementCSS2D!: HTMLDivElement;

  // Camera
  private _camera!: PerspectiveCamera;
  private _clock!: Clock;
  private _cameraControls!: CameraControls;

  // For the animation loop
  private _requestAnimationFrameId!: number;

  // Screen resolution
  private _mouse!: Vector2;
  private _mouseState = {
    held: false,
    lastClick: 0,
    clicked: false,
  }

  // Raycast
  private _lastRaycast = 0;
  private _raycastInterval = 25;
  private _queueRaycast = true;
  private _raycaster!: Raycaster;

  // Scenes
  private _scenes: Array<GameScene> = [];
  private _scene!: GameScene;

  // Intro stuff
  private _introComplete = true;

  //#region Public Properties
  public get Camera(): PerspectiveCamera {
    return this._camera;
  }

  public get Controls(): CameraControls {
    return this._cameraControls;
  }

  public get RendererWebGL(): WebGLRenderer {
    return this._rendererWebGL;
  }
  public set RendererWebGL(value: WebGLRenderer) {
    this._rendererWebGL = value;
  }

  public get RendererCSS2D(): CSS2DRenderer {
    return this._rendererCSS2D;
  }
  public set RendererCSS2D(value: CSS2DRenderer)  {
    this._rendererCSS2D = value;
  }

  public get CanvasWebGL(): HTMLCanvasElement {
    return this._canvasWebGL;
  }
  public set CanvasWebGL(value: HTMLCanvasElement)  {
    this._canvasWebGL = value;
  }

  public get CanvasCSS2D(): HTMLDivElement {
    return this._divElementCSS2D;
  }
  public set CanvasCSS2D(value: HTMLDivElement)  {
    this._divElementCSS2D = value;
  }

  public get Mouse(): Vector2 {
    return this._mouse;
  }

  public get MouseState(): any {
    return this._mouseState;
  }

  public get QueueRaycast(): boolean {
    return this._queueRaycast;
  }

  public set QueueRaycast(value: boolean) {
    this._queueRaycast = value;
  }

  public get RaycastInterval(): number {
    return this._raycastInterval;
  }

  public get LastRaycast(): number {
    return this._lastRaycast;
  }

  public get Raycaster(): Raycaster {
    return this._raycaster;
  }


  public get IntroComplete(): boolean {
    return this._introComplete;
  }

  public set IntroComplete(value: boolean) {
    this._introComplete = value;
  }
  //#endregion


  public dispose(): void {
    // Ask every scene to dispose all geometry and objects
    this._scenes.forEach(scene => {
      scene.dispose();
    });

    // Destroy the array of scenes!!!!!
    this._scenes = [];

    // Also remove the pointer to the active scene
    (this._scene as any) = null;

    // Destroy the camera and cameracontrols
    this._cameraControls.dispose();

    // Stop the animate loop
    if (this._requestAnimationFrameId) {
      cancelAnimationFrame(this._requestAnimationFrameId);
    }

    // Finally set as uninitialized or the scenes won't come back if we browse away
    this._initialized = false;
  }

  public AddScene(scene: GameScene, active = false) {
    this._scenes.push(scene);

    if (this._initialized) {
      scene.init();
    }

    if (active) {
      this.SetActive(scene);
    }
  }

  public GetActive() {
    return this._scene;
  }

  public SetActive(scene: GameScene) {
    this._scene = this._scenes.find(s => s.name === scene.name) as GameScene;
  }

  public SetActiveByName(name: string) {
    this._scene = this._scenes.find(s => s.name === name) as GameScene;
  }

  public GetScene(scene: GameScene) {
    return this._scenes.find(s => s.name === scene.name) as GameScene;
  }

  public GetSceneByName(name: string) {
    return this._scenes.find(s => s.name === name) as GameScene;
  }

  /**
   * Initialize the Threejs renderers, this needs to be done every time we come back into the map routes
   */
  public Init() {
    this._clock = new Clock();
    this._mouse = new Vector2(1, 1);

    CameraControls.install( { THREE: THREE_SUBSET } );

    this._rendererWebGL = this.SetupWebGLRenderer(this._canvasWebGL);
    this._rendererCSS2D = this.SetupCSS2DRenderer(this._divElementCSS2D);

    this._camera = this.SetupCamera();
    this._cameraControls = this.SetupCameraControls(this._camera, this._rendererWebGL);

    this._raycaster = new Raycaster();

    this._scenes.forEach(scene => scene.init());

    // Set the scene manager as fully initialized
    this._initialized = true;
  }

  public Animate() {
    this.Update();

    this._requestAnimationFrameId = requestAnimationFrame(() => this.Animate());
  }

  public Update() {
    const delta = this._clock.getDelta();

    // Camera controls needs to happen first
    this._cameraControls.update(delta);

    // TODO: Move this into each scene, it shouldn't always being rotating in the bg, technically only the Galaxy
    // Update the camera controls only if not holding any mouse btns
    if (!this._mouseState.held) { // && !DataManager.velorum.SelectedSector?.SelectedSystem) {
      const rotationSpeed = -0.25;
      this._cameraControls.azimuthAngle += degToRad(rotationSpeed * delta);
    }

    // Raycasting after the camera is updated
    if (Date.now() - this._lastRaycast > this._raycastInterval && this._queueRaycast) {
      // Minimize the amount of shit this shit does, it just fucking kills performance
      this._raycaster.setFromCamera( this._mouse, this._camera );

      // Tell the active scene to handle raycasts
      this._scene?.handleRaycast?.(this.Raycaster);

      this._lastRaycast = Date.now();
      this._queueRaycast = false;
    }

    // Then the active scene
    this._scene?.update(delta);
  }

  public warmUpScenes() {
    // Warm up both Galaxy and Sector scenes, they are not active so even if tricking their composers to render one frame won't show up
    this._scenes.forEach(scene => scene?.composer?.render?.(0));
  }

  public OnClick(event: MouseEvent): void {
    this._scene.onClick?.(this._raycaster);
  }

  private SetupCamera() {
    const camera = new PerspectiveCamera(
      27,
      this._canvasWebGL.clientWidth / this._canvasWebGL.clientHeight,
      5,
      5000000
    );

    camera.updateProjectionMatrix();

    return camera;
  }

  private SetupCameraControls(
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ): CameraControls {
    const controls = new CameraControls( camera, renderer.domElement );

    controls.dampingFactor = 0.01;
    controls.draggingDampingFactor = 0.25;

    controls.mouseButtons.left = CameraControls.ACTION.NONE;
    controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
    controls.mouseButtons.middle = CameraControls.ACTION.TRUCK;
    controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;

    controls.dollyToCursor = true;

    return controls;
  }

  private SetupWebGLRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
    // WARNING: In this line you might get an exception if the browser has been open too long
    // "Cant create WebGL Context"
    // If so, either refresh the window, or tell the player to do it.
    const rendererWebGL = new WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });

    rendererWebGL.setClearColor(0x000000, 0);
    rendererWebGL.setPixelRatio(window.devicePixelRatio);
    rendererWebGL.setSize(window.innerWidth, window.innerHeight);

    rendererWebGL.toneMapping = ACESFilmicToneMapping // ReinhardToneMapping; // ACESFilmicToneMapping; //  CineonToneMapping; // LinearToneMapping;
    rendererWebGL.toneMappingExposure = 0.9; // Default on the Galaxy View

    // rendererWebGL.outputEncoding = sRGBEncoding;

    return rendererWebGL;
  }

  private SetupCSS2DRenderer(canvas: HTMLDivElement): CSS2DRenderer {
    const rendererCSS2D = new CSS2DRenderer({ element: canvas });

    rendererCSS2D.setSize(window.innerWidth, window.innerHeight);
    rendererCSS2D.domElement.style.position = 'absolute';
    rendererCSS2D.domElement.style.top = '0';

    return rendererCSS2D;
  }

}
