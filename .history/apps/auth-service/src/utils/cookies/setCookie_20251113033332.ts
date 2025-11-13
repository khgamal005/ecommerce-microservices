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
  // ✅ Shared cookie config
  const baseOptions = {
   httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production", // true in prod, false in dev
  };

  // ✅ Access Token (1 hour)
  res.cookie("accessToken", accessToken, {
    ...baseOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  // ✅ Refresh Token (optional)
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      ...baseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};