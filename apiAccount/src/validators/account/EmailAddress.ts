import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';
import { UserEmailAddress } from '../../database/models/account/UserEmailAddress';

const emailExists = async (value:string) => {
  const userEmailCount = await UserEmailAddress.count({
    where: {
      email: value,
      active: true
    },
  });

  // Returning true if email does not exist, false if it does
  return userEmailCount === 0;
};

const updateSchema = z.object({
  email: z
    .string()
    .email('emailAddress.invalid')
    .refine(async (value) => await emailExists(value), {
      message: 'emailAddress.unique',
    })
}).strict();

export const update = async (req:Request, res: Response, next: NextFunction) => {
  try {
    await updateSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};

const verificationSchema = z.object({
  token: z.string().min(6, 'token.min'),
}).strict();

export const verification = async (req:Request, res: Response, next: NextFunction) => {
  try {
    verificationSchema.parse(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};

const newVerificationSchema = z.object({}).strict();

export const newVerification = async (req:Request, res: Response, next: NextFunction) => {
  try {
    newVerificationSchema.parse(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};