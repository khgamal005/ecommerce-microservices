'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type VerifyInputs = {
  name: string;
  email: string;
  password: string;
  otp: string;
};

const VerifyUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyInputs>();

  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: VerifyInputs) => {
    setMessage(null);
    setServerError(null);

    try {
      const res = await fetch('http://localhost:6001/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message || 'Invalid OTP');
        return;
      }

      setMessage('✅ Account verified successfully');
    } catch (error) {
      setServerError('Server error, try again later.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-6 mt-10 border shadow rounded-lg bg-white"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Verify Your Account
      </h2>

      {/* NAME */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-red-600 text-sm mt-1">{errors.name?.message}</p>
      </div>

      {/* EMAIL */}
      <div className="mb-3">
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
      </div>

      {/* PASSWORD */}
      <div className="mb-3">
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-red-600 text-sm mt-1">{errors.password?.message}</p>
      </div>

      {/* OTP */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Enter OTP"
          {...register('otp', { required: 'OTP is required' })}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-red-600 text-sm mt-1">{errors.otp?.message}</p>
      </div>

      {/* Backend Error */}
      {serverError && (
        <p className="text-red-500 text-sm mb-2">{serverError}</p>
      )}

      {/* Success Message */}
      {message && (
        <p className="text-green-600 text-sm mb-2">{message}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        Verify Account
      </button>
        {/* Verify OTP Link */}
  <p className="mt-4 text-center text-sm text-gray-600">
    Already registered?{' '}
    <Link
      href="/login"
      className="text-blue-500 hover:underline font-medium"
    >
      Login here
    </Link>
  </p>
    </form>
  );
};

export default VerifyUserForm;
