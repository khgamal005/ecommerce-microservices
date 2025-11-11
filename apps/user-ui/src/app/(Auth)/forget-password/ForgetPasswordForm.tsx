'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';


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

  const onSubmit = async (data: ForgetPasswordInputs) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('http://localhost:6001/api/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message || 'Error sending OTP');
        return;
      }

      setSuccessMessage('✅ OTP sent to your email');
    } catch (error) {
      setServerError('Server error, try again later.');
    }
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
