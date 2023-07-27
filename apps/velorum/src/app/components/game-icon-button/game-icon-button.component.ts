import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'velorum-game-icon-button',
  templateUrl: './game-icon-button.component.html',
  styleUrls: ['./game-icon-button.component.scss'],
})
export class GameIconButtonComponent  {

  private _isActive = false;

  @Input() icon!: string;
  @Input() round = true;
  @Input() delay = 250; // Delay in ms before detecting the key press and triggering the output

  @Output() pressed = new EventEmitter();

  @HostBinding('class.active') get active() {
    return this._isActive;
  }

  @HostBinding('class.round') get isRound() {
    return this.round;
  }

  @HostListener('click')
  clickEvent() {
    // Activate the button
    this._isActive = true;

    // Then trigger the output after the specificed delay
    setTimeout(() => {
      // Also reset the state for next click
      this._isActive = false;

      this.pressed.emit();
    }, this.delay);

  }


}
