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

export type WeekDay =
  | "Måndag"
  | "Tisdag"
  | "Onsdag"
  | "Torsdag"
  | "Fredag"
  | "Lördag"
  | "Söndag";

export type Day = {
  date: number;
  day: WeekDay;
  month: number;
  year: number;
  fullDate: Date;
  isCurrent: boolean;
};

export type Direction = "Left" | "Right" | "Up" | "Down";
