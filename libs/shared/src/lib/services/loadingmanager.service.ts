import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OnDataLoadedEvent } from "../events/game.events";
import { Planet, Sector, SolarSystem } from "../models";
import { EventManagerService } from "./eventmanager.service";

@Injectable()
export class LoadingManagerService {
  private name = 'LoadingManagerService';

  private _sectors: Array<Sector> = [];
  private _systems: Array<SolarSystem> = [];
  private _planets: Array<Planet> = [];
  private _pois: Array<any> = [];

  constructor(@Inject('environment') private environment: any,
  private readonly httpClient: HttpClient,
    private readonly eventManager: EventManagerService) {}

  public async init() {
    const [sectors, systems, planets, pois] = await Promise.all([
      this.getSectors(this.environment.cdn.host, this.environment.cdn.path),
      this.getSystems(this.environment.cdn.host, this.environment.cdn.path),
      this.getPlanets(this.environment.cdn.host, this.environment.cdn.path),
      this.getPois(this.environment.cdn.host, this.environment.cdn.path),
    ]);

    // All data loaded here
    this.eventManager.emit(OnDataLoadedEvent, { sectors, systems, planets, pois }, this);
  }


  public get sectors(): Sector[] {
    return this._sectors;
  }

  public get systems(): SolarSystem[] {
    return this._systems;
  }

  public get planets(): Planet[] {
    return this._planets;
  }

  public get pois(): any[] {
    return this._pois;
  }

  public async getSectors(host: string, path: string) {
    if (this._sectors.length === 0) {
      await this.loadSectors(host, path);
    }
    return Promise.resolve(this._sectors);
  }

  public async getSystems(host: string, path: string) {
    if (this._systems.length === 0) {
      await this.loadSystems(host, path);
    }

    return Promise.resolve(this._systems);
  }

  public async getPlanets(host: string, path: string) {
    if (this._planets.length === 0) {
      await this.loadPlanets(host, path);
    }
    return Promise.resolve(this._planets);
  }

  public async getPois(host: string, path: string) {
    if (this._pois.length === 0) {
      await this.loadPOIs(host, path);
    }
    return Promise.resolve(this._pois);
  }

  private async loadSectors(host: string, path: string) {
    const sectors = await this.getDataFromCDN(host, path, 'galaxy/sectors-compressed-meco.json');

    const cdnSectors = sectors
      .map((s: string) => s.split(':'))
      .map((s: Array<string>) => new Sector(...s));

    if (cdnSectors.length > 0) {
      this._sectors = [...cdnSectors];

      // Exit if CDN returned data ok
      return;
    }

    console.warn(`Sectors couldn't be downloaded from the CDN, trying fallback.`);
    // TODO: implement actual fallback

    this._sectors = [];
  }

  private async loadSystems(host: string, path: string) {
    const systems = await this.getDataFromCDN(host, path, 'galaxy/solar-systems-compressed-meco.json');

    const cdnSystems = systems
      .map((s: string) => s.split(':'))
      .map((s: Array<string>) => new SolarSystem(...s));

    this._systems = [...cdnSystems];
  }

  private async loadPlanets(host: string, path: string) {
    const planets = await this.getDataFromCDN(host, path, 'galaxy/planets-compressed-meco.json');

    const cdnPlanets = planets
      .map((s: string) => s.split(':')) // first is the system id, then is a 3x repeat with type/mass/radius
      .map((s: Array<string>) => {
        const count = ( s.length - 1 ) / 3;
        const p: Array<Planet> = [];
        for (let i = 0; i < count; i++) {
          p.push(new Planet(parseInt(s[0], 10), i + 1 , `${(i + 1).toString()}`, parseInt(s[(i * 3) + 1]) as any, parseFloat(s[(i * 3) + 2]), parseFloat(s[(i * 3) + 3])))
        }
        return p;
      })
      .flat();

    this._planets = [...cdnPlanets];
  }

  private async loadPOIs(host: string, path: string) {
    const poi = await this.getDataFromCDN(host, path, 'galaxy/points-of-interest.json');

    this._pois = [...poi];
  }


  private async getDataFromCDN(host: string, path: string, file: string) {
    const filePath = `https://${host}/${path}/${file}`;

    const data$ = this.httpClient.get<any>(filePath);
    return await firstValueFrom<any>(data$);
  }
}
