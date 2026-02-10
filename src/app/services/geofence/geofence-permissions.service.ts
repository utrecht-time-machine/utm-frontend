import { Injectable } from '@angular/core';

import type {
  AuthorizationStatus,
  ProviderChangeEvent,
} from 'cordova-background-geolocation-lt';

type BgGeo = typeof import('cordova-background-geolocation-lt').default;

@Injectable({
  providedIn: 'root',
})
export class GeofencePermissionsService {
  async hasLocationPermission(bgGeo: BgGeo): Promise<boolean> {
    try {
      const providerState: ProviderChangeEvent = await bgGeo.getProviderState();
      const status: AuthorizationStatus = providerState.status;

      // Fail-closed.
      if (status === undefined || status === null) {
        return false;
      }

      if (status === bgGeo.AUTHORIZATION_STATUS_DENIED) {
        return false;
      }

      if (status === bgGeo.AUTHORIZATION_STATUS_NOT_DETERMINED) {
        return false;
      }

      return true;
    } catch (e) {
      console.warn(
        '[GeofencePermissionsService] hasLocationPermission failed',
        e,
      );
      return false;
    }
  }
}
