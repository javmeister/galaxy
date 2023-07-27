import { Matrix4 } from "three/src/math/Matrix4";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { degToRad } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { AdditiveBlending, DoubleSide } from "three/src/constants";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { Quaternion } from "three/src/math/Quaternion";


export class NebulaeCoreMesh extends InstancedMesh {
  private _geometry: PlaneGeometry;
  private _material: MeshBasicMaterial;

  private _positions = [new Vector3(0, 2, 0), new Vector3(0, 1, 0)];

  private _scales = [
    new Vector3(48692, 1, 35250),
    new Vector3(27730, 1, 20022),
  ];

  private _rotations = [
    new Quaternion(0, 0.9862856015372314, 0, -0.16504760586067757),
    new Quaternion(0, 0.9862856015372314, 0, -0.16504760586067757),
  ];

  constructor() {
    super(undefined, undefined, 2);

    this._geometry = new PlaneGeometry(1, 1);
    this._geometry.rotateX(degToRad(-90)); // 90 deg, make the plane horizontal

    const dustTexture = new TextureLoader().load(
      'assets/velorum/galaxy-map/center.png'
    );
    this._material = new MeshBasicMaterial({
      map: dustTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      toneMapped: true,
      opacity: 0.05,
      color: 0xf5620d
    });

    this.geometry = this._geometry;
    this.material = this._material;

    for (let i = 0; i < this._rotations.length; i++) {
      const matrix = new Matrix4();

      matrix.makeRotationFromQuaternion(this._rotations[i]);
      matrix.setPosition(this._positions[i]);
      matrix.scale(this._scales[i]);

      this.setMatrixAt(i, matrix);
    }
  }

  public update(delta?: number) {
    return this;
  }

  public override dispose() {
    this._geometry.dispose();
    this._material.dispose();
  }
}
