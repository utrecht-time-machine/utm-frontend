import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly message$ = new Subject<string>();

  show(message: string): void {
    this.message$.next(message);
  }
}
