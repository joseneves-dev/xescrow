import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';
import { UserPhoneNumber } from '../../database/models/account/UserPhoneNumber';

const phoneExists = async (value) => {
  const userPhone = await UserPhoneNumber.count({
    where: {
      number: value,
      active: true
    },
  });

  return userPhone === 0; 
};

const createSchema = z.object({
  code: z.string().min(3, 'country.code.invalid'),
  number: z
    .string()
    .min(9, 'phoneNumber.invalid')
    .refine(async (value) => await phoneExists(value), {
      message: 'phoneNumber.unique',
    }),
}).strict();

export const create = async (req:Request, res: Response, next: NextFunction) => {
  try {
    await createSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};

const updateSchema = z.object({
  code: z.string().min(3, 'country.code.invalid'),
  number: z
    .number()
    .min(9, 'phoneNumber.invalid')
    .refine(async (value) => await phoneExists(value), {
      message: 'phoneNumber.unique',
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

export const verification = (req:Request, res: Response, next: NextFunction) => {
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

const removeSchema = z.object({
  token: z.string()
        .min(6, 'token.min')
        .optional(),
}).strict();

export const remove = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const value = req.body.token;
    await removeSchema.parseAsync({ token: value });
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};

const newRemoveSchema = z.object({}).strict();

export const newRemove = async (req:Request, res: Response, next: NextFunction) => {
  try {
    newRemoveSchema.parse(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};