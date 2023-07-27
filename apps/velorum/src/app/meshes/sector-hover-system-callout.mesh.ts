import { SolarSystem } from "@velorum/shared";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Vector3 } from "three/src/math/Vector3";


export class SectorHoverSystemCalloutMesh extends CSS2DObject {
  private _enabled = false;

  constructor(element: HTMLDivElement, position?: Vector3, enabled = false) {
    super(element);

    // Need to harcode the name to avoid minification issues
    this.name = 'SectorHoverSystemCalloutMesh';

    if (enabled) {
      this._enabled = enabled;
    }

    if (position) {
      this.position.set(position.x, position.y, position.z);
    }
  }

  public static SetupCallout(system: SolarSystem | undefined): SectorHoverSystemCalloutMesh {
    const element = SectorHoverSystemCalloutMesh.CreateHTMLElement(system?.name);

    return new SectorHoverSystemCalloutMesh(element, system?.coordinates);
  }

  public static CreateHTMLElement(name?: string) {
    const newCallout = document.createElement('div');
    newCallout.className = `system-selected-callout`;

    const spinnerContainer = document.createElement('div');
    spinnerContainer.className = 'reticle-container';

    const spinner = document.createElement('div');
    spinner.className = 'reticle';

    spinnerContainer.appendChild(spinner);

    const calloutContainer = document.createElement('div');
    calloutContainer.className = `details`;

    const calloutSystemName = document.createElement('span');
    calloutSystemName.className = 'name';
    calloutSystemName.innerText = `${name}`;

    calloutContainer.appendChild(calloutSystemName);

    newCallout.appendChild(spinnerContainer);
    newCallout.appendChild(calloutContainer);

    return newCallout;
  }

  public setPosition(position: Vector3) {
    this.position.set(position.x, position.y, position.z);
  }

  public update(delta?: number) {
    //
  }

  public toggle() {
    this._enabled = !this._enabled;
  }
}
