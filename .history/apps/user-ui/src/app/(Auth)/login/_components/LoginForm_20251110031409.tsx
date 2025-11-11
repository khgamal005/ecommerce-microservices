'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type LoginInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginInputs) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('http://localhost:6001/api/auth/login-user', {
        method: 'POST',
        credentials: 'include', // ✅ send/receive httpOnly cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message || 'Invalid login credentials');
        return;
      }

      setSuccessMessage('✅ Logged in successfully');

      // Optional: redirect to dashboard
      // router.push("/dashboard")

    } catch (error) {
      setServerError('Server error. Try again later.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white"
    >
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Login to Your Account
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

      {/* PASSWORD */}
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-red-600 text-sm mt-1">{errors.password?.message}</p>
      </div>

      {/* BACKEND ERROR */}
      {serverError && (
        <p className="text-red-500 text-sm mb-3">{serverError}</p>
      )}

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <p className="text-green-600 text-sm mb-3">{successMessage}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
