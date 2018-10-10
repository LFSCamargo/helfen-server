import mongoose from 'mongoose';
import { Pet } from './PetMethods';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      coordinates: { type: [Number, Number], default: [0, 0] },
    },
    type: {
      type: String,
      required: false,
      index: true,
    },
    obs: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    user: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'pet',
  },
);

export default mongoose.model<Pet>('Pet', Schema);
