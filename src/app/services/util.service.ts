export class UtilService {
  static convertDistanceInKmToString(distanceInKm: number): string {
    if (distanceInKm < 1) {
      const distanceInMeters = distanceInKm * 1000;
      return distanceInMeters.toFixed(0) + ' m';
    }

    return distanceInKm.toFixed(1) + ' km';
  }

  static getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = UtilService.deg2rad(lat2 - lat1);
    const dLon = UtilService.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(UtilService.deg2rad(lat1)) *
        Math.cos(UtilService.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
