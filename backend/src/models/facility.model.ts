import mongoose, { Document, Schema } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  area: number; // in square meters
  boundaries: Array<{
    latitude: number;
    longitude: number;
  }>;
  type: string; // e.g., 'industrial', 'commercial', 'warehouse'
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  area: { type: Number, required: true },
  boundaries: [{
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }],
  type: {
    type: String,
    required: true,
    enum: ['industrial', 'commercial', 'warehouse', 'other']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  versionKey: false
});

FacilitySchema.index({ 'location.coordinates': '2dsphere' });
FacilitySchema.index({ name: 1 });
FacilitySchema.index({ status: 1 });

export const Facility = mongoose.model<IFacility>('Facility', FacilitySchema);
