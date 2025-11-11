'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ useRouter import for App Router
import { Toaster } from '../../../../components/ui/toaster';
import { toast } from 'apps/user-ui/src/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import GoogleSignInButton from '../../../shared/components/google-button/GoogleSignInButton';

type LoginInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();
  // ✅ initialize router

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data: LoginInputs) => {
    try {
      const res = await fetch('http://localhost:6001/api/login-user', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      // Use your custom toast with dynamic color
      toast({
        title:
          json.message || (res.ok ? 'Logged in successfully' : 'Login failed'),
        className: res.ok ? 'text-green-500' : 'text-red-500',
      });

      if (res.ok) {
        router.push('/'); // navigate to home/dashboard
      }
    } catch (error) {
      toast({
        title: 'Server error. Try again later.',
        className: 'text-red-500',
      });
    }
  };

  return (
    <>
      <Toaster /> {/* render once, bottom-right */}
<div className="w-full p-y">
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
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <p className="text-red-600 text-sm mt-1">
        {errors.password?.message}
      </p>
    </div>

    {/* Remember Me & Forgot Password */}
    <div className="flex justify-between items-center mb-4">
      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
          Remember me
        </label>
      </div>

      {/* Forgot Password */}
      <Link
        href="/forget-password"
        className="text-sm text-blue-500 hover:underline"
      >
        Forgot Password?
      </Link>
    </div>

    {/* Sign In Button */}
    <button
      type="submit"
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors duration-200 mb-4"
    >
      Sign In
    </button>

    {/* Divider */}
    <div className="flex items-center my-6">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="mx-4 text-sm text-gray-500">Or continue with</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>

      {/* BACKEND ERROR */}
  {serverError && <p className="text-red-600 text-sm mb-3">{serverError}</p>}

  {/* SUCCESS */}
  {successMessage && <p className="text-green-600 text-sm mb-3">{successMessage}</p>}

    {/* Google Sign In Button */}
            <GoogleSignInButton callbackUrl={`/`} />


    {/* Register Link */}
    <p className="mt-4 text-center text-sm text-gray-600">
      Don't have an account?{' '}
      <Link
        href="/register-user"
        className="text-blue-500 hover:underline font-medium"
      >
        Register
      </Link>
    </p>
  </form>
</div>
    </>
  );
};

export default LoginForm;
