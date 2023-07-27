import { SolarSystem } from "@velorum/shared";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Vector3 } from "three/src/math/Vector3";


export class SectorSelectedSystemCalloutMesh extends CSS2DObject {

  constructor(element: HTMLDivElement, position?: Vector3) {
    super(element);

    // Need to harcode the name to avoid minification issues
    this.name = 'SectorSelectedSystemCalloutMesh';

    if (position) {
      this.position.set(position.x, position.y, position.z);
    } else {
      this.position.set(0, 500000, 0); // Move it off screen if position is null
    }
  }

  public static SetupCallout(system: SolarSystem | undefined): SectorSelectedSystemCalloutMesh {
    const element = SectorSelectedSystemCalloutMesh.CreateHTMLElement(system?.name);

    return new SectorSelectedSystemCalloutMesh(element, system?.coordinates);
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

}
