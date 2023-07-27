import { Matrix4 } from "three/src/math/Matrix4";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { Sector, SolarSystem, StellarSize } from "@velorum/shared";
import { degToRad } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Texture } from "three/src/textures/Texture";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { DoubleSide } from "three/src/constants";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Vector4 } from "three/src/math/Vector4";


export class SectorClaimedStarsIndicatorMesh extends InstancedMesh {
  private _geometry: PlaneGeometry;
  private _material: MeshBasicMaterial;
  private _texture: Texture;


  private _camera!: PerspectiveCamera;

  private _uniforms = {
    uCameraQueternion: { value: new Vector4() }
  };


  constructor(sector: Sector, systems: SolarSystem[]) {
    super(undefined, undefined, systems.length);

    // Need to harcode the name to avoid minification issues
    this.name = 'SectorClaimedStarsIndicatorMesh';

    this._geometry = new PlaneGeometry(1, 1);

    this._texture = new TextureLoader().load(
      "assets/velorum/galaxy-map/chevron-down-1.png"
    );

    this._material = new MeshBasicMaterial({
      map: this._texture,
      alphaTest: 0.01,
      side: DoubleSide,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      opacity: 0.75,
      color: 0xd7f0ff,
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

    for (let i = 0; i < systems.length; i++) {
      const system = systems[i];

      const matrix = new Matrix4();

      matrix.setPosition(system.coordinates.x, system.coordinates.y + 12, system.coordinates.z);
      matrix.scale(new Vector3(10, 13, 10));

      this.setMatrixAt( i, matrix );
    }
  }


  public get camera(): PerspectiveCamera {
    return this._camera;
  }

  public set camera(value: PerspectiveCamera) {
    this._camera = value;
  }


  public update(delta?: number) {
    // Update the planes to always face the camera too
    this._uniforms.uCameraQueternion.value.copy(this._camera.quaternion as any); // Cheat to pass a Q as a Vector4

    return this;
  }

  public override dispose() {
    this._geometry.dispose()
    this._material.dispose();
  }

}
