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
      const res = await fetch('http://localhost:6001/api/login-user', {
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
    

  );
};

export default LoginForm;
