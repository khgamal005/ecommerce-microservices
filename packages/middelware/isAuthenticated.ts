import { sellers, users } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../libs/prisma';

interface AuthRequest extends Request {
  seller?: sellers;
  user?: users;
  role?: 'seller' | 'admin' | 'user';
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;

    const token = accessToken;

    if (!token) {
      console.log('❌ No access token found');
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    // FIX: Verify with correct secret
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: 'seller' | 'user';
    };

    // console.log('🔍 Decoded token:', decoded);

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
  } catch (err: any) {
    console.error('❌ Auth error:', err.message);

    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        message: 'Access token expired',
        shouldRefresh: true,
      });
      return;
    }

    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    res.status(401).json({ message: 'Unauthorized: Authentication failed' });
  }
};
