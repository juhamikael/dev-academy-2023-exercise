export interface IRide {
  id: number;
  start_time?: Date | string | undefined;
  end_time?: Date | string | undefined;
  start_station_id?: number;
  start_station_name: string;
  start_station_location: string;
  end_station_id?: number;
  end_station_name: string;
  end_station_location: string;
  distance_m: number;
  duration_s: number;
}
