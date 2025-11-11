import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ✅ Start timer
  const startTimer = () => {
    setCanResend(false);
    setTimer(60);

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

  // ✅ Submit Registration
  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("http://localhost:6001/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message || "Something went wrong");
        return;
      }

      setSuccessMessage(json.message);

      // ✅ Show OTP input UI
      setShowOtp(true);

      // ✅ Start 60 sec cooldown
      startTimer();
    } catch (err) {
      setServerError("Server error. Please try again.");
    }
  };

  // ✅ Resend OTP
  const ResendOtp = async () => {
    try {
      await fetch("http://localhost:6001/api/resend-otp", {
        method: "POST",
      });

      startTimer();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      
      {/* ✅ Registration Form */}
      {!showOtp && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Register</h2>

          {serverError && <p className="text-red-600">{serverError}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}

          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
              className="border rounded px-3 py-2 w-full"
            />
            <p className="text-red-600 text-sm">{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="border rounded px-3 py-2 w-full"
            />
            <p className="text-red-600 text-sm">{errors.email?.message}</p>
          </div>

          {/* Password + Eye Icon */}
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

            <p className="text-red-600 text-sm">{errors.password?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Register
          </button>
        </form>
      )}

      {/* ✅ OTP Screen */}
      {showOtp && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Verify OTP</h2>

          <button
            onClick={() => setShowOtp(false)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium text-lg"
          >
            Verify OTP
          </button>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={ResendOtp}
                className="text-blue-500 hover:text-blue-600 font-medium text-sm hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-600 text-sm">
                Resend OTP in{" "}
                <span className="font-medium text-blue-500">{timer}</span>{" "}
                seconds
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
