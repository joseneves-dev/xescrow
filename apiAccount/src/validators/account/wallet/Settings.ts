import { Request, Response, NextFunction } from "express";

import { z, ZodError } from "zod";

import { PublicKey } from "@solana/web3.js";

// Function to check if the string is a valid Solana public key
const validPublicKey = (key: string): boolean => {
  try {
    new PublicKey(key); // Attempt to create a PublicKey instance
    return true; // Return true if no error is thrown
  } catch (error) {
    return false; // Return false if an error occurs
  }
};

const requestSecretKeySchema = z
  .object({
    method: z
      .string({ required_error: "method.required" })
      .refine(
        (value) => value === "email" || value === "phone" || value === "app",
        {
          message: "method.invalid",
        }
      ),
    publicKey: z.string().refine(validPublicKey, {
      message: "publickey.invalid",
    }),
  })
  .strict();

export const requestSecretKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requestSecretKeySchema.parse(req.body); // Validate 'token_symbol' only
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422).json({
        fieldErrors: error.formErrors.fieldErrors,
        formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined,
      });
    } else {
      res.status(500).json({ message: "server.error.unknown" });
    }
  }
};

const requestRemoveSchema = z
  .object({
    method: z
      .string({ required_error: "method.required" })
      .refine(
        (value) =>
          value === "emailAddress" ||
          value === "phoneNumber" ||
          value === "app",
        {
          message: "method.invalid",
        }
      ),
    publicKey: z.string().refine(validPublicKey, {
      message: "publickey.invalid",
    }),
  })
  .strict();

export const requestRemove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    requestRemoveSchema.parse(req.body); // Validate 'token_symbol' only
    next();
  } catch (error) {
    // Handle the specific error for 'token_symbol'
    res.status(400).json({ message: error.errors[0].message });
  }
};

const secretKeySchema = z
  .object({
    token: z.string().min(6, "token.invalid"),
    publicKey: z.string().refine(validPublicKey, {
      message: "publickey.invalid",
    }),
  })
  .strict();

export const secretKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    secretKeySchema.parse(req.body); // Validate 'token_symbol' only
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422).json({
        fieldErrors: error.formErrors.fieldErrors,
        formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined,
      });
    } else {
      res.status(500).json({ message: "server.error.unknown" });
    }
  }
};
