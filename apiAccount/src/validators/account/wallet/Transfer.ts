import { Request, Response, NextFunction } from "express";

import { z, ZodError } from "zod";

const normalSchema = z
  .object({
    token: z.string().min(6, "token.length").optional(),
    tx: z.string(),
    transaction: z.object({
      request: z.string(),
    }),
  })
  .strict();

export const normal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await normalSchema.parseAsync(req.body);
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

const escrowSchema = z
  .object({
    token: z.string().min(6, "token.length").optional(),
    tx: z.string(),
    transaction: z.object({
      request: z.string(),
      initialize: z.boolean().optional(),
      mint: z.string().optional(),
      escrowAccount: z.string(),
    }),
  })
  .strict();

export const escrow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await escrowSchema.parseAsync(req.body);
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
