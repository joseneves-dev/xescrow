import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';
import { UserEmailAddress } from '../../database/models/account/UserEmailAddress';

const emailExists = async (value: string) => {
  const userEmailCount = await UserEmailAddress.count({
    where: {
      email: value,
      active: true
    },
  });

  return userEmailCount === 0;
};

const signupSchema = z.object({
  firstName: z.string().min(3, 'firstName.invalid'),
  lastName: z.string().min(3, 'lastName.invalid'),
  country: z.string(),
  email: z
    .string()
    .email('emailAddress.invalid')
    .refine(async (value) => {
      return await emailExists(value) === true;
    }, {
      message: 'emailAddress.unique',
    }),
  password: z.string()
    .min(10, {
      message: 'password.min',
    })
    .regex(/[a-z]/, {
      message: 'password.lowercase',
    })
    .regex(/[A-Z]/, {
      message: 'password.uppercase',
    })
    .regex(/\d/, {
      message: 'password.numeric',
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'password.specialCharacter',
    }),
  settings: z.object({
    language: z.string().min(1, 'language.invalid'),
    timezone: z.string().min(1, 'timezone.invalid'),
    colorSchema: z.string().min(1, 'colorSchema.invalid'),
  }),
  reCaptcha: z.string()
}).strict();

export const signup = async (req:Request, res: Response, next: NextFunction) => {
  try {
    await signupSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};