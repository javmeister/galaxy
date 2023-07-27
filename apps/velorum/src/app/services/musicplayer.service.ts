import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicPlayerService {
  private _audio!: HTMLAudioElement;

  public get player() {
    // Singletonish
    if (!this._audio) {
      this._audio = new Audio();
    }
    return this._audio;
  }

}
