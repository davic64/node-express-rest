import httpStatus from 'http-status';
import { userService } from '../services';
import { Request, Response } from 'express';
import { ApiError } from '../utils/errors';

const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = await userService.createUser(email, password, name);
  res.status(httpStatus.CREATED).json(user);
};

const getUsers = async (req: Request, res: Response) => {
  const { page, limit, sortBy, sortType, ...filter } = req.query;

  const options = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortType: sortType as 'asc' | 'desc',
  };

  const users = await userService.getUsers(filter as object, options as object);
  res.status(httpStatus.OK).json(users);
};

const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await userService.getUserbyId(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).json(user);
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { email, password, name } = req.body;
  const user = await userService.updateUser(userId, { email, password, name });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).json(user);
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  await userService.deleteUser(userId);
  res.status(httpStatus.NO_CONTENT).json({});
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
