import { AuthError } from '@packages/error-handler';
import { Request, Response, NextFunction } from 'express';


import "express";

declare module "express-serve-static-core" {
  interface Request {
    role?: "user" | "seller" | "admin";
  }
}



export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.role);

  if (req.role !== "seller") {
    return next(new AuthError("Unauthorized seller only"));
  }
  next();
};

export const isUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "user") {
    return next(new AuthError("Unauthorized user only"));
  }
  next();
};
