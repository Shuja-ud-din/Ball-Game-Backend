import { UserRoles, UserStatus } from '@/constants/enums';

export interface IUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  status: UserStatus;
  otp?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
