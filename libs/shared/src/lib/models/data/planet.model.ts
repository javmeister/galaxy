import { PlanetClass } from "../../types/planetclass.enum";
import { Moon } from "./moon.model";

export class Planet {
  public readonly id!: number; // this is the solar system id!!
  private readonly _name!: string;
  public readonly orbit!: number;

  public readonly type!: PlanetClass;
  public readonly radius!: number;
  public readonly mass!: number;

  private _selected = false;

  private _moons: Array<Moon> = [];

  constructor(id: number, orbit: number, name: string, type: PlanetClass, radius: number, mass: number) {
    this.id = id;
    this._name = name;
    this.orbit = orbit;

    this.type = type;

    this.radius = radius;
    this.mass = mass;
  }

  public get name(): string {
    return this._name;
  }

  public get moons(): Array<Moon> {
    return this._moons;
  }

  public set moons(value: Array<Moon>) {
    this._moons = value;
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

  private get moonsJson(): string {
    return this._moons.map(moon => moon.toJson()).join(':');
  }

  public get planetClassDescription(): string {
    switch (this.type) {
      case PlanetClass.D:
        return 'Small, No Atmosphere';
      case PlanetClass.Y:
        return 'Toxic, High Temperatures';
      case PlanetClass.L:
        return 'Habitable, No Animal Life';
      case PlanetClass.M:
        return 'Habitable, Terrestrial';
      case PlanetClass.K:
        return 'Habitable, Pressure Domes';
      case PlanetClass.T:
        return 'Gas Giant';
      case PlanetClass.J:
        return 'Gas Giant';
      case PlanetClass.N:
        return 'Uninhabitable, Sulfuric';
      case PlanetClass.H:
        return 'Uninhabitable, Rocky';
      default:
        return '';
    }
  }

  public toJson(): string {
    return `${this.type}:${this.radius}:${this.mass}`;
  }
}
