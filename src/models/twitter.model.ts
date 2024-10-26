import mongoose from 'mongoose';

import { ITwitterToken } from '@/types/twitter.types';

const schema = new mongoose.Schema<ITwitterToken>(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TwitterToken = mongoose.model('Twitter', schema);
