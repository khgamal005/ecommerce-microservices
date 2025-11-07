import { NextFunction, Request, Response } from "express";
import {
  checkOtpRegistration,
  sendotp,
  trackotpRequests,
  validationRegistrationUser,
} from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";

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
    console.log("✅ userRegistration controller called!");
    console.log("📦 Incoming body:", req.body);

    // Validate request body first
    validationRegistrationUser(req.body, "user");
    
    // THEN destructure - this was the syntax error!
    const { name, email, password } = req.body;


    // Double check required fields
    if (!name || !email || !password) {
      throw new ValidationError("Missing required fields for registration");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError("User with this email already exists."));
    }

    // Check OTP and send new one
    await checkOtpRegistration(email, next);
    await trackotpRequests(email, next);
    await sendotp(name, email, "user-activation-mail");

    // Respond with success
    return res.status(201).json({
      message: "OTP sent to your email, please check your inbox.",
    });
  } catch (error) {
    console.log("❌ Error in userRegistration:", error);
    next(error);
  }
};