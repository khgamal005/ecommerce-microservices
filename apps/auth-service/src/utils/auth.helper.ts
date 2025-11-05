import { ValidationError } from '@packages/error-handler';
import crypto from 'node:crypto';
import { NextFunction } from 'express';
import redis from '@packages/libs/prisma/redis';
import { sendEmail } from './sendEmail';

export const validationRegistrationUser = (
  data: any,
  userType: 'user' | 'seller'
): true => {
  const { email, password, username, phone_number, country } = data;

  // 1️⃣ Check required fields
  if (
    !email ||
    !password ||
    !username ||
    (userType === 'seller' && (!phone_number || !country))
  ) {
    throw new ValidationError('Missing required fields for registration');
  }

  // 2️⃣ Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  // ✅ Everything is valid
  return true;
};

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
  name: string,
  email: string,
  templete: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  sendEmail(email, 'verify your Email', templete, { name, otp });

  await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // Attempts counter valid for 5 minutes
};

export const trackotpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 3) {
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600);
    return next(
      new ValidationError(
        'too many request   You can request a new OTP after 1 hour .'
      )
    );
  }
  await redis.set(otpRequestKey, (otpRequests + 1).toString(), 'EX', 3600);
};
