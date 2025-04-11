import mongoose, { Schema, Document } from 'mongoose';

interface IMission extends Document {
  name: string;
  description?: string;
  surveyArea: {
    latitude: number;
    longitude: number;
    altitude: number;
  }[];
  waypoints: {
    coordinates: {
      latitude: number;
      longitude: number;
      altitude: number;
    };
    order: number;
  }[];
  flightParameters: {
    altitude: number;
    speed: number;
    overlapPercentage: number;
  };
  schedule: {
    type: 'one-time' | 'recurring';
    startTime: Date;
    endTime?: Date;
    recurringPattern?: string;
  };
  status: 'planned' | 'in-progress' | 'completed' | 'aborted';
  droneId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  surveyArea: [{
    latitude: Number,
    longitude: Number,
    altitude: Number
  }],
  waypoints: [{
    coordinates: {
      latitude: Number,
      longitude: Number,
      altitude: Number
    },
    order: Number
  }],
  flightParameters: {
    altitude: Number,
    speed: Number,
    overlapPercentage: Number
  },
  schedule: {
    type: { type: String, enum: ['one-time', 'recurring'] },
    startTime: Date,
    endTime: Date,
    recurringPattern: String
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'aborted'],
    default: 'planned'
  },
  droneId: { type: Schema.Types.ObjectId, ref: 'Drone' },
}, { timestamps: true });

export const Mission = mongoose.model<IMission>('Mission', MissionSchema); 