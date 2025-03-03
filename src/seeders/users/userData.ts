import { UserRole } from '@prisma/client';

export const userData = [
  {
    email: 'superadmin@gmail.com',
    name: 'Super Admin',
    password: 'SuperAdmin1122',
    role: UserRole.SUPERADMIN,
  },
];
