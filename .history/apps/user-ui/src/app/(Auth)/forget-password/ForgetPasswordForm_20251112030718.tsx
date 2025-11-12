'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';


type ForgetPasswordInputs = {
  email: string;
};

const ForgetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordInputs>();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

// ✅ React Query — Forget Password Mutation
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

  onSuccess: ({ json }) => {
    // Show success message
    setSuccessMessage(json.message || '✅ OTP sent to your email');
  },

  onError: (err: any) => {
    setServerError(err.message || 'Server error, try again later.');
  },
});

// ✅ onSubmit for form
const onSubmit = (data: ForgetPasswordInputs) => {
  setServerError(null);
  setSuccessMessage(null);
  forgetPasswordMutation.mutate(data);
};



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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white"
    >
      <h2 className="text-2xl font-semibold mb-5 text-center">Forget Password</h2>

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
      {serverError && <p className="text-red-500 text-sm mb-3">{serverError}</p>}

      {/* SUCCESS MSG */}
      {successMessage && <p className="text-green-600 text-sm mb-3">{successMessage}</p>}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
      >
        Send OTP
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
  );
};

export default ForgetPasswordForm;
