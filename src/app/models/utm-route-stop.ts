export interface UtmRouteStop {
  stop_id: string;
  stop_type: string;
  title: string;
  address: string;
  route_id: string;
  geo: string;
  coords: { lat: number; long: number };
  audio: string;
  stop_image: string;
  stop_thumb: string;
}
