import { DoubleSide } from "three/src/constants";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Color } from "three/src/math/Color";
import { Matrix4 } from "three/src/math/Matrix4";
import { Vector3 } from "three/src/math/Vector3";
import { Vector4 } from "three/src/math/Vector4";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { Texture } from "three/src/textures/Texture";
import { ColorTemperature, SolarSystem, StellarSize, TemperatureToColor } from "@velorum/shared";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";



export class GalaxyMesh extends InstancedMesh {
  private _geometry: PlaneGeometry;
  private _texture: Texture;
  private _material: MeshBasicMaterial;

  private _uniforms = {
    camQ: { value: new Vector4() }
  };

  constructor(systems: SolarSystem[], private camera: PerspectiveCamera) {
    super(undefined, undefined, systems.length);

    this._geometry = new PlaneGeometry(15, 15);

    this._texture = new TextureLoader().load(
      "assets/galaxy_star_2_alpha.png"
    );

    this._material = new MeshBasicMaterial({
      map: this._texture,
      alphaTest: 0.005,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
      depthTest: false,
      color: 0xffffff
    });

    this._material.onBeforeCompile = (shader) => {
      shader.uniforms['camQ'] = this._uniforms.camQ;
      shader.vertexShader = `
        uniform vec4 camQ;

        vec3 applyQuaternionToVector( vec4 q, vec3 v ){
            return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
        }

        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>

        transformed = applyQuaternionToVector(camQ, transformed);
        `);
    };

    this.frustumCulled = false;

    this.geometry = this._geometry;
    this.material = this._material;

    for (let i = 0; i < systems.length; i++) {
      const vector = new Vector3();

      const matrix = new Matrix4();

      const system = systems[i];

      // WARNING: In Unity x and z are flipped!!
      vector.x = system.coordinates.z;
      vector.y = system.coordinates.y * 15; // Oversize the galaxy map height to make it more volumetric
      vector.z = system.coordinates.x;

      const distanceToZero = new Vector3(0,0,0).distanceTo(vector);

      let size = 0;
      if (distanceToZero > 0 && distanceToZero < 6110) {
        size = StellarSize.NormalizeToRange(system.radius, 0.00001, 10, 3, 15);
      } else if (distanceToZero >= 6110 && distanceToZero < 11750) {
        size = StellarSize.NormalizeToRange(system.radius, 0.00001, 10, 3.5, 20);
      } else {
        size = StellarSize.NormalizeToRange(system.radius, 0.00001, 10, 4, 25);
      }

      matrix.scale(new Vector3(size, size, size));

      matrix.setPosition( vector.x, vector.y, vector.z );

      this.setMatrixAt( i, matrix );
      this.setColorAt( i, new Color(TemperatureToColor.GetColorFromExactTemperature(system.temperature)?.Hex) );

      // const tempColor = TemperatureToColor.GetColorFromStellarClass(system.type) as ColorTemperature;
      // this.setColorAt( i, new Color(tempColor.Color));
    }
  }

  public override dispose() {
    this._geometry.dispose()
    this._material.dispose();
  }


  public update(delta?: number) {
    // Update the stars planes to always face the camera too
    this._uniforms.camQ.value.copy(this.camera.quaternion as any); // Cheat to pass a Q as a Vector4


    return this;
  }
}
