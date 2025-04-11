import mongoose, { Document, Schema } from 'mongoose';

export interface IDroneLocation {
  latitude: number;
  longitude: number;
  altitude: number;
}

// Create a base interface without Document extension
export interface IDroneBase {
  name: string;
  serialNumber: string;
  modelName: string; // Changed from 'model' to 'modelName' to avoid conflict
  manufacturer: string;
  status: 'available' | 'in-mission' | 'maintenance' | 'offline';
  batteryLevel: number;
  lastMaintenance: Date;
  currentLocation?: IDroneLocation;
  maxFlightTime: number;
  maxAltitude: number;
  maxSpeed: number;
  sensors: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Extend Document with the base interface
export interface IDrone extends Document, IDroneBase {}

const DroneLocationSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  altitude: { type: Number, required: true }
});

const DroneSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  serialNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  modelName: {  // Changed from 'model' to 'modelName'
    type: String, 
    required: true 
  },
  manufacturer: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['available', 'in-mission', 'maintenance', 'offline'],
    default: 'available' 
  },
  batteryLevel: { 
    type: Number,
    min: 0,
    max: 100,
    default: 100 
  },
  lastMaintenance: { 
    type: Date,
    default: Date.now 
  },
  currentLocation: { 
    type: DroneLocationSchema,
    required: false 
  },
  maxFlightTime: { 
    type: Number,
    required: true 
  },
  maxAltitude: { 
    type: Number,
    required: true 
  },
  maxSpeed: { 
    type: Number,
    required: true 
  },
  sensors: [{ 
    type: String,
    required: true 
  }]
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
DroneSchema.index({ serialNumber: 1 });
DroneSchema.index({ status: 1 });
DroneSchema.index({ batteryLevel: 1 });

// Virtual for drone's operational status
DroneSchema.virtual('isOperational').get(function() {
  return this.status === 'available' && this.batteryLevel > 20;
});

// Pre-save middleware to validate battery level
DroneSchema.pre('save', function(next) {
  if (this.batteryLevel < 0) this.batteryLevel = 0;
  if (this.batteryLevel > 100) this.batteryLevel = 100;
  next();
});

export const Drone = mongoose.model<IDrone>('Drone', DroneSchema); 