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
    <div>

   

     </div>
    
  );
};

export default RegisterForm;
