import { Matrix4 } from "three/src/math/Matrix4";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { Sector, StellarSize } from "@velorum/shared";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { degToRad } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Texture } from "three/src/textures/Texture";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { DoubleSide } from "three/src/constants";
import { Color } from "three/src/math/Color";


export class SectorStarsBoundaryMesh extends InstancedMesh {
  private _geometry: PlaneGeometry;
  private _material: MeshBasicMaterial;
  private _texture: Texture;

  constructor(sector: Sector) {
    super(undefined, undefined, sector.solarSystems.length);

    this._geometry = new PlaneGeometry(1, 1);
    this._geometry.rotateX(degToRad(-90)); // 90 deg, make the plane horizontal

    this._texture = new TextureLoader().load(
      "assets/velorum/galaxy-map/system-boundary.png"
    );

    this._material = new MeshBasicMaterial({
      map: this._texture,
      side: DoubleSide,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      opacity: 0.4,
      color: 0xffffff
    });

    this.geometry = this._geometry;
    this.material = this._material;

    for (let i = 0; i < sector.solarSystems.length; i++) {
      const system = sector.solarSystems[i];

      const matrix = new Matrix4();

      const scale = StellarSize.NormalizeToRange(system.primary.radius, 0.00001, 10, 4, 10);

      matrix.setPosition(system.coordinates);
      matrix.scale(new Vector3(10 * scale, 1, 10 * scale));

      this.setMatrixAt( i, matrix );

      this.setColorAt( i, new Color(0xffffff) );
    }
  }

  public update(delta?: number) {

    return this;
  }

  public override dispose() {
    this._geometry.dispose()
    this._material.dispose();
  }

}
