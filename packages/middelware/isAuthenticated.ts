import prisma from '@packages/libs/prisma';
import { sellers, users } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  seller?: sellers;
  user?: users;
  role?: "seller" | "admin" | "user";
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies['accessToken'] ||
      req.cookies['refreshToken'] ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: 'seller' | 'user';
    };

    if (!decoded || !decoded.id) {
      res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
      return;
    }

    req.role = decoded.role;

    let account;

    if (decoded.role === 'user') {
      account = await prisma.users.findUnique({
        where: { id: decoded.id },
      });

      if (account) {
        req.user = account;
      }
    } else if (decoded.role === 'seller') {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: {
          shop: true,
        },
      });

      if (account) {
        req.seller = account;
      }
    }

    if (!account) {
      res.status(401).json({ message: 'Unauthorized: Account not found' });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};
