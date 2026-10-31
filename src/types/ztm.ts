export interface Stop {
  stopId: number;
  stopName: string;
  stopShortName?: string;
  stopDesc?: string;
  subName?: string;
  date?: string;
  zoneId?: number;
  stopLat?: number;
  stopLon?: number;
}

export interface Departure {
  id: string;
  delayInSeconds: number;
  estimatedTime: string;
  headsign: string;
  routeId: number | string;
  status: string;
  theoreticalTime: string;
  timestamp: string;
  vehicleCode?: number;
  vehicleId?: number;
}
