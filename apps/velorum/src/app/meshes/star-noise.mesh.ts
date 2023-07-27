import { Mesh } from "three/src/objects/Mesh";

import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { SphereGeometry } from "three/src/geometries/SphereGeometry";
import { DoubleSide } from "three/src/constants";

import * as suncubevs from '../shaders/suncube.vs';
import * as suncubefs from '../shaders/suncube.fs';

export class StarNoiseMesh extends Mesh {
  private _material: ShaderMaterial;
  private _geometry: SphereGeometry;

  constructor() {
    super();

    this._material = new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: suncubevs.default,
      fragmentShader: suncubefs.default,
    });

    this._geometry = new SphereGeometry(1, 32, 24);

    this.geometry = this._geometry;
    this.material = this._material;

    // Hide from view
    this.position.set(0, 50000, 0);
  }


  public update(delta?: number) {
    this._material.uniforms['uTime'].value += delta;

    return this;
  }

}
