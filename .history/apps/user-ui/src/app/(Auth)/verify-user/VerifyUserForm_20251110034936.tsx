'use client';

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
      const res = await fetch('http://localhost:6001/api/verify-user', {
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
import Link from 'next/link';

<form
  onSubmit={handleSubmit(onSubmit)}
  className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white"
>
  <h2 className="text-2xl font-semibold mb-5 text-center">Create Account</h2>

  {/* NAME */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">Name</label>
    <input
      type="text"
      {...register('name', { required: 'Name is required' })}
      className="border rounded px-3 py-2 w-full"
    />
    <p className="text-red-600 text-sm mt-1">{errors.name?.message}</p>
  </div>

  {/* EMAIL */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">Email</label>
    <input
      type="email"
      {...register('email', { required: 'Email is required' })}
      className="border rounded px-3 py-2 w-full"
    />
    <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
  </div>

  {/* PASSWORD */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">Password</label>
    <input
      type="password"
      {...register('password', { required: 'Password is required' })}
      className="border rounded px-3 py-2 w-full"
    />
    <p className="text-red-600 text-sm mt-1">{errors.password?.message}</p>
  </div>

  {/* BACKEND ERROR */}
  {serverError && <p className="text-red-600 text-sm mb-3">{serverError}</p>}

  {/* SUCCESS */}
  {successMessage && <p className="text-green-600 text-sm mb-3">{successMessage}</p>}

  <button
    type="submit"
    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
  >
    Register
  </button>

  {/* Verify OTP Link */}
  <p className="mt-4 text-center text-sm text-gray-600">
    Already registered?{' '}
    <Link
      href="/verify-user"
      className="text-blue-500 hover:underline font-medium"
    >
      Verify your account
    </Link>
  </p>
</form>

  );
};

export default VerifyUserForm;
