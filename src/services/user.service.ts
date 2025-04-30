import { User } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../prisma";
import { ApiError } from "../utils/errors";
import { encryptPassword } from "../utils/crypto";

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
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
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = ["id", "email", "password", "name"] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

export default { createUser, getUserByEmail };
