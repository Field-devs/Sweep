export type Waypoint = {
  id: string; // Changed from number to string for UUID
  sequence: number;
  latitude: number;
  longitude: number;
  description: string;
};

export type RouteStretch = {
  id: string; // Changed from number to string for UUID
  name: string;
  sequence: number;
  status: 'not_started' | 'in_progress' | 'completed';
  waypoints: Waypoint[];
};