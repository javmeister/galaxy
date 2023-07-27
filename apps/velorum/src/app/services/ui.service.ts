import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root',
})
export class UIService {
  public showTransparentNavbar = true;
  public showNavbar = false;
  public showSocialLinks = false;

  public playing = false;
}
