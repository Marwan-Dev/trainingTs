import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import config from '../config';
import jwt from 'jsonwebtoken';

const userModel = new UserModel();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.create(req.body);
    res.json({
      status: 'success',
      data: { ...user },
      message: 'User Created Successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({
      status: 'success',
      data: users,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.getUserByID(
      req.params.id as unknown as string
    );
    res.json({
      status: 'success',
      data: user,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.updateUser(req.body);
    res.json({
      status: 'success',
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.deleteUser(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: user,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.signIn(email, password);
    const accessToken = jwt.sign(
      { user },
      config.accessToken as unknown as string
    );
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The username or password are not valid',
      });
    }
    return res.json({
      status: 'success',
      data: { ...user, accessToken },
      message: 'user signed in successfully',
    });
  } catch (error) {
    return next(error);
  }
};
