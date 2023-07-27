import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { Raycaster } from "three/src/core/Raycaster";
import { Scene } from "three/src/scenes/Scene";

// MERGING DECLARATIONS to make methods optional

export interface GameScene {
  composer: EffectComposer;

  // optional methods
  handleRaycast?(raycaster: Raycaster): GameScene;
  onClick?(raycaster: Raycaster): void;
}

export abstract class GameScene extends Scene {
  abstract dispose(): void;
  abstract init(): GameScene;
  abstract activate(onlyIfInactive?: boolean): GameScene;
  abstract deactivate(): GameScene;
  abstract update(delta?: number): GameScene;
}
