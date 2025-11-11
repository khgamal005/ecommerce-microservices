'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

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
  const [otp, setOtp] = useState('');
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputsRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    } catch (err) {
      setServerError('Server error. Please try again.');
    }
  };

  return (
    <></>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white"
    >
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Create Account
      </h2>

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
      <div className="mb-2 relative">
        <input
          type={passwordVisible ? 'text' : 'password'}
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Toggle Icon Button */}
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        <p className="text-red-600 text-sm mt-1">{errors.password?.message}</p>
      </div>

      {/* BACKEND ERROR */}
      {serverError && (
        <p className="text-red-600 text-sm mb-3">{serverError}</p>
      )}

      {/* SUCCESS */}
      {successMessage && (
        <p className="text-green-600 text-sm mb-3">{successMessage}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
      >
        Register
      </button>

      {/* Verify OTP Link */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Do You have any account?{' '}
        <Link
          href="/login"
          className="text-blue-500 hover:underline font-medium"
        >
          login
        </Link>
      </p>
    </form>
    
  );
};

export default RegisterForm;
