'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type ResetInputs = {
  email: string;
  newPassword: string;
};

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetInputs>();

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: ResetInputs) => {
    setServerError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:6001/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message || "Error resetting password");
        return;
      }

      setSuccess("✅ Password reset successfully!");
      
      // Optional: redirect to login page
      // router.push("/login");

    } catch (error) {
      setServerError("Server error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto mt-10 p-6 shadow-lg border rounded-xl bg-white"
    >
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Reset Password
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

      {/* NEW PASSWORD */}
      <div className="mb-4">
        <input
          type="password"
          placeholder="New Password"
          {...register("newPassword", { required: "New password is required" })}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-red-600 text-sm mt-1">{errors.newPassword?.message}</p>
      </div>

      {/* BACKEND ERROR */}
      {serverError && (
        <p className="text-red-500 text-sm mb-3">{serverError}</p>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <p className="text-green-600 text-sm mb-3">{success}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPasswordForm;
