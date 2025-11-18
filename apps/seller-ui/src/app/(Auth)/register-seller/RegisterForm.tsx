'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm, Watch } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Store, CreditCard } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { countries } from 'apps/seller-ui/src/utils/countries';
import CreateShopForm from './CreateShopForm';
import CreateBankForm from './CreateBankForm';

 type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  country: string;
};



const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();





  const [serverError, setServerError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [sellerId, setSellerId] = useState('');

  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [sellerData, setSellerData] = useState<RegisterFormInputs | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const inputsRefs = useRef<(HTMLInputElement | null)[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const passwordValue = watch('password');


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
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    const digits = pasted.replace(/\D/g, '');

    if (digits.length !== otp.length) return;

    const newOtp = digits.split('');
    setOtp(newOtp);
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

  const getStrengthData = (password: string) => {
    if (!password)
      return {
        score: 0,
        color: 'text-gray-400',
        label: '',
        bgColor: 'bg-gray-400',
        segments: [],
      };

    let score = 0;
    const requirements = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];

    const metCount = requirements.filter(Boolean).length;

    // Map 4 requirements to 3 strength levels
    if (metCount <= 1) {
      score = 1; // Weak
    } else if (metCount <= 2) {
      score = 2; // Medium
    } else {
      score = 3; // Strong
    }

    const strengthData = [
      { color: 'text-red-500', label: 'Weak', bgColor: 'bg-red-500' },
      { color: 'text-yellow-500', label: 'Medium', bgColor: 'bg-yellow-500' },
      { color: 'text-green-500', label: 'Strong', bgColor: 'bg-green-500' },
    ];

    const currentStrength = strengthData[score - 1] || strengthData[0];

    return {
      score,
      ...currentStrength,
      segments: requirements.map((met, index) => ({
        met: index < metCount,
        requirement: [
          '6+ characters',
          'Uppercase letter',
          'Number',
          'Special character',
        ][index],
      })),
    };
  };

  // ✅ Timer logic
  const startTimer = () => {
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ✅ React Query — Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormInputs) => {
      const res = await fetch(`${API_URL}/api/register-seller`, {
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
      setSellerData(data);
    },

    onError: (err: any) => {
      setServerError(err.message);
      startTimer();
    },
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

      const res = await fetch(`${API_URL}/api/verify-seller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sellerData?.email,
          name: sellerData?.name,
          password: sellerData?.password,
          country: sellerData?.country,
          phone_number: sellerData?.phone_number,
          otp: otpCode,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Invalid OTP');
      return json;
    },

    onSuccess: (data) => {
      setMessage('✅ Account verified successfully');
      setSellerId(data?.seller?.id);
      setActiveStep(2); // Move to shop setup after verification
      setShowOtp(false);
    },

    onError: (err: any) => setServerError(err.message),
  });

  // ✅ Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sellerData?.email }),
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

 

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center pt-8 bg-gray-50">
      {/* Stepper */}
      <div className="flex flex-col items-center w-full max-w-4xl px-4 relative mb-8">
        {/* Progress bar background */}
        <div className="w-full md:w-[50%] h-2 bg-gray-200 rounded-full relative">
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
          ></div>
        </div>

        {/* Steps container */}
        <div className="w-full md:w-[50%] flex justify-between items-center relative -mt-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="flex flex-col items-center relative z-10"
            >
              {/* Step circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-4 border-white transition-all duration-300 ${
                  step <= activeStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                {step}
              </div>

              {/* Step label */}
              <span className="text-xs md:text-sm mt-2 text-center font-medium text-gray-700 whitespace-nowrap">
                {step === 1
                  ? 'Create Account'
                  : step === 2
                  ? 'Setup Shop'
                  : 'Connect Bank'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Content */}
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg mx-4">
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              /* ✅ Registration Form Screen */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                  Create Account
                </h2>

                {/* NAME */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name?.message}
                  </p>
                </div>

                {/* EMAIL */}
                <div>
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
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email?.message}
                  </p>
                </div>
                {/* phone */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    {...register('phone_number', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10,15}$/, // 10–15 digits
                        message: 'Invalid phone number',
                      },
                    })}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone"
                  />

                  <p className="text-red-600 text-sm mt-1">
                    {errors.phone_number?.message}
                  </p>
                </div>
                {/* {country} */}
                {/* Country Select */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Country
                  </label>

                  <select
                    {...register('country', {
                      required: 'Country is required',
                    })}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                  >
                    <option value="">Select country</option>

                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.dial_code})
                      </option>
                    ))}
                  </select>

                  <p className="text-red-600 text-sm mt-1">
                    {errors.country?.message}
                  </p>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Minimum 6 characters',
                        },
                      })}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Create a password"
                    />

                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {passwordVisible ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <p className="text-red-600 text-sm mt-1">
                    {errors.password?.message}
                  </p>

                  {/* PASSWORD STRENGTH INDICATOR */}
                  {passwordValue && (
                    <div className="mt-3 space-y-2">
                      {/* Strength bars - 3 segments for 3 strength levels */}
                      <div className="flex gap-1">
                        {[1, 2, 3].map((segment) => (
                          <div
                            key={segment}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              segment <= getStrengthData(passwordValue).score
                                ? getStrengthData(passwordValue).bgColor
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Strength text */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Strength:{' '}
                          <span
                            className={getStrengthData(passwordValue).color}
                          >
                            {getStrengthData(passwordValue).label}
                          </span>
                        </span>

                        {/* Optional: Show requirements met */}
                        <span className="text-xs text-gray-500">
                          {
                            getStrengthData(passwordValue).segments.filter(
                              (s) => s.met
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* BACKEND ERROR */}
                {serverError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{serverError}</p>
                    <p className="text-sm text-gray-600">
                      Resend OTP in{' '}
                      <span className="text-blue-500 font-semibold">
                        {timer}
                      </span>
                      s
                    </p>{' '}
                  </div>
                )}

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-lg flex items-center justify-center transition-colors"
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : null}
                  {registerMutation.isPending
                    ? 'Creating Account...'
                    : 'Create Account'}
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-xs text-gray-500">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Login Link */}
                <p className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            ) : (
              /* ✅ OTP Screen */
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">
                  Verify Your Email
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  We've sent a verification code to your email. Please enter it
                  below.
                </p>

                <div className="flex justify-center gap-3">
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
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>

                {/* Error Msg */}
                {serverError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">
                      {serverError}
                    </p>
                  </div>
                )}

                {message && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm text-center">
                      {message}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => verifyOtpMutation.mutate()}
                  disabled={verifyOtpMutation.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-lg flex justify-center items-center transition-colors"
                >
                  {verifyOtpMutation.isPending ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : null}
                  {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="text-center">
                  {canResend ? (
                    <button
                      onClick={() => resendOtpMutation.mutate()}
                      className="text-blue-500 hover:underline text-sm font-medium"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Resend OTP in{' '}
                      <span className="text-blue-500 font-semibold">
                        {timer}
                      </span>
                      s
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowOtp(false)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Back to registration
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {activeStep === 2 && (
          <CreateShopForm sellerId={sellerId} setActiveStep={setActiveStep} />
        )}

        {activeStep === 3 && (
          <CreateBankForm  sellerId={sellerId}/>

        )}
      </div>
    </div>
  );
};

export default RegisterForm;
