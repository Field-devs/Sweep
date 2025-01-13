export interface Waypoint {
  id: number;
  latitude: number;
  longitude: number;
  sequence: number;
  description: string;
}

export interface RouteStretch {
  id: number;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  waypoints: Waypoint[];
}