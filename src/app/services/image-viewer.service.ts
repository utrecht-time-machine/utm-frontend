import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageViewerService {
  isModalShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    // this.isModalShown.subscribe((isShown) => {
    //   console.log(isShown);
    // });
  }
}
