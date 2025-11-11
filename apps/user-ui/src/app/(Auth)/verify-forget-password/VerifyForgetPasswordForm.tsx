'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type VerifyForgetInputs = {
  email: string;
  otp: string;
};

const VerifyForgetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForgetInputs>();

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: VerifyForgetInputs) => {
    setServerError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:6001/api/verify-user-forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message || "Invalid OTP");
        return;
      }

      setSuccess("OTP verified successfully ✅");

      // Optional → redirect to reset password page
      // router.push("/reset-password")

    } catch (error) {
      setServerError("Server error, try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white"
    >
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Verify OTP
      </h2>

      {/* EMAIL */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
      </div>

      {/* OTP */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter OTP"
          {...register("otp", { required: "OTP is required" })}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-red-600 text-sm mt-1">{errors.otp?.message}</p>
      </div>

      {serverError && <p className="text-red-500 text-sm mb-3">{serverError}</p>}
      {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
      >
        Verify OTP
      </button>
       <p className="mt-4 text-center text-sm text-gray-600">
    Already registered?{' '}
    <Link
      href="/reset-password"
      className="text-blue-500 hover:underline font-medium"
    >
      Reset Password
    </Link>
  </p>
    </form>
  );
};

export default VerifyForgetPasswordForm;
