import { UserRoles } from '@/constants/enums';

export const userData = [
  {
    email: 'superadmin@gmail.com',
    name: 'Super Admin',
    password: 'SuperAdmin1122',
    role: UserRoles.ADMIN,
  },
  {
    email: 'user@gmail.com',
    name: 'User',
    password: 'User1122',
    role: UserRoles.USER,
  },
];
