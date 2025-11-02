import { Request, Response, NextFunction } from "express";
import { ApiError } from "./index";

/**
 * Global Express error-handling middleware
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is an instance of our custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }), // ✅ spread only if details exist
    });
  }

  // For unexpected / programming errors
  console.error("💥 Unexpected Error:", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong on the server",
  });
};
