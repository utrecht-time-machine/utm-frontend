export interface UtmRouteStop {
  stop_id: string;
  stop_type: string;
  title: string;
  route_id: string;
  geo: string;
  coords: { lat: number; long: number };
}
