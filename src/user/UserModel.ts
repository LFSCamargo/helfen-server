import mongoose from 'mongoose';
import { User } from './UserMethods';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      index: true,
    },
    cell: {
      type: String,
      required: true,
    },
    document: {
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
    collection: 'user',
  },
);

export default mongoose.model<User>('User', Schema);
