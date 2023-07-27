import { Vector3 } from "three";
import { CelestialType } from "../../types/celestialtype.enum";

export class Celestial {
  public readonly id!: number; // this is the solar system id!!
  private readonly _name!: string;

  public coordinates!: Vector3;
  public readonly systemCoordinates!: Vector3;

  public readonly type!: CelestialType;
  public readonly radius!: number;
  public readonly mass!: number;

  private _selected = false;

  constructor(id: number, name: string, coordinates: Vector3, systemCoordinates: Vector3, type: CelestialType) {
    this.id = id;
    this._name = name;
    this.coordinates = coordinates;
    this.systemCoordinates = systemCoordinates;

    this.type = type;
  }

  public get name(): string {
    return this._name;
  }

  public get selected(): boolean {
    return this._selected;
  }

  public set selected(value: boolean) {
    this._selected = value;
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


  public get CelestialType() {
    switch(this.type) {
      case 0: return 'Black Hole';
      default: return 'Black Hole';
    }
  }

  public toJson(): string {
    return `${this.type}:${this.coordinates.x}:${this.coordinates.y}:${this.coordinates.z}`;
  }
}
