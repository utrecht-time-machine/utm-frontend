import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _isShowing = new BehaviorSubject<boolean>(true);
  isShowing = this._isShowing.asObservable();

  constructor() {}

  show(): void {
    this._isShowing.next(true);
  }

  hide(): void {
    this._isShowing.next(false);
  }

  toggle(): void {
    this._isShowing.next(!this._isShowing.value);
  }
}
