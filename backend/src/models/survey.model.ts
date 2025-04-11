import mongoose, { Document, Schema } from 'mongoose';

export interface ISurvey extends Document {
  missionId: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'in-progress' | 'completed' | 'failed';
  data: {
    coverageArea: number;
    imagesCollected: number;
    flightDuration: number;
    averageAltitude: number;
    averageSpeed: number;
  };
  telemetryData: Array<{
    timestamp: Date;
    location: {
      latitude: number;
      longitude: number;
      altitude: number;
    };
    batteryLevel: number;
    speed: number;
  }>;
  findings: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    location: {
      latitude: number;
      longitude: number;
    };
    description: string;
    imageUrl?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SurveySchema = new Schema({
  missionId: {
    type: Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'failed'],
    default: 'in-progress'
  },
  data: {
    coverageArea: { type: Number },
    imagesCollected: { type: Number, default: 0 },
    flightDuration: { type: Number },
    averageAltitude: { type: Number },
    averageSpeed: { type: Number }
  },
  telemetryData: [{
    timestamp: { type: Date, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      altitude: { type: Number, required: true }
    },
    batteryLevel: { type: Number, required: true },
    speed: { type: Number, required: true }
  }],
  findings: [{
    type: { type: String, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    description: { type: String, required: true },
    imageUrl: { type: String }
  }]
}, {
  timestamps: true,
  versionKey: false
});

SurveySchema.index({ missionId: 1 });
SurveySchema.index({ status: 1 });
SurveySchema.index({ startTime: 1 });

export const Survey = mongoose.model<ISurvey>('Survey', SurveySchema);
