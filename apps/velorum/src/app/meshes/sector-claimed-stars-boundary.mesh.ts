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


export class SectorClaimedStarsBoundaryMesh extends InstancedMesh {
  private _geometry: PlaneGeometry;
  private _material: MeshBasicMaterial;
  private _texture: Texture;

  private _rotationSpeed = 10;

  constructor(sector: Sector, systems: SolarSystem[]) {
    super(undefined, undefined, systems.length);

    // Need to harcode the name to avoid minification issues
    this.name = 'SectorClaimedStarsBoundaryMesh';

    this._geometry = new PlaneGeometry(1, 1);
    this._geometry.rotateX(degToRad(-90)); // 90 deg, make the plane horizontal

    this._texture = new TextureLoader().load(
      "assets/velorum/galaxy-map/sector-selected-object-base-glow.png"
    );

    this._material = new MeshBasicMaterial({
      map: this._texture,
      side: DoubleSide,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      opacity: 1,
      color: 0x6cbaf1,
    });

    this.geometry = this._geometry;
    this.material = this._material;

    for (let i = 0; i < systems.length; i++) {
      const system = systems[i];

      const matrix = new Matrix4();

      const scale = StellarSize.NormalizeToRange(system.primary.radius, 0.00001, 10, 4, 10);

      matrix.setPosition(system.coordinates.x, system.coordinates.y + 0.01, system.coordinates.z);
      matrix.scale(new Vector3(14 * scale, 1, 14 * scale));

      this.setMatrixAt( i, matrix );
    }
  }

  public update(delta?: number) {
    // Animate a rotation
    this._geometry.rotateY(degToRad(-(delta as number) * this._rotationSpeed));

    return this;
  }

  public override dispose() {
    this._geometry.dispose()
    this._material.dispose();
  }

}
