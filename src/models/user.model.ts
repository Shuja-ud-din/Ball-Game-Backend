import mongoose from 'mongoose';

import { UserRoles, UserStatus } from '@/constants/enums';
import { IUser } from '@/types/user.types';

const schema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.ADMIN,
    },
    otp: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', schema);
