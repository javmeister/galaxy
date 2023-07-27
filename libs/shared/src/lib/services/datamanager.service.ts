import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { OnDataLoadedEvent, OnGalaxyModelReadyEvent } from "../events/game.events";
import { Galaxy } from "../models";
import { EventManagerService } from "./eventmanager.service";
import { LoadingManagerService } from "./loadingmanager.service";


@Injectable()
export class DataManagerService implements OnDestroy {
  private name = 'DataManagerService';

  public readonly velorum: Galaxy;

  private readonly _sub!: Subscription;

  constructor(private readonly loadingManager: LoadingManagerService,
    private readonly eventManager: EventManagerService ) {
    // Instantiate the galaxy object
    this.velorum = new Galaxy('Velorum');

    // Subscribe to the data loaded event before even loading it
    this._sub = this.eventManager.on(OnDataLoadedEvent, (data) => {
      this.velorum.sectors = data.sectors;
      this.velorum.solarSystems = data.systems;
      this.velorum.planets = data.planets;
      this.velorum.poi = data.pois;
      // Flag as all loaded
      this.velorum.loaded = true;

      // Emit the Galaxy Model Ready event
      this.eventManager.emit(OnGalaxyModelReadyEvent, undefined, this);
    }, this);

    // Angular doesn't wait for asyncs inside the constructor, need to use the event above
    this.loadingManager.init();
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  public dispose(): void {
    // For the data manager, disposing means telling the model to clear its state
    this.velorum.dispose();

    // Remove the event listener
    // this._sub?.unsubscribe?.();
    this.eventManager.off(OnDataLoadedEvent, this._sub);
  }
}
