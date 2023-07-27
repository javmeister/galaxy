import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class DialogsService {

  public me$: Subject<boolean> = new Subject();

  public galaxyPOIDetails$: Subject<boolean> = new Subject();

}
