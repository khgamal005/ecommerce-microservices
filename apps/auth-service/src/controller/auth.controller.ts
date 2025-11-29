import { NextFunction, Request, Response } from 'express';
import {
  checkOtpRegistration,
  handleForgetPassword,
  sendotp,
  trackotpRequests,
  validationRegistrationData,
  verifyForgetPasswordOtp,
  verifyOtp,
} from '../utils/auth.helper';
import prisma from '@packages/libs/prisma';
import { AuthError, ValidationError } from '@packages/error-handler';
import bcrypt from 'node_modules/bcryptjs';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies/setCookie';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

/**
 * Register a new user
 * @route POST /api/register-user
 */
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body first
    validationRegistrationData(req.body, 'user');

    // THEN destructure - this was the syntax error!
    const { name, email, password } = req.body;

    // Double check required fields
    if (!name || !email || !password) {
      throw new ValidationError('Missing required fields for registration');
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
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
// * @route POST /api/verify-user

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
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError('User with this email already exists.'));
    }
    await verifyOtp(email, otp, next);

    // ✅ 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4. Create user in MongoDB
    const user = await prisma.users.create({
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

// * @route POST /api/verify-user

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

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return next(new AuthError('Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(new AuthError('Invalid email or password'));
    }

    // ✅ Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: '1h',
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: 'user' },
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
  await handleForgetPassword(req, res, next, 'user');
};

export const verifyUserForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgetPasswordOtp(req, res, next);
};

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      throw new ValidationError('Email and new password are required');
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return next(new ValidationError('User not found'));
    }

    if (!user.password) {
      return next(new ValidationError('User has no password set'));
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return next(
        new ValidationError('old password and new password must be different')
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
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

export const resendRegistrationOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      throw new ValidationError('Email is required to resend OTP');
    }

    let userName = name;
    if (!userName) {
      const user = await prisma.users.findUnique({ where: { email } });
      userName = user?.name || 'User';
    }

    await checkOtpRegistration(email, next);
    await trackotpRequests(email, next);

    await sendotp(userName, email, 'user-activation-mail');

    return res.status(200).json({
      message: 'OTP re-sent successfully. Please check your email.',
    });
  } catch (error) {
    console.log('❌ Error in resendRegistrationOtp:', error);
    return next(error); // ✅ FIXED
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return next(new ValidationError('Unauthorized: no refresh token'));
    }

    // Verify refresh token
    let decoded: { id: string; role: 'seller' | 'user' };
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
        id: string;
        role: 'seller' | 'user';
      };
    } catch (err) {
      return next(new JsonWebTokenError('Forbidden: invalid refresh token'));
    }

    let account;

    // Check if account exists based on role
    if (decoded.role === 'user') {
      account = await prisma.users.findUnique({
        where: { id: decoded.id },
      });
    } else if (decoded.role === 'seller') {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: {
          shop: true,
        },
      });
    }

    if (!account) {
      return next(new AuthError('Account not found'));
    }

    // Generate new tokens with consistent payload
    const accessToken = jwt.sign(
      { id: account.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '1h' } // Changed to 1h to match your login
    );

    const refreshToken = jwt.sign(
      { id: account.id, role: decoded.role },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    // Set cookies
    setAuthCookies(res, { accessToken, refreshToken });

    return res.status(200).json({
      message: 'Tokens refreshed successfully',
      role: decoded.role,
    });
  } catch (err) {
    console.error('❌ Error in refreshToken:', err);
    next(err);
  }
};

export const getUser = (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user; // ✅ get current user
    res.json({
      message: 'User profile fetched successfully',
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//  * @route POST /api/logout

export const logout = (req: Request, res: Response) => {
  try {
    // Clear the authentication cookies
    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout',
    });
  }
};

//  * @route POST /api/register-seller
export const sellerRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body first
    validationRegistrationData(req.body, 'seller');

    // THEN destructure - this was the syntax error!
    const { name, email, password } = req.body;

    // Double check required fields
    if (!name || !email || !password) {
      throw new ValidationError('Missing required fields for registration');
    }

    // Check if user already exists
    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });
    if (existingSeller) {
      return next(
        new ValidationError('seller with this email already exists.')
      );
    }

    // Check OTP and send new one
    await checkOtpRegistration(email, next);
    await trackotpRequests(email, next);
    await sendotp(name, email, 'seller-activation-mail');

    // Respond with success
    return res.status(201).json({
      message: 'OTP sent to your email, please check your inbox.',
    });
  } catch (error) {
    console.log('❌ Error in sellerRegistration:', error);
    next(error);
  }
};

