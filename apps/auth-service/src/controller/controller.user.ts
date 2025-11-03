import { NextFunction, Request, Response } from "express";
import {
  checkOtpRegistration,
  sendotp,
  trackotpRequests,
  validationRegistrationUser,
} from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationRegistrationUser(req.body, "user");
    const { name, email } = req.body;

    // 2️⃣ Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError("User with this email already exists."));
    }

    // 3️⃣ Check OTP and send new one
    await checkOtpRegistration(email, next);
    await trackotpRequests(email, next);
    await sendotp(email, name, "userActivationemail");

    // ✅ Respond with success
    return res.status(201).json({
      message: "OTP sent to your email, please check your inbox.",
    });
  } catch (error) {
    next(error);
  }
};
