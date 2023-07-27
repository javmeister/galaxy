import { Matrix4 } from "three/src/math/Matrix4";
import { InstancedMesh } from "three/src/objects/InstancedMesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { degToRad } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { AdditiveBlending, DoubleSide } from "three/src/constants";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { Quaternion } from "three/src/math/Quaternion";


export class NebulaeCloudsMesh extends InstancedMesh {
  private _geometry: PlaneGeometry;
  private _material: MeshBasicMaterial;

  private _positions = [
    new Vector3(-25619.7, 0, 51.7),
    new Vector3(-26719.5, 0, -5080.7),
    new Vector3(-22691.6, 0, 5893.8),
    new Vector3(-26667.8, 0, -10283.6),
    new Vector3(-25013.4, 0, -15025.9),
    new Vector3(-23476.5, 0, -18992.7),
    new Vector3(-21131.2, 0, 7736.2),
    new Vector3(-17535.7, 0, 11068.5),
    new Vector3(-14588.8, 0, 13272.8),
    new Vector3(15589.6, 0, 14269.2),
    new Vector3(13084.6, 0, 18881.8),
    new Vector3(17168.3, 0, 7928.0),
    new Vector3(9659.4, 0, 22798.6),
    new Vector3(5317.1, 0, 25322.72),
    new Vector3(1568.7, 0, 27334.4),
    new Vector3(4267.2, 0, 17282.0),
    new Vector3(-454.6, 0, 19574.3),
    new Vector3(9242.2, 0, 13044.9),
    new Vector3(-5519.6, 0, 20765.1),
    new Vector3(-10519.7, 0, 20289.7),
    new Vector3(-14738.6, 0, 19743.4),
    new Vector3(11332.9, 0, -15431.2),
    new Vector3(15882.9, 0, -12814.3),
    new Vector3(5032.0, 0, -17164.3),
    new Vector3(19714.8, 0, -9294.4),
    new Vector3(22132.0, 0, -4891.7),
    new Vector3(24051.5, 0, -1095.3),
    new Vector3(-4773.2, 0, -20677.6),
    new Vector3(140.1, 0, -22523.9),
    new Vector3(-10118.3, 0, -16918.1),
    new Vector3(5293.5, 0, -23241.8),
    new Vector3(10228.3, 0, -22306.6),
    new Vector3(14378.7, 0, -21372.9),
    new Vector3(33277.0, 0, 3081.0),
    new Vector3(34056.9, 0, 8271.7),
    new Vector3(30716.2, 0, -2931.1),
    new Vector3(33683.11, 0, 13461.4),
    new Vector3(31738.3, 0, 18092.1),
    new Vector3(29958.7, 0, 21956.2),
    new Vector3(-14161.3, 0, -16523.2),
    new Vector3(-11038.8, 0, -20742.3),
    new Vector3(-16607.2, 0, -10463.3),
    new Vector3(-7101.8, 0, -24144.2),
    new Vector3(-2450.5, 0, -26039.4),
    new Vector3(3792.9, 0, -2585),
    new Vector3(-6030.1, 0, -2585),
    // new Vector3(-869.5, 0, -2585),
    // new Vector3(-869.5, 0, -4056.1),
    // new Vector3(3792.9, 0, 2204.3),
    // new Vector3(-6030.1, 0, 2204.3),
    // new Vector3(-869.5, 0, 2204.3),
  ];

  private _scales = [
    new Vector3(27305.09, 1, 22537.25),
    new Vector3(22238.8, 1, 22238.8),
    new Vector3(25096.4, 1, 25096.4),
    new Vector3(23886.15, 1, 23886.15),
    new Vector3(23787.45, 1, 23787.45),
    new Vector3(22861.55, 1, 22861.55),
    new Vector3(20859.35, 1, 20859.35),
    new Vector3(20859.35, 1, 20859.35),
    new Vector3(20859.35, 1, 20859.35),
    new Vector3(27305.09, 1, 22537.25),
    new Vector3(22238.8, 1, 22238.8),
    new Vector3(25096.4, 1, 25096.4),
    new Vector3(23886.15, 1, 23886.15),
    new Vector3(23787.45, 1, 23787.45),
    new Vector3(22861.55, 1, 22861.55),
    new Vector3(27305.09, 1, 22537.25),
    new Vector3(22238.8, 1, 22238.8),
    new Vector3(25096.4, 1, 25096.4),
    new Vector3(23886.15, 1, 23886.15),
    new Vector3(23787.45, 1, 23787.45),
    new Vector3(22861.55, 1, 22861.55),
    new Vector3(27305.09, 1, 22537.25),
    new Vector3(22238.8, 1, 22238.8),
    new Vector3(25096.4, 1, 25096.4),
    new Vector3(23886.15, 1, 23886.15),
    new Vector3(23787.45, 1, 23787.45),
    new Vector3(22861.55, 1, 22861.55),
    new Vector3(23844.07, 1, 20029.8),
    new Vector3(19791.03, 1, 19791.03),
    new Vector3(25096.4, 1, 22077.12),
    new Vector3(23886.15, 1, 23886.15),
    new Vector3(23787.45, 1, 23787.45),
    new Vector3(22861.55, 1, 22861.55),
    new Vector3(27305.09, 1, 22537.25),
    new Vector3(22238.8, 1, 22238.8),
    new Vector3(25096.4, 1, 25096.4),
    new Vector3(23886.15, 1, 23886.15),
    new Vector3(23787.45, 1, 23787.45),
    new Vector3(22861.55, 1, 22861.55),
    new Vector3(27305.09, 1, 22537.25),
    new Vector3(22238.8, 1, 22238.8),
    new Vector3(25096.4, 1, 25096.4),
    new Vector3(23886.15, 1, 23886.15),
    new Vector3(23787.45, 1, 23787.45),
    new Vector3(51915.27, 1, 37611.75),
    new Vector3(51915.27, 1, 37611.75),
    // new Vector3(51915.27, 1, 37611.75),
    // new Vector3(51915.27, 1, 37611.75),
    // new Vector3(51915.27, 1, 37611.75),
    // new Vector3(51915.27, 1, 37611.75),
    // new Vector3(51915.27, 1, 37611.75),
  ];

