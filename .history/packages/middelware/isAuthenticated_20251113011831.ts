import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any; // You can type it according to your user payload
}



interface AuthRequest extends Request {
  user?: any;
}

export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return; // ✅ ensure function always returns here
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as {id:s}
    );

    req.user = decoded;
    next(); // ✅ calls next() in success path
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    return; // ✅ ensures every code path ends
  }
};
