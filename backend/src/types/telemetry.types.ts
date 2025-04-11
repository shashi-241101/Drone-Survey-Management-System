export interface TelemetryData {
  timestamp: Date;
  droneId: string;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  batteryLevel: number;
  speed: number;
  heading: number;
  signalStrength: number;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed?: number;
  windDirection?: number;
}

export interface TelemetryStreamOptions {
  droneId: string;
  frequency?: number; // in milliseconds
  includeEnvironmental?: boolean;
}

export interface TelemetryFilter {
  droneId: string;
  startTime?: Date;
  endTime?: Date;
  minBatteryLevel?: number;
  maxBatteryLevel?: number;
}

export interface TelemetryStats {
  averageSpeed: number;
  averageAltitude: number;
  averageBatteryLevel: number;
  maxSpeed: number;
  maxAltitude: number;
  totalDistance: number;
  flightTime: number;
}
