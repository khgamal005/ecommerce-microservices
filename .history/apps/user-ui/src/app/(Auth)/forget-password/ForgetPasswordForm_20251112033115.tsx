'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

type ForgetPasswordInputs = {
  email: string;
};

type ResetInputs = {
  email: string;
  newPassword: string;
};
const ForgetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordInputs>();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState<ForgetPasswordInputs | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);



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
    setCanResend(false);
    setTimer(60);

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
        }
        return t - 1;
      });
    }, 1000);
  };

  // ✅ React Query — Verify OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const otpCode = otp.join('');
      if (otpCode.length !== 4) throw new Error('Please enter 4-digit OTP');

      const res = await fetch(`${API_URL}/api/verify-forget-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData?.email,
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

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetInputs) => {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error resetting password');
      return { json, data };
    },

    onSuccess: ({ json }) => {
      setSuccess(json.message || '✅ Password reset successfully!');
      // Optional: redirect after success
      // setTimeout(() => router.push("/login"), 2000);
    },

    onError: (err: any) => {
      setServerError(err.message || 'Server error. Please try again.');
    },
  });
  // ✅ onSubmit for the form
  const onSubmit = (data: ResetInputs) => {
    setServerError(null);
    setSuccess(null);
    resetPasswordMutation.mutate(data);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      forget-password screen
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white"
      >
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Forget Password
        </h2>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required' })}
            className="border rounded px-3 py-2 w-full"
          />
          <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
        </div>

        {/* SERVER ERROR */}
        {serverError && (
          <p className="text-red-500 text-sm mb-3">{serverError}</p>
        )}

        {/* SUCCESS MSG */}
        {successMessage && (
          <p className="text-green-600 text-sm mb-3">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={forgetPasswordMutation.isPending}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg flex items-center justify-center"
        >
          {forgetPasswordMutation.isPending && (
            <Loader2 className="animate-spin mr-2" />
          )}
          {forgetPasswordMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
        </button>

        {/* Verify OTP Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already received OTP?{' '}
          <Link
            href="/verify-forget-password"
            className="text-blue-500 hover:underline font-medium"
          >
            Verify OTP
          </Link>
        </p>
      </form>
      otp screen ( /* ✅ OTP Screen */
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
      ) reset password screen
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white"
      >
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Reset Password
        </h2>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
            className="border rounded px-3 py-2 w-full"
          />
          <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
        </div>

        {/* NEW PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="New Password"
            {...register('newPassword', {
              required: 'New password is required',
            })}
            className="border rounded px-3 py-2 w-full"
          />
          <p className="text-red-600 text-sm mt-1">
            {errors.newPassword?.message}
          </p>
        </div>

        {/* BACKEND ERROR */}
        {serverError && (
          <p className="text-red-500 text-sm mb-3">{serverError}</p>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && <p className="text-green-600 text-sm mb-3">{successMessage}</p>}

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg flex items-center justify-center"
        >
          {resetPasswordMutation.isPending && (
            <Loader2 className="animate-spin mr-2" />
          )}
          {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  );
};

export default ForgetPasswordForm;
