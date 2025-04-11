export type SurveyStatus = 'in-progress' | 'completed' | 'failed';
export type FindingSeverity = 'low' | 'medium' | 'high';

export interface SurveyData {
  coverageArea: number;
  imagesCollected: number;
  flightDuration: number;
  averageAltitude: number;
  averageSpeed: number;
}

export interface Finding {
  type: string;
  severity: FindingSeverity;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  imageUrl?: string;
}

export interface CreateSurveyDto {
  missionId: string;
  startTime: Date;
}

export interface UpdateSurveyDto {
  endTime?: Date;
  status?: SurveyStatus;
  data?: Partial<SurveyData>;
  findings?: Finding[];
}

export interface SurveyResponse {
  id: string;
  missionId: string;
  startTime: Date;
  endTime?: Date;
  status: SurveyStatus;
  data: SurveyData;
  findings: Finding[];
  createdAt: Date;
  updatedAt: Date;
}
