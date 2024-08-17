export type Event = {
  event_id: number;
  summary: string;
  type: number;
  longitude: string;
  latitude: string;
  date: string;
};

export type Marker = {
  longitude: number;
  latitude: number;
  events: Event[];
};

export type Cluster = {
  center: Coordinate;
  markers: Event[];
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};
