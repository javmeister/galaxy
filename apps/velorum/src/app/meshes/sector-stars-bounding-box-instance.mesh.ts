import { AdditiveBlending, DoubleSide, NoBlending } from "three/src/constants";
import { Matrix4 } from "three/src/math/Matrix4";
import { Vector3 } from "three/src/math/Vector3";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { Sector, StellarSize } from "@velorum/shared";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";

import { BoxGeometry } from "three/src/geometries/BoxGeometry";


export class SectorStarsBoundingBoxMesh extends InstancedMesh {
  private _geometry: BoxGeometry;
  private _material: MeshBasicMaterial;

  constructor(sector: Sector) {
    super(undefined, undefined, sector.solarSystems.length);

    this._geometry = new BoxGeometry(1, 1, 1);

    this._material = new MeshBasicMaterial({
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
      depthWrite: false,
      depthTest: true,
      color: 0x000000,
      opacity: 0,
    });

    this.geometry = this._geometry;
    this.material = this._material;

    const sizeMult = 6;

    for (let i = 0; i < sector.solarSystems.length; i++) {
      const system = sector.solarSystems[i];

      const matrix = new Matrix4();

      const size = StellarSize.NormalizeToRange(system.primary.radius, 0.00001, 10, 3, 3);

      matrix.setPosition( system.coordinates );
      matrix.scale(new Vector3(size * sizeMult, size * sizeMult, size * sizeMult));

      this.setMatrixAt( i, matrix );
    }
  }

  public override dispose() {
    this._geometry.dispose()
    this._material.dispose();
  }

  public update(delta?: number) {
    return this;
  }
}
