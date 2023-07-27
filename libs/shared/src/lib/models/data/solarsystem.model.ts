import { Vector2 } from "three";
import { Vector3 } from "three";
import { Celestial } from "./celestial.model";
import { Planet } from "./planet.model";
import { Star } from "./star.model";

export interface ISolarSystemResources {
  uncommon: number;
  common: number;
  rare: number;
}

export enum SolarSystemClassId {
  G2                      = 'g2',
  REDDWARF                = 'rd',
  WHITEDWARF              = 'wd',
  REDGIANT                = 'rg',
  BLUEGIANT               = 'bg',
  SUPERGIANT              = 'sg',
  PULSAR                  = 'psr',
  NEUTRONSTAR             = 'ns',
  G2_G2                   = 'g2g2',
  G2_REDDWARF             = 'g2rd',
  WHITEDWARF_G2           = 'wdg2',
  WHITEDWARF_WHITEDWARF   = 'wdwd',
  PULSAR_WHITEDWARF       = 'psrwd',
  NEUTRONSTAR_WHITEDWARF  = 'nswd',
}

export class SolarSystem {
  public readonly id!: number;
  public readonly name!: string;
  public readonly coordinates!: Vector3;

  public readonly sector!: number;

  public resources: ISolarSystemResources = {
    uncommon: 0,
    common: 0,
    rare: 0
  };

  private _sectorCenter!: Vector2;

  private _stars: Array<Star> = [];
  private _planets: Array<Planet> = [];
  private _celestials: Array<Celestial> = [];

  private _selected = false;

  /**
   * The data from the CDN comes compressed into colon-separated strings, the constructor gets the array of splitted strings from the data service
   * @param fields
   */
  constructor(...fields: Array<string>) {
    this.id = parseInt(fields[0], 10);
    this.name = fields[2];
    this.coordinates = new Vector3(parseFloat(fields[3]), parseFloat(fields[4]), parseFloat(fields[5])); // WARNING flipped x and z

    this.sector = parseInt(fields[1], 10);
    this.resources.common = parseFloat(fields[6]);
    this.resources.uncommon = parseFloat(fields[7]);
    this.resources.rare = parseFloat(fields[8]);

    // Add the primary star in the group
    this._stars.push(
      new Star(this.id, this.name, this.coordinates, this.coordinates, parseInt(fields[9], 10), parseFloat(fields[10]), parseFloat(fields[11]), parseFloat(fields[12]), parseFloat(fields[13]), fields.length === 14, false)
    );

    // Binary systems have 5 extra fields
    if (fields.length === 19) {
      // Add the secondary star with a little offset
      const positionA = this.coordinates.clone();
      positionA.add(new Vector3(4, 0, 0));
      const positionB = this.coordinates.clone();
      positionB.add(new Vector3(-4, 0, 0));

      this._stars.push(
        new Star(this.id, this.name, positionB, this.coordinates, parseInt(fields[14], 10), parseFloat(fields[15]), parseFloat(fields[16]), parseFloat(fields[17]), parseFloat(fields[18]), false, true)
      );

      // Modify the primary to move it a little bit
      this._stars[0].coordinates = positionA;
    }
  }

  public get stars(): Array<Star> {
    return this._stars;
  }

  public set stars(value: Array<Star>) {
    this._stars = value;
  }

  public get planets(): Array<Planet> {
    return this._planets;
  }

  public set planets(value: Array<Planet>) {
    this._planets = value;
  }

  public get celestials(): Array<Celestial> {
    return this._celestials;
  }

  public set celestials(value: Array<Celestial>) {
    this._celestials = value;
  }

  public get type() {
    return this.primary.type;
  }

  public get temperature() {
    return this.primary.temperature;
  }

  public get radius() {
    return this.primary.radius;
  }

  public get rarity() {
    let rarity = 'common';
    switch (this.classId) {
      case 'g2':
      case 'rd':
      case 'wd':
      case 'g2g2':
      case 'g2rd':
        rarity = 'common';
        break;
      case 'rg':
      case 'bg':
      case 'sg':
      case 'wdg2':
          rarity = 'uncommon';
        break;
      case 'psr':
      case 'ns':
        rarity = 'rare';
        break;
      case 'wdwd':
      case 'psrwd':
      case 'nswd':
        rarity = 'epic';
        break;
    }
    return rarity;
  }

