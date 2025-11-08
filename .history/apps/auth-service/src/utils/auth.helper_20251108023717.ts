import { ValidationError } from '@packages/error-handler';
import crypto from 'node:crypto';
import { NextFunction } from 'express';
import redis from '@packages/libs/prisma/redis';
import { sendEmail } from './sendEmail';

export const validationRegistrationUser = (
  data: any,
  userType: 'user' | 'seller'
): true => {
  // Use 'name' instead of 'username' to match your request body
  const { email, password, name, phone_number, country } = data;

  // 1️⃣ Check required fields - use 'name' instead of 'username'
  if (
    !email ||
    !password ||
    !name || // Changed from username to name
    (userType === 'seller' && (!phone_number || !country))
  ) {
    console.log('❌ Field status:', {
      hasEmail: !!email,
      hasPassword: !!password,
      hasName: !!name,
      hasPhone: !!phone_number,
      hasCountry: !!country,
    });
    throw new ValidationError('Missing required fields for registration');
  }

  // 2️⃣ Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  console.log('✅ Validation passed');
  return true;
};

// ... rest of your functions remain the same
export const checkOtpRegistration = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        'account locked due to many  failed attempt  You can request a new OTP after 30 minute.'
      )
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        'too many request   You can request a new OTP after 1 hour .'
      )
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError('   You can request a new OTP after 1 minute .')
    );
  }
};

export const sendotp = async (
  name: string, // Fixed parameter order to match your usage
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  sendEmail(email, 'verify your Email', template, { name, otp });

  await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // Attempts counter valid for 1 minutes
};

export const trackotpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 6) {
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600);
    return next(
      new ValidationError(
        'too many request   You can request a new OTP after 1 hour .'
      )
    );
  }
  await redis.set(otpRequestKey, (otpRequests + 1).toString(), 'EX', 3600);
};
export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const savedOtp = await redis.get(`otp:${email}`);
  if (!savedOtp) {
    throw new ValidationError('OTP expired or not found');
  }

  const failedAttemptsKey = `otp_failed_attempts:${email}`;

  let otpFailedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

  if (savedOtp !== otp) {
    if (otpFailedAttempts >= 3) {
      await redis.set(`otp_lock:${email}`, 'locked', 'EX', 1800);
      await redis.set(failedAttemptsKey, otpFailedAttempts.toString(), 'EX', 1800);
      await redis.del(`otp:${email}`);

      throw new ValidationError(
        'Account locked due to too many failed OTP attempts. Please try again after 30 minutes.'
      );

    }

    await redis.set(failedAttemptsKey, otpFailedAttempts + 1, 'EX', 300);

    throw new ValidationError(
      `Invalid OTP. You have ${3 - otpFailedAttempts} attempts left.`
    );

  }
  await redis.del(failedAttemptsKey);
};


export const handelForgetPassword = async (req,
  req : Request,
  res :Response ,
  


  next,
  userType) => {
  const { email } = req.body;

  if (!email) {
    return next(new ValidationError("Email is required"));
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return next(new AuthError("User not found"));
  }

  const otp = crypto.randomInt(1000, 9999).toString();
  sendEmail(email, 'verify your Email', template, { name, otp });

  await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // Attempts counter valid for 1 minutes
};
