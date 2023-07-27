import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { degToRad } from "three/src/math/MathUtils";
import { Group } from "three/src/objects/Group";
import { Mesh } from "three/src/objects/Mesh";
import { AdditiveBlending, DoubleSide, MultiplyBlending, NoBlending, NormalBlending, RepeatWrapping } from "three/src/constants";
import { Vector2 } from "three/src/math/Vector2";

export class SectorGridMesh extends Group {

  constructor(tileX: number, tileY: number) {
    super();

    const hexGridTexture = new TextureLoader().load('assets/velorum/galaxy-map/hex-pattern-1.png');

    hexGridTexture.repeat = new Vector2(tileX, tileY);
    hexGridTexture.wrapS = RepeatWrapping;
    hexGridTexture.wrapT = RepeatWrapping;

    const hexGridMaterial = new MeshBasicMaterial({
      map: hexGridTexture,
      blending: AdditiveBlending,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.5,
      color: 0x0a6192
    });


    this.renderOrder = 20;

    const gp_hexGrid = new PlaneGeometry(1, 1);
    gp_hexGrid.rotateX(degToRad(-90)); // 90 deg, make the plane horizontal

    // Create the mesh with geometry and material
    const ms_hexGrid = new Mesh(gp_hexGrid, hexGridMaterial);

    // Finally add the mesh to the group
    this.add(ms_hexGrid);
  }



  public update(delta?: number) {


    return this;
  }

}
