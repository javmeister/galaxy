import { Sector, SolarSystem } from "@velorum/shared";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";


export class GalaxySectorPlayerOwnedMesh extends CSS2DObject {
  private _visible = false;

  constructor(element: HTMLDivElement, position?: Vector3, visible = false) {
    super(element);

    // Need to harcode the name to avoid minification issues
    this.name = 'GalaxySectorPlayerOwnedMesh';

    if (visible) {
      this._visible = visible;
    }

    this.setVisibility();

    if (position) {
      this.position.set(position.x, position.y, position.z);
    }
  }


  public static SetupCallout(sector: Sector, systems: SolarSystem[]): GalaxySectorPlayerOwnedMesh {
    const element = GalaxySectorPlayerOwnedMesh.CreateHTMLElement(sector?.name);
    const mesh = new GalaxySectorPlayerOwnedMesh(element);

    mesh.setText(sector?.name, systems.length);

    return mesh;
  }

  public static CreateHTMLElement(text?: string) {
    // Main container for the whole thing, reticle and info box
    const sectorHover = document.createElement('div');

    sectorHover.className = 'sector-player-owned-label';
    sectorHover.id = 'sector-player-owned-label';

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

  public setText(sectorName: string, systemCount: number) {
    if (this.element.querySelector('.info')) {
      (this.element.querySelector('.info') as HTMLDivElement).innerHTML = `SECTOR ${sectorName}<br>${systemCount} SYSTEM${systemCount > 1 ? 'S' : ''} CLAIMED`;
    }
  }

  public update(delta?: number) {
    //
  }

  public show() {
    this._visible = true;
    this.setVisibility();
  }

  public hide() {
    this._visible = false;
    this.setVisibility();
  }

  public toggle() {
    this._visible = !this._visible;
    this.setVisibility();
  }

  private setVisibility() {
    if (this._visible) {
      this.element.classList.remove('fade-out');
      this.element.classList.add('fade-in');
    } else {
      this.element.classList.remove('fade-in');
      this.element.classList.add('fade-out');
    }
  }
}
