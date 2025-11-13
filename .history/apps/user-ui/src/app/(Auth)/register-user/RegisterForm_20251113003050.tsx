'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import GoogleSignInButton from '../../shared/components/google-button/GoogleSignInButton';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState<RegisterFormInputs | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


  const inputsRefs = useRef<(HTMLInputElement | null)[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ OTP Auto Focus
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // stop default paste behavior

    const pasted = e.clipboardData.getData('text').trim();
    const digits = pasted.replace(/\D/g, ''); // remove anything not 0–9

    if (digits.length !== otp.length) return;

    const newOtp = digits.split(''); // ['4','9','3','1']
    setOtp(newOtp);

    // focus last input
    inputsRefs.current[otp.length - 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Timer logic
  const startTimer = () => {
    // If an old interval exists, clear it first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCanResend(false);
    setTimer(60);

    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // 🧹 Cleanup on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ✅ React Query — Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormInputs) => {
      const res = await fetch(`${API_URL}/api/register-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Something went wrong');
      return { json, data };
    },

    onSuccess: ({ json, data }) => {
      setSuccessMessage(json.message);
      setShowOtp(true);
      setUserData(data);
      startTimer();
    },

    onError: (err: any) => setServerError(err.message),
  });

  const onSubmit = (data: RegisterFormInputs) => {
    setServerError(null);
    setSuccessMessage(null);
    registerMutation.mutate(data);
  };

  // ✅ React Query — Verify OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const otpCode = otp.join('');
      if (otpCode.length !== 4) throw new Error('Please enter 4-digit OTP');

      const res = await fetch(`${API_URL}/api/verify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData?.email,
          name: userData?.name,
          password: userData?.password,
          otp: otpCode,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Invalid OTP');
      return json;
    },

    onSuccess: () => {
      setMessage('✅ Account verified successfully');

      timeoutRef.current = setTimeout(() => {
        router.push('/login');
      }, 2000);
    },

    onError: (err: any) => setServerError(err.message),
  });

  // ✅ Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData?.email }),
      });

      if (!res.ok) throw new Error('Failed to resend OTP');
    },

    onSuccess: () => {
      startTimer();
      setOtp(['', '', '', '']);
      inputsRefs.current[0]?.focus();
    },

    onError: () => setServerError('Failed to resend OTP'),
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-8">
      {!showOtp ? (
        /* ✅ Registration Form Screen */
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto p-6 shadow-lg border rounded-xl bg-white"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Create Account
          </h2>

          {/* NAME */}
          <div className="mb-3">
            <label className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              placeholder="Enter your full name"
            />
            <p className="text-red-600 text-sm mt-1">{errors.name?.message}</p>
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="block mb-1 font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              placeholder="Enter your email"
            />
            <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full pr-10"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-red-600 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* BACKEND ERROR */}
          {serverError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{serverError}</p>
            </div>
          )}

          {/* SUCCESS */}
          {successMessage && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg flex items-center justify-center"
          >
            {registerMutation.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : null}
            {registerMutation.isPending
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-xs text-gray-500">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Button */}
          <GoogleSignInButton callbackUrl="/" />

          {/* Login Link */}
          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        /* ✅ OTP Screen */
        <div className="w-full max-w-md mx-auto p-6 shadow-lg border rounded-xl bg-white">
          <h3 className="text-xl font-semibold text-center mb-6">
            Verify Your Email
          </h3>
          <p className="text-gray-600 text-center mb-6 text-sm">
            We've sent a verification code to your email. Please enter it below.
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                ref={(el: HTMLInputElement | null) => {
                  inputsRefs.current[index] = el;
                }}
                className="w-12 h-12 text-center border rounded-lg text-lg"
              />
            ))}
          </div>

          {/* Error Msg */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{serverError}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center">{message}</p>
            </div>
          )}

          <button
            onClick={() => verifyOtpMutation.mutate()}
            disabled={verifyOtpMutation.isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-lg flex justify-center"
          >
            {verifyOtpMutation.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : null}
            {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center mt-4">
            {canResend ? (
              <button
                onClick={() => resendOtpMutation.mutate()}
                className="text-blue-500 hover:underline text-sm"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Resend OTP in{' '}
                <span className="text-blue-500 font-semibold">{timer}</span>s
              </p>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => setShowOtp(false)}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Back to registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
