import prisma from "@packages/libs/prisma";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; role: "seller" | "user" };
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Middleware to authenticate and authorize requests
 * @param {AuthRequest} req - Request with user property
 * @param {Response} res - Response to send back to client
 * @param {NextFunction} next - Next function to call if authentication successful
 * 
 * This middleware checks for the presence of an access token in
 * the request cookies or authorization header. If the token is
 * present, it verifies the token and checks if the user
 * associated with the token exists in the database. If the
 * user exists, it sets the user property on the request and
 * calls the next function. If the token is invalid or the
 * user does not exist, it returns a 401 Unauthorized response.
 */
/*******  2040299f-4ef4-4095-9d96-a474f5e2c12e  *******/

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

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
