export type MissionType = 'survey' | 'inspection' | 'security' | 'mapping';
export type MissionStatus = 'planned' | 'in-progress' | 'completed' | 'aborted' | 'failed';

export interface Waypoint {
  waypoint: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  action?: string;
}

export interface MissionSchedule {
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurringPattern?: string;
}

export interface MissionParameters {
  altitude: number;
  speed: number;
  overlapPercentage: number;
  resolution: number;
}

export interface CreateMissionDto {
  name: string;
  description?: string;
  facilityId: string;
  droneId: string;
  missionType: MissionType;
  schedule: MissionSchedule;
  flightPath: Waypoint[];
  parameters: MissionParameters;
}

export interface UpdateMissionDto {
  name?: string;
  description?: string;
  status?: MissionStatus;
  schedule?: Partial<MissionSchedule>;
  parameters?: Partial<MissionParameters>;
}

export interface MissionResponse {
  id: string;
  name: string;
  description?: string;
  facilityId: string;
  droneId: string;
  missionType: MissionType;
  status: MissionStatus;
  schedule: MissionSchedule;
  flightPath: Waypoint[];
  parameters: MissionParameters;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
