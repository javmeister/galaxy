import { Vector3 } from "three";
import { StellarClass } from "../../types/stellarclass.enum";
import * as slugify from 'slugify';

export class Star {
  public readonly id!: number; // this is the solar system id!!
  private readonly _name!: string;
  public coordinates!: Vector3;

  public readonly systemCoordinates!: Vector3;

  public readonly type!: StellarClass;
  public readonly temperature!: number;
  public readonly radius!: number;

  public readonly mass!: number;
  public readonly magnitude!: number;

  // These two are false, then is not a binary star, if any then it is what it is true
  public readonly primary!: boolean;
  public readonly secondary!: boolean;

  private _selected = false;

  constructor(id: number, name: string, coordinates: Vector3, systemCoordinates: Vector3, type: StellarClass, temperature: number, radius: number, magnitude: number, mass: number, primary = false, secondary = false) {
    this.id = id;
    this._name = name;
    this.coordinates = coordinates;
    this.systemCoordinates = systemCoordinates;

    this.type = type;

    this.temperature = temperature;
    this.radius = radius;
    this.magnitude = magnitude;
    this.mass = mass;

    this.primary = primary;
    this.secondary = secondary;
  }

  public get name(): string {
    if (!this.primary && !this.secondary) {
      return this._name;
    }
    return `${this._name}${this.primary ? ' A' : ' B'}`;
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


  public get stellarClass(): string {
    switch(this.type) {
      case 0: return 'G-Type (G2)';
      case 1: return 'Red Dwarf';
      case 2: return 'Red Giant';
      case 3: return 'Blue Giant';
      case 4: return 'Supergiant';
      case 5: return 'White Dwarf';
      case 6: return 'Pulsar';
      case 7: return 'Neutron Star';
      default: return 'G-Type (G2)';
    }
  }

  public get spectralType() {
    switch(this.type) {
      case 0: return 'G2';
      case 1: return 'M';
      case 2: return 'M';
      case 3: return 'B';
      case 4: return 'O';
      case 5: return 'D';
      case 6: return 'D';
      case 7: return 'D';
      default: return 'G2';
    }

  }

  public get classId() {
    switch(this.type) {
      case 0: return 'g2';
      case 1: return 'rd';
      case 2: return 'rg';
      case 3: return 'bg';
      case 4: return 'sg';
      case 5: return 'wd';
      case 6: return 'psr';
      case 7: return 'ns';
      default: return 'g2';
    }

  }

  public get stellarClassId() {
    return this.stellarClass.replace(' ', '-').toLowerCase();
  }

  public get stellarClassSlug() {
    return this.slug(this.stellarClass);
  }

  public toJson(): string {
    return `${this.type}:${this.temperature}:${this.radius}:${this.magnitude}:${this.mass}`;
  }

  private slug(value: string) {
    return slugify.default(value, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
      locale: 'en', // language code of the locale to use
      trim: true,
    });
  };

}
