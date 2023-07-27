import { AdditiveBlending, DoubleSide, NormalBlending } from "three/src/constants";
import { Matrix4 } from "three/src/math/Matrix4";
import { Vector3 } from "three/src/math/Vector3";
import { Vector4 } from "three/src/math/Vector4";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { Sector, Star, StellarSize, TemperatureToColor, ColorTemperature, StellarClass } from "@velorum/shared";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Color } from "three/src/math/Color";


import * as TWEEN from '@tweenjs/tween.js';
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Texture } from "three/src/textures/Texture";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Quaternion } from "three/src/math/Quaternion";

export class SectorStarMesh extends InstancedMesh {
  private _geometry: PlaneGeometry;

  private _material: MeshBasicMaterial;
  private _texture: Texture;

  private _camera!: PerspectiveCamera;

  private _uniforms = {
    uCameraQueternion: { value: new Vector4() }
  };

  // PULSAR TWEENING
  private _pulsars: { [instanceId: number]: Star } = {};
  private _pulsarIds: Array<number> = [];
  private _scaleMultiplier = { multiplier: -0.05 }; // Pulsars are very small, around 1.5 in all axis
  private _bounceTween!: any;
  private _pulsarMatrix!: Matrix4;

  constructor(sector: Sector) {
    super(undefined, undefined, sector.stars.length);

    this._geometry = new PlaneGeometry(1, 1);

    this._texture = new TextureLoader().load(
      "assets/velorum/galaxy-map/sun-glow-mask.png"
    );

    this._material = new MeshBasicMaterial({
      map: this._texture,
      alphaTest: 0.01,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
      depthTest: true,
      color: 0xffffff,
      opacity: 1,
    });

    this._material.onBeforeCompile = (shader) => {
      shader.uniforms['uCameraQueternion'] = this._uniforms.uCameraQueternion;

      shader.vertexShader = `
        uniform vec4 uCameraQueternion;

        vec3 applyQuaternionToVector( vec4 q, vec3 v ){
            return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
        }

        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>

        transformed = applyQuaternionToVector(uCameraQueternion, transformed);
        `
      );
    };

    this.geometry = this._geometry;
    this.material = this._material;


    for (let i = 0; i < sector.stars.length; i++) {
      const star = sector.stars[i];

      const matrix = new Matrix4();

      const size = StellarSize.NormalizeToRange(star.radius, 0.00001, 10, 2.5, 20);

      matrix.setPosition( star.coordinates );
      matrix.scale(new Vector3(size, size, size));

      const tempColor = TemperatureToColor.GetColorFromStellarClass(star.type) as ColorTemperature;
      this.setColorAt( i, new Color(tempColor.Color));

      // If pulsar, store it
      if (star.type === StellarClass.Pulsar) {
        this._pulsars[i] = star;
      }

      this.setMatrixAt( i, matrix );
    }


    // Get the Ids for quick lookup on the update method
    this._pulsarIds = Object.keys(this._pulsars).map(i => parseInt(i));
    this._pulsarMatrix = new Matrix4();

    // Start the tween
    this.setPulsarBounceTween();
  }

  public get camera(): PerspectiveCamera {
    return this._camera;
  }

  public set camera(value: PerspectiveCamera) {
    this._camera = value;
  }


  public override dispose() {
    this._geometry?.dispose?.()
    this._material?.dispose?.();
    this._bounceTween?.stop?.();
    this._bounceTween = null;
  }

  public update(delta?: number) {
    // Update the stars planes to always face the camera too
    this._uniforms.uCameraQueternion.value.copy(this._camera.quaternion as any); // Cheat to pass a Q as a Vector4

    TWEEN.update();

    // Make pulsars pulsate
    this._pulsarIds.forEach((instanceId) => {
      this.getMatrixAt(instanceId, this._pulsarMatrix);
      const translation = new Vector3();
      const rotation = new Quaternion();
      const scale = new Vector3();
      this._pulsarMatrix.decompose(translation, rotation, scale);
      scale.addScalar(this._scaleMultiplier.multiplier);
      this._pulsarMatrix.compose(translation, rotation, scale);
      this.setMatrixAt(instanceId, this._pulsarMatrix);
    });

    this.instanceMatrix.needsUpdate = true;

    return this;
  }



  private setPulsarBounceTween() {
    this._bounceTween = new TWEEN.Tween(this._scaleMultiplier)
      .to({ multiplier: 0.05 }, 75)
      .yoyo(true)
      .repeat(Infinity)
      .start();
  }
}