  // Used to map the position of the stars on the sector view relative to its center
  public get sectorCenter() {
    return this._sectorCenter;
  }

  public set sectorCenter(value: Vector2) {
    this._sectorCenter = value;
  }

  public get isSingle(): boolean {
    return this._stars.length === 1;
  }

  public get isBinary(): boolean {
    return this._stars.length === 2;
  }

  public get isDDBS(): boolean {
    return this.classId === 'wdwd' || this.classId === 'psrwd' || this.classId === 'nswd';
  }

  public get selected(): boolean {
    return this._selected;
  }

  public set selected(value: boolean) {
    this._selected = value;
  }

  public get primary(): Star {
    return this._stars[0];
  }

  public get secondary(): Star | undefined {
    return this.isBinary ? this._stars[1] : undefined;
  }

  public get selectedStar(): Star | undefined {
    return this._stars.find(s => s.selected);
  }

  public get stellarClass(): string {
    if (!this.isBinary) {
      return this.primary.stellarClass;
    }
    // For binary
    return `Binary ${this.primary.stellarClass}+${this.secondary?.stellarClass}`;
  }

  public get extended(): string {
    // Extended description
    let description = `${this.name} is a `;

    if (this.isBinary) {
      if (this.isDDBS) {
        description += `Double Degenerate Binary System `;
      } else {
        description += `Binary Star System `;
      }
      description += `located in Sector [SECTORNAME].`;
      // description += `<br>`;
      // description += `The A Star is a ${this.primary.stellarClass} with ${this.primary.radius} R☉, and ${this.primary.mass} M☉.<br>`;
      // description += `The B Star is a ${this.secondary?.stellarClass} with ${this.secondary?.radius} R☉, and ${this.secondary?.mass} M☉.`;
    } else {
      description += `Single Star System located in Sector [SECTORNAME].`;
      // description += `<br>`;
      // description += `The Star is a ${this.primary.stellarClass} with ${this.primary.radius}R☉, and ${this.primary.mass} M☉.`;
    }

    return description;
  }

  /**
   * Returns the coordinates of the solar system, but normalized to the center of the galaxy
   *
   * @readonly
   * @memberof SolarSystem
   */
  public get normalizedCoordinates() {

    const coords = new Vector3(this.coordinates.x - this._sectorCenter.x,
      this.coordinates.y,
      this.coordinates.z - this._sectorCenter.y);

    return coords;
  }

  public select(): void {
    this._selected = true;
  }

  public deselect(): void {
    this._selected = false;
    this.primary.deselect();
    this.secondary?.deselect();
  }

  public toggle(): void {
    this._selected = !this._selected;
  }

  public get classId() {
    return this._stars.map(star => star.classId).join('');
  }

  private get starsJson(): string {
    return this._stars.map(star => star.toJson()).join(':');
  }

  private get planetsJson(): string {
    return this._planets.map(planet => planet.toJson()).join(':');
  }

  private get celestialsJson(): string {
    return this._celestials.map(celestial => celestial.toJson()).join(':');
  }

  public toJson(compressed = false): string {
    return compressed ?
      `"${this.id}:${this.sector}:${this.name}:${this.coordinates.x}:${this.coordinates.y}:${this.coordinates.z}:${this.resources.common}:${this.resources.uncommon}:${this.resources.rare}:${this.starsJson}"` :
      `{"i":${this.id},"s":${this.sector},"n":"${this.name}","c":"${this.coordinates.x}:${this.coordinates.y}:${this.coordinates.z}","r":"${this.resources.common}:${this.resources.uncommon}:${this.resources.rare}","d":"${this.starsJson}"}`;
  }

  public planetsToJson(compressed = false): string {
    return compressed ?
      `"${this.id}:${this.planetsJson}"` :
      `{"i":${this.id},"p":"${this.planetsJson}"}`;
  }

  public celestialsToJson(compressed = false): string {
    return compressed ?
      `"${this.id}:${this.celestialsJson}"` :
      `{"i":${this.id},"c":"${this.celestialsJson}"}`;
  }
}
