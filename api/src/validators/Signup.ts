import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';
import { SignUpEmailAddress } from '../database/models/SignUpEmailAddress';

const emailExists = async (value: string) => {
  const userEmailCount = await SignUpEmailAddress.count({
    where: {
      email: value,
      active: true
    },
  });

  return userEmailCount === 0;
};

const subscribeSchema = z.object({
  email: z
    .string()
    .email('emailAddress.invalid')
    .refine(async (value) => {
      return await emailExists(value) === true;
    }, {
      message: 'emailAddress.unique',
    }),
  language: z.string().min(2, 'language.invalid'),
  reCaptcha: z.string()
}).strict();

export const subscribe = async (req:Request, res: Response, next: NextFunction) => {
  try {
    await subscribeSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};


const unsubscribeSchema = z.object({
  email: z
    .string()
    .email('emailAddress.invalid'),
  language: z.string().min(2, 'language.invalid'),
  token: z.string(),
  reCaptcha: z.string()
}).strict();

export const unsubscribe = async (req:Request, res: Response, next: NextFunction) => {
  try {
    await unsubscribeSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};