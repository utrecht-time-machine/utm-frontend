import { Injectable } from '@angular/core';

import type { State } from 'cordova-background-geolocation-lt';

type BgGeo = typeof import('cordova-background-geolocation-lt').default;

@Injectable({
  providedIn: 'root',
})
export class GeofencePermissionsService {
  async hasLocationPermission(bgGeo: BgGeo): Promise<boolean> {
    try {
      const state: State | undefined =
        typeof (bgGeo as any).getState === 'function'
          ? await (bgGeo as any).getState()
          : undefined;

      const authorization: unknown = (state as any)?.authorization;

      const providerState: unknown =
        typeof (bgGeo as any).getProviderState === 'function'
          ? await (bgGeo as any).getProviderState()
          : undefined;

      const authorizationObjStatus: unknown =
        authorization && typeof authorization === 'object'
          ? (authorization as any).status ??
            (authorization as any).location ??
            (authorization as any).authorization
          : undefined;

      const denied = (bgGeo as any).AUTHORIZATION_STATUS_DENIED;
      const notDetermined = (bgGeo as any).AUTHORIZATION_STATUS_NOT_DETERMINED;

      const lastLocationAuthorizationStatus: unknown = (state as any)
        ?.lastLocationAuthorizationStatus;

      const rawAuthValue =
        typeof authorization === 'number' || typeof authorization === 'string'
          ? authorization
          : typeof authorizationObjStatus === 'number' ||
              typeof authorizationObjStatus === 'string'
            ? authorizationObjStatus
            : typeof lastLocationAuthorizationStatus === 'number' ||
                typeof lastLocationAuthorizationStatus === 'string'
              ? lastLocationAuthorizationStatus
              : typeof (providerState as any)?.status === 'number' ||
                  typeof (providerState as any)?.status === 'string'
                ? (providerState as any).status
                : authorization;

      const normalizedAuthValue: unknown =
        typeof rawAuthValue === 'string' && /^\d+$/.test(rawAuthValue)
          ? Number(rawAuthValue)
          : rawAuthValue;

      // Fail-closed: if we cannot interpret the value, treat it as no permission.
      if (
        normalizedAuthValue === undefined ||
        normalizedAuthValue === null ||
        typeof normalizedAuthValue === 'object'
      ) {
        return false;
      }

      if (denied !== undefined && normalizedAuthValue === denied) {
        return false;
      }

      if (notDetermined !== undefined && normalizedAuthValue === notDetermined) {
        return false;
      }

      return true;
    } catch (e) {
      console.warn('[GeofencePermissionsService] hasLocationPermission failed', e);
      return false;
    }
  }
}
