import mongoose, { Document, Schema } from 'mongoose';

export interface IMission extends Document {
  name: string;
  description: string;
  facilityId: Schema.Types.ObjectId;
  droneId: Schema.Types.ObjectId;
  missionType: 'survey' | 'inspection' | 'security' | 'mapping';
  status: 'planned' | 'in-progress' | 'completed' | 'aborted' | 'failed';
  schedule: {
    startTime: Date;
    endTime: Date;
    isRecurring: boolean;
    recurringPattern?: string; // cron expression
  };
  flightPath: Array<{
    waypoint: number;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    action?: string;
  }>;
  parameters: {
    altitude: number;
    speed: number;
    overlapPercentage: number;
    resolution: number;
  };
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  facilityId: {
    type: Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  droneId: {
    type: Schema.Types.ObjectId,
    ref: 'Drone',
    required: true
  },
  missionType: {
    type: String,
    enum: ['survey', 'inspection', 'security', 'mapping'],
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'aborted', 'failed'],
    default: 'planned'
  },
  schedule: {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isRecurring: { type: Boolean, default: false },
    recurringPattern: { type: String }
  },
  flightPath: [{
    waypoint: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number, required: true },
    speed: { type: Number, required: true },
    action: { type: String }
  }],
  parameters: {
    altitude: { type: Number, required: true },
    speed: { type: Number, required: true },
    overlapPercentage: { type: Number, required: true },
    resolution: { type: Number, required: true }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

MissionSchema.index({ facilityId: 1, status: 1 });
MissionSchema.index({ droneId: 1, status: 1 });
MissionSchema.index({ 'schedule.startTime': 1 });

export const Mission = mongoose.model<IMission>('Mission', MissionSchema); 