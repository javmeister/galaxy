import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'velorum-game-button',
  templateUrl: './game-button.component.html',
  styleUrls: ['./game-button.component.scss'],
})
export class GameButtonComponent  {

  private _isActive = false;

  @Input() keyCode!: string;
  @Input() keyCodeText!: string;
  @Input() text!: string;
  @Input() delay = 250; // Delay in ms before detecting the key press and triggering the output
  @Input() round = true;

  @Output() pressed = new EventEmitter();

  @HostBinding('class.active') get active() {
    return this._isActive;
  }

  @HostBinding('class.round') get isRound() {
    return this.round;
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === this.keyCode){

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


}
