'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

type ForgetPasswordInputs = { email: string };
type ResetInputs = { email: string; newPassword: string };

const ForgetPasswordForm = () => {
  const [step, setStep] = useState(1); // 1 = forget, 2 = otp, 3 = reset
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userData, setUserData] = useState<ForgetPasswordInputs | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  // ------------------- TIMER -------------------
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

  // ------------------- OTP HANDLERS -------------------
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    const digits = pasted.replace(/\D/g, '');
    if (digits.length !== otp.length) return;
    setOtp(digits.split(''));
    inputsRefs.current[otp.length - 1]?.focus();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ------------------- MUTATIONS -------------------
  const forgetPasswordMutation = useMutation({
    mutationFn: async (data: ForgetPasswordInputs) => {
      const res = await fetch(`${API_URL}/api/forget-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error sending OTP');
      return { json, data };
    },
    onSuccess: ({ json, data }) => {
      setSuccessMessage(json.message);
      setUserData(data);
      startTimer();
      setStep(2); // move to OTP screen
    },
    onError: (err: any) => setServerError(err.message),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const otpCode = otp.join('');
      if (otpCode.length !== 4) throw new Error('Please enter 4-digit OTP');

      const res = await fetch(`${API_URL}/api/verify-forget-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData?.email, otp: otpCode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Invalid OTP');
      return json;
    },
    onSuccess: () => setStep(3), // move to Reset Password screen
    onError: (err: any) => setServerError(err.message),
  });

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
      setOtp(['', '', '', '']);
      inputsRefs.current[0]?.focus();
      startTimer();
    },
    onError: () => setServerError('Failed to resend OTP'),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetInputs) => {
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',

        body: JSON.stringify(data),
      });
      console.log(res);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error resetting password');
      return { json, data };
    },
    onSuccess: ({ json }) => {
      setSuccessMessage(json.message || '✅ Password reset successfully!');
      timeoutRef.current = setTimeout(() => router.push('/login'), 2000);
    },
    onError: (err: any) =>
      setServerError(err.message || 'Server error. Please try again.'),
  });

  // ------------------- SUBMIT HANDLERS -------------------
  const onForgetSubmit = (data: ForgetPasswordInputs) => {
    setServerError(null);
    setSuccessMessage(null);
    forgetPasswordMutation.mutate(data);
  };

  const onResetSubmit = (data: ResetInputs) => {
    setServerError(null);
    setSuccessMessage(null);
    resetPasswordMutation.mutate(data);
  };

  // ------------------- RENDER -------------------
  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-semibold mb-5 text-center">
            Forget Password
          </h2>
          <form onSubmit={handleSubmit(onForgetSubmit)}>
            <input
              type="email"
              placeholder="Enter your email"
              {...register('email', { required: 'Email is required' })}
              className="border rounded px-3 py-2 w-full mb-2"
            />
            {errors.email?.message ? String(errors.email.message) : null}
            {serverError && (
              <p className="text-red-500 text-sm mb-2">{serverError}</p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm mb-2">{successMessage}</p>
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
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-semibold mb-5 text-center">
            Verify OTP
          </h2>
          <p className="text-gray-600 text-center mb-4 text-sm">
            Enter the 4-digit code sent to your email.
          </p>
          <div className="flex justify-center gap-3 mb-4">
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
          {serverError && (
            <p className="text-red-500 text-sm mb-2">{serverError}</p>
          )}
          {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
          <button
            onClick={() => verifyOtpMutation.mutate()}
            disabled={verifyOtpMutation.isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg flex items-center justify-center mb-2"
          >
            {verifyOtpMutation.isPending && (
              <Loader2 className="animate-spin mr-2" />
            )}
            {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="text-center">
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
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-2xl font-semibold mb-5 text-center">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit(onResetSubmit)}>
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="border rounded px-3 py-2 w-full mb-2"
            />
            {errors.email?.message ? String(errors.email.message) : null}

            <input
              type="password"
              placeholder="New Password"
              {...register('newPassword', {
                required: 'New password is required',
              })}
              className="border rounded px-3 py-2 w-full mb-2"
            />
            {errors.newPassword?.message as string}

            {serverError && (
              <p className="text-red-500 text-sm mb-2">{serverError}</p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm mb-2">{successMessage}</p>
            )}

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg flex items-center justify-center"
            >
              {resetPasswordMutation.isPending && (
                <Loader2 className="animate-spin mr-2" />
              )}
              {resetPasswordMutation.isPending
                ? 'Resetting...'
                : 'Reset Password'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgetPasswordForm;
