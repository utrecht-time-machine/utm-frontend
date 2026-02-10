import { Injectable } from '@angular/core';

import type {
  Geofence as BgGeofence,
  Extras,
} from 'cordova-background-geolocation-lt';

export type GeofenceIdentifierInfo = {
  routeId?: string;
  routeTitle?: string;
  stopIdx?: number;
  stopTitle?: string;
};

@Injectable({
  providedIn: 'root',
})
export class GeofenceIdentifierService {
  buildRouteStopIdentifier(
    routeId: string,
    stopIdx: number,
    locationId: string | number | undefined,
  ): string {
    return `route:${routeId}:stop:${stopIdx}:location:${String(locationId)}`;
  }

  hashToInt(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  parseRouteIdFromIdentifier(identifier: string): string | undefined {
    const m = identifier.match(/^route:([^:]+):/);
    return m?.[1];
  }

  parseStopIdxFromIdentifier(identifier: string): number | undefined {
    const m = identifier.match(/:stop:(\d+):/);
    if (!m) {
      return undefined;
    }
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : undefined;
  }

  getInfoFromIdentifier(
    identifier: string | undefined,
    activeGeofences: BgGeofence[],
  ): GeofenceIdentifierInfo | undefined {
    if (!identifier) {
      return undefined;
    }

    const match = activeGeofences.find((f) => f.identifier === identifier);
    const extras: Extras | undefined = match?.extras;

    const stopIdxFromExtras =
      typeof extras?.['stopIdx'] === 'number'
        ? (extras['stopIdx'] as number)
        : undefined;
    const stopIdx =
      stopIdxFromExtras ?? this.parseStopIdxFromIdentifier(identifier);

    return {
      routeId:
        typeof extras?.['routeId'] === 'string'
          ? extras['routeId']
          : this.parseRouteIdFromIdentifier(identifier),
      routeTitle:
        typeof extras?.['routeTitle'] === 'string'
          ? extras['routeTitle']
          : undefined,
      stopIdx,
      stopTitle:
        typeof extras?.['title'] === 'string' ? extras['title'] : undefined,
    };
  }
}
