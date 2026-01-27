import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteNotificationsSettingsService {
  private readonly enabledStorageKey = 'utm.routeNotificationsEnabled';

  private readonly enabledSubject = new BehaviorSubject<boolean>(
    this.loadEnabled()
  );

  public readonly enabled$ = this.enabledSubject.asObservable();

  public getEnabled(): boolean {
    return this.enabledSubject.getValue();
  }

  public setEnabled(enabled: boolean): void {
    this.enabledSubject.next(enabled);
    this.saveEnabled(enabled);
  }

  private loadEnabled(): boolean {
    try {
      const v = (window as any)?.localStorage?.getItem(this.enabledStorageKey);
      if (v === null) return false;
      return v === 'true';
    } catch {
      return false;
    }
  }

  private saveEnabled(enabled: boolean): void {
    try {
      (window as any)?.localStorage?.setItem(
        this.enabledStorageKey,
        String(enabled)
      );
    } catch {
      // ignore
    }
  }
}
