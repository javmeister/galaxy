import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DataManagerService, EventManagerService, OnSolarSystemSelectedEvent, Planet, PlanetClass, Star } from '@velorum/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'velorum-game-system-extended-details',
  templateUrl: './game-system-extended-details.component.html',
  styleUrls: ['./game-system-extended-details.component.scss'],
})
export class GameSystemExtendedDetailsComponent implements OnInit, OnDestroy  {
  private name = 'GameSystemExtendedDetailsComponent';

  private _onSelectSolarSystemEventSubscription!: Subscription;

  private _selectedPlanet!: Planet;
  private _selectedStar!: Star;

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
  }


  @HostBinding('class.common') get isCommon() {
    return this.system?.rarity === 'common';
  }

  @HostBinding('class.uncommon') get isUncommon() {
    return this.system?.rarity === 'uncommon';
  }

  @HostBinding('class.rare') get isRare() {
    return this.system?.rarity === 'rare';
  }

  @HostBinding('class.epic') get isEpic() {
    return this.system?.rarity === 'epic';
  }

  constructor(
    private readonly eventManager: EventManagerService,
    private readonly dataManager: DataManagerService) {}

  ngOnInit(): void {
    this._onSelectSolarSystemEventSubscription = this.eventManager.on(OnSolarSystemSelectedEvent,  (system) => {
      this._selectedStar = this.stars[0];

      if (this.planets && this.planets.length > 0) {
        this._selectedPlanet = this.planets[0];
      }
    }, this);
  }

  ngOnDestroy(): void {
    this.eventManager.off(OnSolarSystemSelectedEvent, this._onSelectSolarSystemEventSubscription);
  }

  public get sector() {
    return this.dataManager.velorum?.SelectedSector;
  }

  public get system() {
    return this.dataManager.velorum?.SelectedSector?.SelectedSystem;
  }

  public get rarity() {
    return this.system?.rarity;
  }


  public get stars(): Star[] {
    return this.dataManager.velorum?.SelectedSector?.SelectedSystem?.stars || [];
  }

  public get planets(): Planet[] {
    return this.dataManager.velorum?.SelectedSector?.SelectedSystem?.planets || [];
  }

  public getStarSelectorClassName(star: Star): string {
    let className = `${star.classId} `;

    if (this._selectedStar) {
      if (star.toJson() === this._selectedStar.toJson()) { // the id in the star is misleading, it is the system id
        className += 'selected';
      }
    }

    return className;
  }

  public getOrbitSelectorClassName(planet: Planet): string {
    let className = `${this.getPlanetClassName(planet.type)} `;

    if (this.selectedPlanet) {
      if (planet.orbit === this.selectedPlanet.orbit) {
        className += 'selected';
      }
    }

    return className;
  }

  public getPlanetClassDescription(c: PlanetClass | undefined): string {
    switch (c) {
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

  public getPlanetClassification(c: PlanetClass | undefined): string {
    if (c !== undefined) {
      return PlanetClass[c];
    }
    return '';
  }

  public getPlanetClassName(c: PlanetClass | undefined): string {
    if (c !== undefined) {
      return `class${PlanetClass[c]}`.toLowerCase();
    }
    return '';
  }

  public get selectedStar() {
    return this._selectedStar;
  }

  public selectStar(star: Star) {
    this._selectedStar = star;
  }

  public get selectedPlanet() {
    return this._selectedPlanet;
  }

  public selectPlanet(planet: Planet) {
    if (this._selectedPlanet) {
      this._selectedPlanet.selected = false;
    }

    this._selectedPlanet = planet;
  }


}
