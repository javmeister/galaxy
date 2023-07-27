import { DoubleSide } from "three/src/constants";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { degToRad } from "three/src/math/MathUtils";
import { Matrix4 } from "three/src/math/Matrix4";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { Texture } from "three/src/textures/Texture";
import { Sector, SectorTileHeight, SectorTileWidth } from "@velorum/shared";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";


export class SectorsGridMesh extends InstancedMesh {


  private _geometry: PlaneGeometry;

  private _texture: Texture;

  private _material: MeshStandardMaterial;

  constructor(sectors: Sector[]) {
    super(undefined, undefined, sectors.length);

    this._geometry = new PlaneGeometry( SectorTileHeight, SectorTileWidth );
    this._geometry.rotateX(degToRad(90));
    this._geometry.rotateY(degToRad(90));

    this._texture = new TextureLoader().load(
      "assets/velorum/galaxy-map/basic-hex-tile-4px.png"
    );

    this._material = new MeshStandardMaterial({
      map: this._texture,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.2,
      emissive: 0x0a6192,
      emissiveIntensity: 1,
    });

    this.geometry = this._geometry;
    this.material = this._material;

    for (let i = 0; i < sectors.length; i++) {
      const sector = sectors[i];

      const matrix = new Matrix4();

      matrix.setPosition( sector.coordinates );

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


