import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { fadeAnimation } from '../../animations/fade.animation';
import { UIService } from '../../services/ui.service';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';


@Component({
  selector: 'velorum-root',
  templateUrl: './root.view.html',
  styleUrls: ['./root.view.scss'],
  animations: [fadeAnimation]
})
export class RootView  {
  @ViewChild('dialog') dialog!: ElementRef<SlDialog>;

  // Route data name param
  @Input() routeName?: string;

  constructor(
    public readonly ui: UIService
  ) {
    // Move the navbar away if we get to the game
      // GRN!!
      this.ui.showTransparentNavbar = this.routeName === 'galaxy';
      this.ui.showNavbar = this.routeName !== 'meco';
      this.ui.showSocialLinks = this.routeName !== 'meco' && this.routeName !== 'galaxy';

      this.ui.playing = this.routeName === 'meco';
  }

  get audioCdnPath() {
    return `//${environment.cdn.host}/${environment.cdn.path}/meco/audio/music`;
  }
}
