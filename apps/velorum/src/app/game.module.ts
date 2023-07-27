import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MarkdownModule } from 'ngx-markdown';
// Shoelace
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';
setBasePath('@shoelace-style/shoelace/dist');
// Shoelace Components
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js';
// Custom Modules
import { SharedLibModule } from '@velorum/shared';
// Environment
import { environment } from '../environments/environment';
// Routing
import { routes, routingOptions } from './game.routes';
// Views
import { RootView } from './views/root/root.view';
// Services
import { MusicPlayerService } from './services/musicplayer.service';
import { TimerService } from './services/timer.service';
// Pipes
import { MarkedPipe } from './pipes/marked.pipe';
// Components
import { SocialLinksComponent } from './components/social-links/social-links.component';
import { GameButtonComponent } from './components/game-button/game-button.component';
import { GameHeadlineComponent } from './components/game-headline/game-headline.component';
import { GameIconButtonComponent } from './components/game-icon-button/game-icon-button.component';
import { GameLoadingComponent } from './components/game-loading/game-loading.component';
import { GameSpinnerComponent } from './components/game-spinner/game-spinner.component';
import { GameStatsComponent } from './components/game-stats/game-stats.component';
import { GameSystemDetailsComponent } from './components/game-system-details/game-system-details.component';
import { GameSystemExtendedDetailsComponent } from './components/game-system-extended-details/game-system-extended-details.component';
import { GameVersionComponent } from './components/game-version/game-version.component';
import { GalaxyView } from './views/galaxy/galaxy.view';
import { GameView } from './views/game/game.view';
import { SectorView } from './views/sector/sector.view';
import { SystemView } from './views/system/system.view';
import { WINDOW } from './constants/window.token';

@NgModule({
  declarations: [
    RootView,
    SocialLinksComponent,
    MarkedPipe,
    GameView,
    GalaxyView,
    SectorView,
    SystemView,
    GameButtonComponent,
    GameHeadlineComponent,
    GameStatsComponent,
    GameLoadingComponent,
    GameSpinnerComponent,
    GameSystemDetailsComponent,
    GameSystemExtendedDetailsComponent,
    GameIconButtonComponent,
    GameVersionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ClipboardModule,
    SharedLibModule.forRoot(environment),
    MarkdownModule.forRoot(),
    RouterModule.forRoot(routes, routingOptions),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    TimerService,
    MusicPlayerService,
    {
      provide: WINDOW,
      useFactory: () => window,
    },
  ],
  bootstrap: [RootView],
})
export class GameModule {}
