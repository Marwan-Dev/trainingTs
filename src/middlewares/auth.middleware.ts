import { NextFunction, Request, Response } from 'express';
import config from '../config';
import jwt from 'jsonwebtoken';
import Error from '../interfaces/error.interface';

const handleUnauthorizedError = (next: NextFunction) => {
  const error: Error = new Error('Authentication failed');
  error.status = 401;
  next(error);
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get Auth Header
    const authHeader = req.get('Authorization');
    if (authHeader) {
      const bearer = authHeader.split(' ')[0].toLowerCase();
      const token = authHeader.split(' ')[1];
      if (token && bearer === 'bearer') {
        const decodedToken = jwt.verify(
          token,
          config.accessToken as unknown as string
        );
        if (decodedToken) {
          next();
        } else {
          handleUnauthorizedError(next);
        }
      } else {
        handleUnauthorizedError(next);
      }
    } else {
      handleUnauthorizedError(next);
    }
  } catch (error) {
    handleUnauthorizedError(next);
  }
};

export default authMiddleware;
