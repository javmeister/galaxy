import { Component, HostBinding, HostListener } from '@angular/core';
import { DataManagerService } from '@velorum/shared';

@Component({
  selector: 'velorum-game-system-details',
  templateUrl: './game-system-details.component.html',
  styleUrls: ['./game-system-details.component.scss'],
})
export class GameSystemDetailsComponent  {

  public _isAvailable = true;
  public _isClaimed = true;

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
    private readonly dataManager: DataManagerService,
    ) {}

  public get sector() {
    return this.dataManager.velorum?.SelectedSector;
  }

  public get system() {
    return this.dataManager.velorum?.SelectedSector?.SelectedSystem;
  }

  public get rarity() {
    return this.system?.rarity;
  }

  public get image() {
    return this.sector ? `https://nft.velorum.games/images/meco/${this.sector.id}/${this.system.id}.jpg` : '';
  }

  public get thumbnail() {
    return this.sector ? `https://nft.velorum.games/images/meco/${this.sector.id}/${this.system.id}_512x512.jpg` : '';
  }

  public get description() {
    return this.system?.extended.replace('[SECTORNAME]', this.sector.name);
  }
}
