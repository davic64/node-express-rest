import { RoleType } from '@prisma/client';

const allRoles = {
  [RoleType.USER]: [],
  [RoleType.ADMIN]: ['manageUsers'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
