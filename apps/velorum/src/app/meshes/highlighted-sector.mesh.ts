import { AdditiveBlending, DoubleSide } from "three/src/constants";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { degToRad } from "three/src/math/MathUtils";
import { Group } from "three/src/objects/Group";
import { Mesh } from "three/src/objects/Mesh";
import { SectorTileHeight, SectorTileWidth } from "@velorum/shared";
import { Vector2 } from "three/src/math/Vector2";

export class HighlightedSectorMesh extends Group {

  // private _sectorText!: any;

  public instanceId!: number;
  public tilex!: number;
  public tiley!: number;

  // private _textMaterial!: MeshBasicMaterial;
  private _meshMaterial!: MeshBasicMaterial;

  constructor() {
    super();

    // Need to harcode the name to avoid minification issues
    this.name = 'HighlightedSectorMesh';

    // TODO: Switch this to ShapeGeometry with custom vertices
    const geometry = new PlaneGeometry( SectorTileHeight, SectorTileWidth );

    geometry.rotateX(degToRad(90));
    geometry.rotateY(degToRad(90));

    const hexTexture = new TextureLoader().load(
      "assets/velorum/galaxy-map/basic-hex-tile-4px.png"
    );

    this._meshMaterial = new MeshBasicMaterial({
      map: hexTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 1,
      color: 0x0a6192
    });

    const hexSectorMesh = new Mesh( geometry, this._meshMaterial);
    const hexSectorMeshInner = new Mesh( geometry, this._meshMaterial);
    const hexSectorMeshMiddle = new Mesh( geometry, this._meshMaterial);
    const hexSectorMeshBottom = new Mesh( geometry, this._meshMaterial);

    hexSectorMeshInner.scale.set(0.9, 1, 0.9);
    hexSectorMeshBottom.scale.set(0.9, 1, 0.9);
    hexSectorMeshMiddle.scale.set(0.9, 1, 0.9);
    hexSectorMeshMiddle.position.set(0, -125, 0);
    hexSectorMeshBottom.position.set(0, -200, 0);

    this.add(hexSectorMesh, hexSectorMeshInner, hexSectorMeshMiddle, hexSectorMeshBottom);

    return this;
  }

  public setInstanceId(id: number) {
    this.instanceId = id;
  }

  public setTileCoordinates(x: number, y: number) {
    this.tilex = x;
    this.tiley = y;
  }

  public moveTo(target: Vector2) {
    // Change the color of the text depending on how crowded the sector you are selecting is
    this.position.set(target.x, 200, target.y);
  }

  public update(delta?: number) {

    return this;
  }
}
