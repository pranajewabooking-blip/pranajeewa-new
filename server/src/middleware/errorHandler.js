import { env } from "../config/env.js";

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || error.status || 500;

  if (error.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists" });
  }

  res.status(statusCode).json({
    message: error.message || "Server error",
    ...(env.nodeEnv !== "production" ? { stack: error.stack } : {})
  });
};
