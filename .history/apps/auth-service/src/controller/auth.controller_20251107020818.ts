import { NextFunction, Request, Response } from "express";
import {
  checkOtpRegistration,
  sendotp,
  trackotpRequests,
  validationRegistrationUser,
} from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";
import redis from "@packages/libs/prisma/redis";
import bcrypt from "node_modules/bcryptjs";

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


export const verifyUserRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, otp } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password || !otp) {
      throw new ValidationError("Missing required fields for verification");
    }

    // ✅ 1. Get OTP stored in Redis
    const savedOtp = await redis.get(`otp:${email}`);
    if (!savedOtp) {
      throw new ValidationError("OTP expired or not found");
    }

    // ✅ 2. Compare OTP
    if (savedOtp !== otp) {
      throw new ValidationError("Invalid OTP");
    }

    // ✅ 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4. Create user in MongoDB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // ✅ 5. Delete OTP after successful verification
    await redis.del(`otp:${email}`);
    await redis.del(`otp_cooldown:${email}`);

    // ✅ 6. Send response
    return res.status(201).json({
      status: "success",
      message: "Account verified successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("❌ Error in verifyUserRegistration:", error);
    return next(error);
  }
};



