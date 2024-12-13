import { Request, Response, NextFunction } from "express";

import { AppError } from "../../errors/ErrorHandling";

export async function errorCustomization(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    const statusCode = err.statusCode || 500;

    // Only set a message if one was explicitly provided or if it's the default AppError with no custom message
    const message =
      err.message !== "server.error.unknown" && err.message
        ? err.message
        : undefined;

    // Initialize an object to hold the error response
    const errorResponse: Record<string, any> = {};

    if (message) {
      errorResponse.message = message;
    }

    // Include dynamic properties if they exist
    for (const key in err) {
      if (
        err.hasOwnProperty(key) &&
        key !== "message" &&
        key !== "statusCode" &&
        key !== "stack" &&
        key !== "name"
      ) {
        errorResponse[key] = err[key];
      }
    }

    if (err.statusCode === 401) {
      res.cookie("access", "", {
        maxAge: 0,
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });
      res.cookie("refresh", "", {
        maxAge: 0,
        httpOnly: true,
        signed: true,
        domain: process.env.NODE_DOMAIN,
        secure: true,
        sameSite: "lax",
      });
    }

    res.status(statusCode).send({
      ...errorResponse,
    });
  }

  next();
}
