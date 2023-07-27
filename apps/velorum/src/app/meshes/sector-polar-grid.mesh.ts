import { PolarGridHelper } from "../helpers/polargrid.helper";
import { Group } from "three/src/objects/Group";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { DoubleSide } from "three/src/constants";
import { Text } from "troika-three-text";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";

export class SectorPolarGridMesh extends Group {

  private _polarGrid!: PolarGridHelper;

  private _textLabels: Array<any> = [];
  private _textMaterial!: MeshBasicMaterial;

  constructor(private camera: PerspectiveCamera, radius = 700, sectors = 8, segments = 16, divisions = 128, opacity = 0.4) {
    super();

    this._textMaterial = new MeshBasicMaterial({
      // blending: NoBlending,
      side: DoubleSide,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      opacity: 0.75,
      color: 0x6db9e5
    });

    this._polarGrid = new PolarGridHelper(radius, sectors, segments, divisions, 0x0a6192, 0x0f5370, opacity );

    // Add the number to all 4 horizontal axis directions
    for (let index = 0; index < segments; index++) {
      // Create:
      const sectorTextPX = new Text();
      const sectorTextNX = new Text();
      const sectorTextPZ = new Text();
      const sectorTextNZ = new Text();

      // Set properties to configure:
      sectorTextPX.fontSize = 5;
      sectorTextNX.fontSize = 5;
      sectorTextPZ.fontSize = 5;
      sectorTextNZ.fontSize = 5;

      sectorTextPX.material = this._textMaterial;
      sectorTextNX.material = this._textMaterial;
      sectorTextPZ.material = this._textMaterial;
      sectorTextNZ.material = this._textMaterial;

      // Fade out with distance to the center
      sectorTextPX.material.opacity = 0.75 - (index / 30);
      sectorTextNX.material.opacity = 0.75 - (index / 30);
      sectorTextPZ.material.opacity = 0.75 - (index / 30);
      sectorTextNZ.material.opacity = 0.75 - (index / 30);

      // The text
      sectorTextPX.text = `${(index + 1) * 5}`;
      sectorTextNX.text = `${(index + 1) * 5}`;
      sectorTextPZ.text = `${(index + 1) * 5}`;
      sectorTextNZ.text = `${(index + 1) * 5}`;

      // +X
      sectorTextPX.position.x = ((index + 1) * 43.8) - 3;
      sectorTextPX.position.z = 0;
      // -X
      sectorTextNX.position.x = ((index + 1) * -43.8) - 3;
      sectorTextNX.position.z = 0;
      // +Z
      sectorTextPZ.position.x = 0;
      sectorTextPZ.position.z = ((index + 1) * 43.8) - 3;
      // -Z
      sectorTextNZ.position.x = 0;
      sectorTextNZ.position.z = ((index + 1) * -43.8) - 3;

      // Y axis is the same for all
      sectorTextPX.position.y = 7;
      sectorTextNX.position.y = 7;
      sectorTextPZ.position.y = 7;
      sectorTextNZ.position.y = 7;

      // Update the rendering:
      sectorTextPX.sync();
      sectorTextNX.sync();
      sectorTextPZ.sync();
      sectorTextNZ.sync();

      this._textLabels.push(sectorTextPX, sectorTextNX, sectorTextPZ, sectorTextNZ);
    }

    // Add the numbers
    this.add(...this._textLabels);

    // Finally add the grid lines
    this.add(this._polarGrid);
  }


  public update(delta?: number) {
    this._textLabels.forEach(text => {
      // Look at the camera
      text.lookAt(this.camera.position);
      // TODO: Increase/Decrease the text size depending on the distance to the camera?
    });

    return this;
  }

  public dispose() {
    this._polarGrid?.dispose?.();
  }

}
