import { Prisma, User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../prisma';
import { ApiError } from '../utils/errors';
import { encryptPassword } from '../utils/crypto';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (email: string, password: string, name: string): Promise<User> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  password = await encryptPassword(password);
  return prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
};

/**
 *
 * @param {Object} filter
 * @param {Object} options
 * @param {string} [options.sortBy]
 * @param {number} [options.limit]
 * @param {number} [options.page]
 * @returns {Promise}
 */
const getUsers = async <Key extends keyof User>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = ['id', 'email', 'name', 'createdAt'] as Key[],
): Promise<Pick<User, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy ?? 'createdAt';
  const sortType = options.sortType ?? 'desc';
  const users = await prisma.user.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
  });
  return users as Pick<User, Key>[];
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserbyId = async <Key extends keyof User>(
  id: string,
  keys: Key[] = ['id', 'email', 'name'] as Key[],
): Promise<Pick<User, Key> | null> =>
  prisma.user.findUnique({
    where: {
      id,
    },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = ['id', 'email', 'password', 'name'] as Key[],
): Promise<Pick<User, Key> | null> => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  });

  return existingUser as Pick<User, Key> | null;
};
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUser = async <Key extends keyof User>(
  userId: string,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ['id', 'email', 'name'] as Key[],
): Promise<Pick<User, Key> | null> => {
  const user = await getUserbyId(userId, ['id', 'email', 'name']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await getUserByEmail(updateBody.email as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (updateBody.password) {
    updateBody.password = await encryptPassword(updateBody.password as string);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  });
  return updatedUser as Pick<User, Key> | null;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUser = async (userId: string): Promise<User> => {
  const user = await getUserbyId(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
  return user;
};

export default { createUser, getUsers, getUserbyId, getUserByEmail, updateUser, deleteUser };
