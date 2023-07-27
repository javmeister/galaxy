import { Vector2 } from "three";
import { Vector3 } from "three";
import { SectorHS, SectorR, SectorTileHeight, SectorTileWidth } from "../../utils/constants";
import { Bounds } from "./bounds.model";
import { SolarSystem } from "./solarsystem.model";
import { Star } from "./star.model";

export class Sector {
  public readonly id!: number;
  public readonly regionId!: number;
  public name!: string;
  public readonly tile!: Vector2;
  public readonly center!: Vector3;

  public readonly bounds!: Bounds;

  private _coordinates!: Vector3;
  private _selected = false;
  private _highlighted = false;

  private _solarSystems: Array<SolarSystem> = [];

  /**
   * The data from the CDN comes compressed into colon-separated strings, the constructor gets the array of splitted strings from the data service
   * @param fields
   */
  constructor(...fields: Array<string>) {
    this.id = parseInt(fields[0], 10);
    this.regionId = parseInt(fields[1], 10);
    this.name = fields[2];
    this.tile = new Vector2(parseInt(fields[3]), parseInt(fields[4]));
    this.center = new Vector3(parseFloat(fields[6]), 0, parseFloat(fields[5])); // x and y are flipped!!

    if (this.tile.y % 2 === 0) {
      // even
      this._coordinates = new Vector3( this.tile.x * SectorTileWidth, 0, this.tile.y * SectorHS);
    } else {
      // odd
      this._coordinates = new Vector3( (this.tile.x * SectorTileWidth) + SectorR, 0, this.tile.y * SectorHS);
    }

    this.bounds = new Bounds(
      new Vector2(this.coordinates.x - (SectorTileWidth / 2), this.coordinates.y - (SectorTileHeight / 2)),
      new Vector2(this.coordinates.x + (SectorTileWidth / 2), this.coordinates.y + (SectorTileHeight / 2))
      );
  }

  public get selected(): boolean {
    return this._selected;
  }
  public set selected(value: boolean) {
    this._selected = value;
  }

  public get highlighted(): boolean {
    return this._highlighted;
  }
  public set highlighted(value: boolean) {
    this._highlighted = value;
  }

  public get solarSystems(): Array<SolarSystem> {
    return this._solarSystems;
  }

  public set solarSystems(value: Array<SolarSystem>) {
    this._solarSystems = value;
    // Sort them by id
    this._solarSystems = this._solarSystems.sort((a, b) => b.id - a.id);
  }

  public get stars(): Array<Star> {
    return this._solarSystems.map(s => s.stars).flat();
  }

  public get coordinates(): Vector3 {
    return this._coordinates;
  }

  public select(): void {
    this._selected = true;
  }

  public deselect(): void {
    this._selected = false;
  }

  public toggle(): void {
    this._selected = !this._selected;
  }

  public get SelectedSystem(): SolarSystem {
    return this._solarSystems.find(s => s.selected) as SolarSystem;
  }

  public SelectSystem(id: number): SolarSystem {
    const system = this._solarSystems.find(s => s.id === id) as SolarSystem;
    system.selected = true;

    // Also select the star
    system.primary.select();

    return system;
  }

  public DeselectSystem(id: number): SolarSystem {
    const system = this._solarSystems.find(s => s.id === id) as SolarSystem;
    system.selected = false;

    // Also deselect the stars
    system.primary.deselect();
    system.secondary?.deselect?.();

    return system;
  }

  public toJson(compressed = false): string {
    return compressed ?
      `"${this.id}:${this.name}:${this.tile.x}:${this.tile.y}:${this.center.z}:${this.center.x}"` :
      `{"i":${this.id},"n":"${this.name}","t":"${this.tile.x}:${this.tile.y}","c":"${this.center.z}:${this.center.x}"}`;
  }


}
