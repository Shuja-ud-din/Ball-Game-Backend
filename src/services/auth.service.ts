import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env';
import { IUserDoc } from '@/types/user.types';
import { APIError } from '@/utils/APIError';

const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = env;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const generateToken = (user: any) => {
  const payload: Partial<IUserDoc> = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    return decoded;
  } catch (err: any) {
    throw new APIError('Unauthorized', StatusCodes.UNAUTHORIZED);
  }
};
