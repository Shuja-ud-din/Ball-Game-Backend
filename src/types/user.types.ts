import { UserRoles, UserStatus } from '@/constants/enums';

export interface IUserDoc {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  status: UserStatus;
  otp?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IUser = Omit<IUserDoc, 'password' | 'otp'>;

export interface IDecodedToken {
  _id: any;
  id: string;
  email: string;
  iat: number;
  exp: number;
}

interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  status: UserStatus;
}

export type TCreateUserService = (user: ICreateUser) => Promise<IUser>;
export type TGetUserService = (id: string) => Promise<IUser>;
export type TGetUsersService = () => Promise<IUser[]>;
export type TUpdateUserService = (id: string, user: Partial<ICreateUser>) => Promise<IUser>;
