import { ExtraOptions, Route } from '@angular/router';
import { GalaxyView } from './views/galaxy/galaxy.view';
import { GameView } from './views/game/game.view';
import { SectorView } from './views/sector/sector.view';
import { SystemView } from './views/system/system.view';

export const routes: Route[] = [
  {
    path: '',
    data: { routeName: 'galaxy' },
    children: [
      {
        path: '',
        redirectTo: 'galaxy',
        pathMatch: 'full'
      },
      {
        path: '',
        component: GameView,
        data: { routeName: 'map-galaxy' }, // Galaxy Data Loading, when done goes to /galaxy
        children: [
          {
            path: 'galaxy',
            component: GalaxyView,
            data: { routeName: 'map-galaxy-view' }
          },
          {
            path: 'galaxy/:sectorid',
            component: SectorView,
            data: { routeName: 'map-sector-view' }
          },
          {
            path: 'galaxy/:sectorid/:systemid',
            component: SystemView,
            data: { routeName: 'map-system-view' },
          },
        ]
      },
    ]
  }
];

export const routingOptions: ExtraOptions = {
  initialNavigation: 'enabledBlocking',
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload',
  bindToComponentInputs: true
};
