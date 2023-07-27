import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { GameModule } from './app/game.module';

platformBrowserDynamic()
  .bootstrapModule(GameModule)
  .catch((err) => console.error(err));
