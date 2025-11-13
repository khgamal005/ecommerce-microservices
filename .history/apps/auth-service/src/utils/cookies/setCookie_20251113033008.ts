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
    sameSite: "none" as const, // Change from "none" to "lax" for local development
    secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in prod
    domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost", // Important for cross-subdomain
    path: "/", // Ensure cookies are accessible across all paths
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