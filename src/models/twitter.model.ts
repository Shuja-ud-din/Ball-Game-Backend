import mongoose from 'mongoose';

import { AccountType } from '@/constants/enums';
import { ITwitter } from '@/types/twitter.types';

const schema = new mongoose.Schema<ITwitter>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => Object.values(AccountType).includes(v as AccountType),
        message: (props: any) => `${props.value} is not a valid account type`,
      },
    },
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

export const Twitter = mongoose.model('Twitter', schema);
