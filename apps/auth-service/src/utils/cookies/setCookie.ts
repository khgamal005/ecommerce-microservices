// utils/cookieUtils.ts
import { Response } from "express";

interface CookieOptions {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Sets HTTP-only cookies for authentication
 */
export const setAuthCookies = (
  res: Response,
  { accessToken, refreshToken }: CookieOptions
) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    // domain: isProduction ? ".yourdomain.com" : "localhost",
    path: "/",
  };

  // Access Token (1 hour)
  res.cookie("accessToken", accessToken, {
    ...baseOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  // Refresh Token (optional - 7 days)
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      ...baseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};

/**
 * Clears authentication cookies (for logout)
 */
export const clearAuthCookies = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === "production";
  
  const clearOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    // domain: isProduction ? ".yourdomain.com" : "localhost",
    path: "/",
    maxAge: 0, // Expire immediately
  };

  res.cookie("accessToken", "", clearOptions);
  res.cookie("refreshToken", "", clearOptions);
};