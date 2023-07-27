import { Vector2 } from "three";
import { Vector3 } from "three";
import { Bounds } from "./bounds.model";
import { Celestial } from "./celestial.model";
import { Planet } from "./planet.model";
import { Sector } from "./sector.model";
import { SolarSystem } from "./solarsystem.model";


export class Galaxy {

  public readonly name!: string;
  private _bounds!: Bounds;

  // Flag to let the managers know the data is fully loaded or not
  private _loaded = false;

  // Store all the sectors in this array, inside each there is an array of solar systems, used to enter/exit the sector view without having to traverse the entire ss array
  private _sectors!: Array<Sector>;

  // This array is for easy access to actually generate the galaxy mesh in runtime.
  private _solarSystems!: Array<SolarSystem>;

  // This one contains black holes and anything else important in the map
  private _celestials!: Array<Celestial>;

  // The whole list of planets
  private _planets!: Array<Planet>;

  // Finally this is for the callouts/points of interest
  private _poi!: Array<any>;


  constructor(name: string) {
    this.name = name;

    this._sectors = [];
    this._solarSystems = [];
    this._planets = [];
    this._celestials = [];
    this._poi = [];

    this._bounds = Bounds.Zero();
  }

  public dispose(): void {
    if (this.SelectedSector) {
      if (this.SelectedSector.SelectedSystem) {
        this.SelectedSector.SelectedSystem.deselect();
      }
      this.SelectedSector.deselect();
    }

    if (this.HighlightedSector) {
      this.HighlightedSector.highlighted = false;
    }
  }

  public get loaded() {
    return this._loaded;
  }
  public set loaded(value: boolean) {
    this._loaded = value;
  }

  public get bounds() {
    return this._bounds;
  }
  public set bounds(value: Bounds) {
    this._bounds = value;
  }

  public get sectors() {
    return this._sectors;
  }
  public set sectors(value: Array<Sector>) {
    this._sectors = value;
  }

  public get solarSystems() {
    return this._solarSystems;
  }
  public set solarSystems(value: Array<SolarSystem>) {
    this._solarSystems = value;

    this.addSolarSystemsToSectors();
  }

  public get planets() {
    return this._planets;
  }
  public set planets(value: Array<Planet>) {
    this._planets = value;

    this.addPlanetsToSolarSystems();
  }

  public get celestials() {
    return this._celestials;
  }
  public set celestials(value: Array<Celestial>) {
    this._celestials = value;
  }

  public get poi() {
    return this._poi;
  }
  public set poi(value: Array<any>) {
    this._poi = value;
  }

  public get SelectedSector(): Sector {
    return this._sectors.find(s => s.selected) as Sector;
  }

  public get HighlightedSector(): Sector {
    return this._sectors.find(s => s.highlighted) as Sector;
  }

  public get Styx(): SolarSystem {
    return this._solarSystems.find(s => s.name === 'Styx') as SolarSystem;
  }

  public get Saul()  {
    return this._poi.find(s => s.name === 'Saul McGrail');
  }

  public SelectSector(id: number): Sector {
    const sector = this._sectors.find(s => s.id === id) as Sector;
    sector.selected = true;
    return sector;
  }

  public GetSectorByTileCoordinates(coordinates: Vector2): Sector {
    return this._sectors.find(s => s.coordinates.equals(new Vector3(coordinates.x, 0, coordinates.y))) as Sector;
  }

  private addSolarSystemsToSectors() {
    this._solarSystems.forEach((system) => {
      // Add the solar system to its sector
      this._sectors[system.sector].solarSystems.push(system);
      system.sectorCenter = this._sectors[system.sector].bounds.center;
    });
  }

  private addPlanetsToSolarSystems() {
    this._planets.forEach((planet) => {
      this._solarSystems[planet.id].planets.push(planet);
    });
  }

}

