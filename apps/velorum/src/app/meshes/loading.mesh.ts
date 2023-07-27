import { Mesh } from "three/src/objects/Mesh";
import { degToRad } from "three/src/math/MathUtils";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { Vector2 } from "three/src/math/Vector2";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";

import * as vs from '../shaders/starfield.vs';
import * as fs from '../shaders/starfield.fs';

export class LoadingMesh extends Mesh {
  private _material: ShaderMaterial;
  private _geometry: PlaneGeometry;

  private _uniforms = {
    uTime: { value: Math.random() * 1000.0 },
    uResolution: { value: new Vector2(15,15) },
    uSpeed: { value: 0.001 },
    uBrightness: { value: 0.0005 }
  };

  constructor() {
    super();

    this._geometry = new PlaneGeometry(1, 1);

    this.position.set(0,0,0);
    this.rotateX(degToRad(-90))

    this._material = new ShaderMaterial( {
      uniforms: this._uniforms,
      vertexShader: vs.default,
      fragmentShader: fs.default
    });

    this.geometry = this._geometry;
    this.material = this._material;
  }


  public update(delta?: number) {
    // Update the uniforms
    this._uniforms.uTime.value += delta as number;

    return this;
  }

  public dispose() {
    this._geometry.dispose();
    this._material.dispose();
  }

}
