'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import GoogleSignInButton from '../../shared/components/google-button/GoogleSignInButton';

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
  const [showOtp, setShowOtp] = useState(true);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputsRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Move to next input
    if (value && index < inputsRefs.current.length - 1) {
      inputsRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('http://localhost:6001/api/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message || 'Something went wrong');
        return;
      }

      setSuccessMessage(json.message);
      // Show OTP section after successful registration
      setShowOtp(true);
    } catch (err) {
      setServerError('Server error. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-8">
      {!showOtp ? (
<form
  onSubmit={handleSubmit(onSubmit)}
  className="w-full max-w-md mx-auto p-6 shadow-lg border rounded-xl bg-white"
>
  <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
    Create Account
  </h2>

  {/* NAME */}
  <div className="mb-3">
    <label className="block mb-1 font-medium text-gray-700">Full Name</label>
    <input
      type="text"
      {...register('name', { required: 'Name is required' })}
      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      placeholder="Enter your full name"
    />
    <p className="text-red-600 text-sm mt-1">{errors.name?.message}</p>
  </div>

  {/* EMAIL */}
  <div className="mb-3">
    <label className="block mb-1 font-medium text-gray-700">Email Address</label>
    <input
      type="email"
      {...register('email', { 
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      })}
      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      placeholder="Enter your email"
    />
    <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
  </div>

  {/* PASSWORD */}
  <div className="mb-4">
    <label className="block mb-1 font-medium text-gray-700">Password</label>
    <div className="relative">
      <input
        type={passwordVisible ? 'text' : 'password'}
        {...register('password', { 
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        })}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
        placeholder="Create a password"
      />
      {/* Toggle Icon Button */}
      <button
        type="button"
        onClick={() => setPasswordVisible(!passwordVisible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
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
    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors duration-200 mb-3"
  >
    Create Account
  </button>

  {/* Divider */}
  <div className="flex items-center my-4">
    <div className="flex-grow border-t border-gray-300"></div>
    <span className="mx-2 text-xs text-gray-500">Or continue with</span>
    <div className="flex-grow border-t border-gray-300"></div>
  </div>

  {/* Google Sign In Button */}
  <GoogleSignInButton callbackUrl={`/`} />

  {/* Login Link */}
  <p className="mt-4 text-center text-sm text-gray-600">
    Already have an account?{' '}
    <Link
      href="/login"
      className="text-blue-500 hover:underline font-medium transition-colors"
    >
      Sign in
    </Link>
  </p>
</form>
      ) : (
        <div className="w-full max-w-md mx-auto p-6 shadow-lg border rounded-xl bg-white">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">
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
                ref={(el) => {
                  if (el) inputsRefs.current[index] = el;
                }}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowOtp(false)}
              className="text-blue-500 "
            >
             verify Otp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;