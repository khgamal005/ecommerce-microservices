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

  // ✅ React Query — Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetInputs) => {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error resetting password');
      return { json, data };
    },

    onSuccess: ({ json }) => {
      setSuccess(json.message || '✅ Password reset successfully!');
      // Optional: redirect after success
      // setTimeout(() => router.push("/login"), 2000);
    },

    onError: (err: any) => {
      setServerError(err.message || 'Server error. Please try again.');
    },
  });

  // ✅ onSubmit for the form
  const onSubmit = (data: ResetInputs) => {
    setServerError(null);
    setSuccess(null);
    resetPasswordMutation.mutate(data);
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
          {...register('email', { required: 'Email is required' })}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-red-600 text-sm mt-1">{errors.email?.message}</p>
      </div>

      {/* NEW PASSWORD */}
      <div className="mb-4">
        <input
          type="password"
          placeholder="New Password"
          {...register('newPassword', { required: 'New password is required' })}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-red-600 text-sm mt-1">
          {errors.newPassword?.message}
        </p>
      </div>

      {/* BACKEND ERROR */}
      {serverError && (
        <p className="text-red-500 text-sm mb-3">{serverError}</p>
      )}

      {/* SUCCESS MESSAGE */}
      {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

      <button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg flex items-center justify-center"
      >
        {resetPasswordMutation.isPending && (
          <Loader2 className="animate-spin mr-2" />
        )}
        {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