// * @route POST /api/verify-seller

export const verifySellerRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, otp, phone_number, country } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password || !otp || !phone_number! || !country) {
      throw new ValidationError('Missing required fields for verification');
    }
    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });
    if (existingSeller) {
      return next(
        new ValidationError('seller with this email already exists.')
      );
    }
    await verifyOtp(email, otp, next);

    // ✅ 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4. Create user in MongoDB
    const seller = await prisma.sellers.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone_number,
        country,
      },
    });

    // ✅ 6. Send response
    return res.status(201).json({
      status: 'success',
      message: 'Account verified successfully',
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
      },
    });
  } catch (error) {
    console.log('❌ Error in verifyUserRegistration:', error);
    return next(error);
  }
};

//  * @route POST /api/create-shop
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      bio,
      category,
      address,
      opining_hours,
      webSite,
      socialLinks,
      sellerId,
    } = req.body;

    if (
      !sellerId ||
      !name ||
      !category ||
      !address ||
      !opining_hours ||
      !socialLinks
    ) {
      throw new ValidationError('all fields are required');
    }

    const shopData: any = {
      name,
      bio,
      category,
      address,
      opining_hours,
      sellerId,
    };
    if (webSite && webSite.trim() !== '') {
      shopData.webSite = webSite;
    }

    // Check if seller already has a shop
    const existingShop = await prisma.shops.findUnique({
      where: { sellerId },
    });

    if (existingShop) {
      throw new ValidationError('You already created a shop');
    }

    // OPTIONAL avatar (file upload)

    // Create shop
    const shop = await prisma.shops.create({
      data: shopData,
    });

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      shop,
    });
  } catch (err) {
    next(err);
  }
};

const strip = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// controllers/stripeController.ts

export const createStripeConnectLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.body;
    console.log(sellerId);

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID is required',
      });
    }

    // Check if seller exists in your database
    const seller = await prisma.sellers.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found',
      });
    }

    // Create new Stripe Connect account
    const account = await strip.accounts.create({
      type: 'express',
      country: 'GB',
      email: seller.email ?? undefined, // ✅ FIX HERE
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        sellerId: seller.id,
      },
    });
    // Update seller with Stripe account ID
    await prisma.sellers.update({
      where: { id: sellerId },
      data: {
        stripeId: account.id,
      },
    });

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/success`,
      return_url: `${process.env.FRONTEND_URL}/success`,
      type: 'account_onboarding',
    });

    return res.status(200).json({
      success: true,
      url: accountLink.url,
      message: 'Stripe onboarding link created successfully',
    });
  } catch (err) {
    console.error('Stripe Connect Error:', err);
    return next(err);
  }
};

export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError('Email and password are required'));
    }

    const seller = await prisma.sellers.findUnique({ where: { email } });

    if (!seller) {
      return next(new AuthError('Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, seller.password!);
    if (!isMatch) {
      return next(new AuthError('Invalid email or password'));
    }

    // ✅ Generate tokens
    const accessToken = jwt.sign(
      { id: seller.id, role: 'seller' },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: '1h',
      }
    );

    const refreshToken = jwt.sign(
      { id: seller.id, role: 'seller' },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    // ✅ Set tokens as cookies
    setAuthCookies(res, { accessToken, refreshToken });

    // ✅ Response
    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
      },
    });
  } catch (error) {
    console.log('❌ Error in loginseller:', error);
    next(error);
  }
};

export const getSeller = (req: any, res: Response, next: NextFunction) => {
  try {
    const seller = req.seller; 
            console.log('seller:', req.seller);

    res.json({
      message: 'seller profile fetched successfully',
      success: true,
      seller,
    });
  } catch (error) {
    next(error);
  }
};
