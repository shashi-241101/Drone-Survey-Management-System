export interface DroneLocation {
  latitude: number;
  longitude: number;
  altitude: number;
}

export type DroneStatus = 'available' | 'in-mission' | 'maintenance' | 'offline';

export interface CreateDroneDto {
  name: string;
  serialNumber: string;
  modelName: string;
  manufacturer: string;
  maxFlightTime: number;
  maxAltitude: number;
  maxSpeed: number;
  sensors: string[];
}

export interface UpdateDroneDto {
  name?: string;
  status?: DroneStatus;
  batteryLevel?: number;
  currentLocation?: DroneLocation;
  lastMaintenance?: Date;
}

export interface DroneResponse {
  id: string;
  name: string;
  serialNumber: string;
  modelName: string;
  manufacturer: string;
  status: DroneStatus;
  batteryLevel: number;
  lastMaintenance: Date;
  currentLocation?: DroneLocation;
  maxFlightTime: number;
  maxAltitude: number;
  maxSpeed: number;
  sensors: string[];
  isOperational: boolean;
  createdAt: Date;
  updatedAt: Date;
}
