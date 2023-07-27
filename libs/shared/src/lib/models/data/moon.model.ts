import { Vector3 } from "three";
import { MoonClass } from "../../types/moonclass.enum";

export class Moon {
  public readonly id!: number; // this is the solar system id!!
  private readonly _name!: string;

  public coordinates!: Vector3;
  public readonly systemCoordinates!: Vector3;

  public readonly type!: MoonClass;
  public readonly radius!: number;
  public readonly mass!: number;

  private _selected = false;

  constructor(id: number, name: string, coordinates: Vector3, systemCoordinates: Vector3, type: MoonClass, radius: number, mass: number) {
    this.id = id;
    this._name = name;
    this.coordinates = coordinates;
    this.systemCoordinates = systemCoordinates;

    this.type = type;

    this.radius = radius;
    this.mass = mass;

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


  public get moonClass() {
    switch(this.type) {
      default: return 'M';
    }
  }

  public toJson(): string {
    return `${this.type}:${this.radius}:${this.mass}`;
  }
}
