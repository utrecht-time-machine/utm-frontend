import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _showing = false;

  constructor() {}

  isShowing(): boolean {
    return this._showing;
  }

  show(): void {
    this._showing = true;
  }

  hide(): void {
    this._showing = false;
  }

  toggle(): void {
    this._showing = !this._showing;
  }
}
