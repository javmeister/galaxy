import { Sector } from "@velorum/shared";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";


export class GalaxySectorHoverMesh extends CSS2DObject {

  constructor(element: HTMLDivElement, position?: Vector3) {
    super(element);

    if (position) {
      this.position.set(position.x, position.y, position.z);
    }
  }

  public static SetupCallout(sector?: Sector): GalaxySectorHoverMesh {
    const element = GalaxySectorHoverMesh.CreateHTMLElement(sector?.name);

    return new GalaxySectorHoverMesh(element, new Vector3(0, 1000000, 0));
  }

  public static CreateHTMLElement(text?: string) {
    // Main container for the whole thing, reticle and info box
    const sectorHover = document.createElement('div');

    sectorHover.className = 'sector-hover-label';
    sectorHover.id = 'sector-hover-label';

    const sectorHoverReticle = document.createElement('div');
    sectorHoverReticle.className = 'reticle';

    const sectorHoverInfo = document.createElement('div');
    sectorHoverInfo.className = 'info';

    sectorHoverInfo.innerHTML = text || '';

    // Disable context menu
    sectorHover.addEventListener('contextmenu', (event) => { event.preventDefault(); });

    sectorHover.appendChild(sectorHoverReticle);
    sectorHover.appendChild(sectorHoverInfo);

    return sectorHover;
  }

  public setPosition(position: Vector3) {
    this.position.set(position.x, position.y, position.z);
  }

  public setPositionVector2(position: Vector2) {
    this.position.set(position.x, 0, position.y);
  }

  public setText(text: string) {
    if (this.element.querySelector('.info')) {
      (this.element.querySelector('.info') as HTMLDivElement).innerHTML = `SECTOR ${text}`;
    }
  }

  public update(delta?: number) {
    //
  }
}
