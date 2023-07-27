import { Matrix4 } from "three/src/math/Matrix4";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { degToRad } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { AdditiveBlending, DoubleSide } from "three/src/constants";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { Quaternion } from "three/src/math/Quaternion";


export class NebulaeDustMesh extends InstancedMesh {
  private _geometry: PlaneGeometry;
  private _material: MeshBasicMaterial;

  private _positions = [
    new Vector3(-897.7, 0, -686.2),
    new Vector3(-568.7, 1, -1137.4),
    new Vector3(277.3, 2, -4154.8),
    new Vector3(-869.5, 3, 733.2),
  ];

  private _scales = [
    new Vector3(38080.61025, 1, 27588.765),
    new Vector3(89250.14474999999, 1, 64625),
    new Vector3(33212.14815, 1, 24063.765),
    new Vector3(36529.61025, 1, 26437.5),
  ];

  private _rotations = [
    new Quaternion(0, -0.7253743710122877, 0, 0.688354575693754),
    new Quaternion(0, -0.3255681544571567, 0, 0.9455185755993168),
    new Quaternion(0, -0.77162458338772, 0, 0.636078220277764),
    new Quaternion(0, 0, 0, 1),
  ];

  constructor() {
    super(undefined, undefined, 4);

    this._geometry = new PlaneGeometry(1, 1);
    this._geometry.rotateX(degToRad(-90)); // 90 deg, make the plane horizontal

    const dustTexture = new TextureLoader().load(
      'assets/velorum/galaxy-map/dust.png'
    );
    this._material = new MeshBasicMaterial({
      map: dustTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.3,
      color: 0xb0dff5,
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
