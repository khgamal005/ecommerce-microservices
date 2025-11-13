import prisma from "@packages/libs/prisma";
import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: User;
}


export const isAuthenticated = async(
  req: AuthRequest,
  res: Response,    
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string; role: "seller" | "user" };

    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Unauthorized: Invalid token payload" });
      return;
    }
    const account =await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!account) {
      res.status(401).json({ message: "Unauthorized: Account not found" });
      return;
    }

    req.user = account;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
