'use client';

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm () {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showOtp, setShowOtp] = useState(true);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [userEmail, setUserEmail] = useState("");

  // ✅ Timer Logic
  const startTimer = () => {
    setTimer(60);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
        }
        return t - 1;
      });
    }, 1000);
  };

  // ✅ Handle OTP Input
  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (index: number, value: string) => {
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Submit Registration
  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("http://localhost:6001/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setLoading(false);

      if (!res.ok) {
        setServerError(json.message);
        return;
      }

      setUserEmail(data.email); // ✅ Save email for resend OTP
      setSuccessMessage(json.message);
      setShowOtp(true);
      startTimer();
    } catch {
      setLoading(false);
      setServerError("Server error. Please try again.");
    }
  };

  // ✅ Verify OTP
  const verifyOtpHandler = async () => {
    const code = otp.join("");

    if (code.length !== 4) {
      setServerError("Enter the full 4-digit code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:6001/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otp: code }),
      });

      const json = await res.json();
      setLoading(false);

      if (!res.ok) {
        setServerError(json.message);
        return;
      }

      setSuccessMessage("✅ Account verified successfully!");
    } catch {
      setLoading(false);
      setServerError("Server error. Please try again.");
    }
  };

  // ✅ Resend OTP
  const resendOtp = async () => {
    try {
      await fetch("http://localhost:6001/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      startTimer();
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {/* ✅ Registration Screen */}
      {!showOtp && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-3xl font-bold text-center mb-4">Create Account</h2>

          {serverError && <p className="text-red-600">{serverError}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
            className="border rounded px-3 py-2 w-full"
          />
          <p className="text-red-600 text-sm">{errors.name?.message}</p>

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            {...register("email", { required: "Email is required" })}
            className="border rounded px-3 py-2 w-full"
          />
          <p className="text-red-600 text-sm">{errors.email?.message}</p>

          {/* Password */}
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="border rounded px-3 py-2 w-full"
            />

            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-red-600 text-sm">{errors.password?.message}</p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Register"}
          </button>
        </form>
      )}

      {/* ✅ OTP Screen */}
      {showOtp && (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center">Verify OTP</h2>

          {/* OTP Boxes */}
          <div className="flex justify-center gap-3 my-6">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                maxLength={1}
                value={digit}
                ref={(el) => {
                  if (el) inputRefs.current[idx] = el;
                }}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Backspace" && handleBackspace(idx, digit)
                }
                className="w-14 h-14 text-center text-2xl border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            onClick={verifyOtpHandler}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
          </button>

          {/* Resend Timer */}
          <div className="text-center mt-2">
            {canResend ? (
              <button
                onClick={resendOtp}
                className="text-blue-500 hover:underline font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-600">
                Resend OTP in{" "}
                <span className="text-blue-500 font-semibold">{timer}</span>s
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
