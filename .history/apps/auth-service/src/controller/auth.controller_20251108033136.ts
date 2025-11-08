import { NextFunction, Request, Response } from 'express';
import {
  checkOtpRegistration,
  handleForgetPassword
  ,
  sendotp,
  trackotpRequests,
  validationRegistrationUser,
  verifyOtp,
} from '../utils/auth.helper';
import prisma from '@packages/libs/prisma';
import { AuthError, ValidationError } from '@packages/error-handler';
import bcrypt from 'node_modules/bcryptjs';
import jwt from 'jsonwebtoken';
import { setAuthCookies } from '../utils/cookies/setCookie';

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
    validationRegistrationUser(req.body, 'user');

    // THEN destructure - this was the syntax error!
    const { name, email, password } = req.body;

    // Double check required fields
    if (!name || !email || !password) {
      throw new ValidationError('Missing required fields for registration');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError('User with this email already exists.'));
    }

    // Check OTP and send new one
    await checkOtpRegistration(email, next);
    await trackotpRequests(email, next);
    await sendotp(name, email, 'user-activation-mail');

    // Respond with success
    return res.status(201).json({
      message: 'OTP sent to your email, please check your inbox.',
    });
  } catch (error) {
    console.log('❌ Error in userRegistration:', error);
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
      throw new ValidationError('Missing required fields for verification');
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError('User with this email already exists.'));
    }
    await verifyOtp(email, otp, next);

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

    // ✅ 6. Send response
    return res.status(201).json({
      status: 'success',
      message: 'Account verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log('❌ Error in verifyUserRegistration:', error);
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError('Email and password are required'));
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return next(new AuthError('Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(new AuthError('Invalid email or password'));
    }

    // ✅ Generate tokens
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    // ✅ Set tokens as cookies
    setAuthCookies(res, { accessToken, refreshToken });

    // ✅ Response
    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log('❌ Error in loginUser:', error);
    next(error);
  }
};
export const userForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await handleForgetPassword(req, res, next, 'user');

    res.status(200).json({
      status: 'success',
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.log('❌ Error in userForgetPassword:', error);
    next(error);
  }
};


export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email,newPassword } = req.body;

    // ✅ Validate inputs
    if (!email || ,| !newPassword) {
      throw new ValidationError('Email, OTP, and new password are required');
    }

    // ✅ Verify user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ValidationError('User not found');
    }

    // ✅ Verify OTP
    await verifyOtp(email, otp, next);

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.log('❌ Error in resetUserPassword:', error);
    next(error);
  }
};