  private _rotations = [
    new Quaternion(0, 0.5591929034707469, 0, 0.8290375725550416),
    new Quaternion(0, 0.5150380749100543, 0, 0.8571673007021123),
    new Quaternion(0, 0.7071067811865475, 0, 0.7071067811865476),
    new Quaternion(0, 0.3973080629844951, 0, 0.9176852963230414),
    new Quaternion(0, 0.3450197273182341, 0, 0.9385954334862552),
    new Quaternion(0, 0.970691319633907, 0, -0.24032969435212184),
    new Quaternion(0, 0.754835520604765, 0, 0.6559141230628699),
    new Quaternion(0, 0.8776360230668884, 0, 0.4793276656060405),
    new Quaternion(0, 0.8110229792631932, 0, 0.5850142964980037),
    new Quaternion(0, 0.9715491199976461, 0, -0.2368381460656188),
    new Quaternion(0, 0.9826127965436152, 0, -0.1856666153855772),
    new Quaternion(0, 0.9085081775267219, 0, -0.41786707380107674),
    new Quaternion(0, 0.998527216584255, 0, -0.05425308968621406),
    new Quaternion(0, 0.9999979150467948, 0, 0.002042033805650518),
    new Quaternion(0, -0.1113648644621785, 0, 0.9937795867109167),
    new Quaternion(0, 0.997440782930944, 0, 0.07149744433268597),
    new Quaternion(0, 0.9923319378854888, 0, 0.12360147674049288),
    new Quaternion(0, 0.9927573419294455, 0, -0.1201368388346469),
    new Quaternion(0, 0.9673120271596827, 0, 0.25358912065036515),
    new Quaternion(0, 0.9515031674499462, 0, 0.30763894801003283),
    new Quaternion(0, -0.4098275145988876, 0, 0.9121630382106581),
    new Quaternion(0, -0.5299192642332048, 0, 0.8480480961564261),
    new Quaternion(0, -0.5735764363510462, 0, 0.8191520442889918),
    new Quaternion(0, -0.35836794954530027, 0, 0.9335804264972017),
    new Quaternion(0, -0.6767474861960565, 0, 0.7362152130507209),
    new Quaternion(0, -0.7171174291411099, 0, 0.6969523605111365),
    new Quaternion(0, 0.6143678294227296, 0, 0.7890197527124425),
    new Quaternion(0, 0.1607425656038262, 0, 0.9869963665602319),
    new Quaternion(0, -0.16934950384902456, 0, 0.9855560590580779),
    new Quaternion(0, 0.1607425656038262, 0, 0.9869963665602319),
    new Quaternion(0, -0.29804135033600254, 0, 0.9545529600236397),
    new Quaternion(0, -0.35130245848710245, 0, 0.9362620267109618),
    new Quaternion(0, 0.8922393061949261, 0, 0.4515628643730538),
    new Quaternion(0, -0.8459605744452448, 0, 0.5332454467543737),
    new Quaternion(0, 0.8727091252470528, 0, -0.488240496794893),
    new Quaternion(0, -0.7286698680161346, 0, 0.6848651133218489),
    new Quaternion(0, 0.9295514379336852, 0, -0.36869245209987433),
    new Quaternion(0, 0.9488319294754227, 0, -0.31578152195457276),
    new Quaternion(0, 0.21014756383884062, 0, 0.9776696790903361),
    new Quaternion(0, 0.43365908458754393, 0, 0.9010770213220918),
    new Quaternion(0, 0.1166707370993327, 0, 0.993170649538486),
    new Quaternion(0, 0.35347484377925664, 0, 0.9354440308298675),
    new Quaternion(0, -0.015532805679965254, 0, 0.9998793586966921),
    new Quaternion(0, -0.07179338781907432, 0, 0.9974195253079117),
    new Quaternion(0, 0.5591929034707469, 0, 0.8290375725550416),
    new Quaternion(0, 0.8746197071393959, 0, -0.48480962024633695),
    // new Quaternion(0, -0.28401534470392253, 0, 0.9588197348681932),
    // new Quaternion(0, 0.9563047559630354, 0, 0.29237170472273677),
    // new Quaternion(0, -0.6691306063588583, 0, 0.7431448254773941),
    // new Quaternion(0, 0.6883545756937539, 0, 0.7253743710122876),
    // new Quaternion(0, 0.9990482215818578, 0, 0.04361938736533588),
  ];

  constructor() {
    super(undefined, undefined, 51);

    this._geometry = new PlaneGeometry(1, 1);
    this._geometry.rotateX(degToRad(-90)); // 90 deg, make the plane horizontal

    const nebulaTexture = new TextureLoader().load(
      'assets/velorum/galaxy-map/nebula2.png'
    );
    this._material = new MeshBasicMaterial({
      map: nebulaTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.17,
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
