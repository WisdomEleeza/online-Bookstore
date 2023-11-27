import { NextFunction, Request, Response } from "express";
import HttpException from "@/utils/http.exception";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const status = error.status || 500; // Use the status from HttpException or default to 500
  const message = error.message || "Something went wrong"; // Use the message from HttpException or default to "Something went wrong"

  // Set the HTTP status and send a JSON response with status and message
  res.status(status).json({
    status,
    message,
  });
  next();
}

export default errorMiddleware;
