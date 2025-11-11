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

    {/* Google Sign In Button */}
    <button
      type="button"
      onClick={handleGoogleSignIn} // You'll need to implement this function
      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium transition-colors duration-200"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign in with Google
    </button>

    {/* Register Link */}
    <p className="mt-4 text-center text-sm text-gray-600">
      Don't have an account?{' '}
      <Lin
        href="/register-user"
        className="text-blue-500 hover:underline font-medium"
      >
        Register
      </Link>
    </p>
  </form>
</div>