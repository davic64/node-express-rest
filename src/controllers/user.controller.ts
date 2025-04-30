import httpStatus from "http-status";
import { userService } from "../services";
import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = await userService.createUser(email, password, name);
  res.status(httpStatus.CREATED).json(user);
};

export default {
  createUser,
};
