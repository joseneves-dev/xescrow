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

const createAccountSchema = z
  .object({
    blockchain: z.string().min(3, "blockchain.invalid"),
    token: z.string().min(3, "blockchain.token.invalid"),
    currency: z.string().min(3, "currency.invalid").optional(),
  })
  .strict();

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    createAccountSchema.parse(req.body);
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

const createTokenAccountSchema = z.object({
  token: z.string().min(3, "blockchain.token.invalid"),
  publicKey: z.string().refine(validPublicKey, {
    message: "publickey.invalid",
  }),
});

export const createTokenAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    createTokenAccountSchema.parse(req.body);
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

const importAccountSchema = z
  .object({
    publicKey: z.string().refine(validPublicKey, {
      message: "publickey.invalid",
    }),
    blockchain: z.string().min(3, "blockchain.invalid"),
    currency: z.string().min(3, "currency.invalid").optional(),
  })
  .strict();

export const importAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    importAccountSchema.parse(req.body);
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

const connectWalletSchema = z
  .object({
    publicKey: z.string().refine(validPublicKey, {
      message: "publickey.invalid",
    }),
    blockchain: z.string().min(3, "blockchain.invalid"),
    currency: z.string().min(3, "currency.invalid").optional(),
  })
  .strict();

export const connectWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    connectWalletSchema.parse(req.body);
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

const saveSecretkeySchema = z.object({
  publicKey: z.string().refine(validPublicKey, {
    message: "publickey.invalid",
  }),
  secretKey: z.string().min(88, "secretKey.invalid"),
});

export const saveSecretkey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    saveSecretkeySchema.parse(req.body); // Validate 'publicKey' only
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
