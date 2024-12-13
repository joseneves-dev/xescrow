import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';

const forgotSchema = z.object({
  email: z.string().email('emailAddress.invalid'),
  reCaptcha: z.string()
}).strict();

export const forgot = (req:Request, res: Response, next: NextFunction) => {
  try {
    forgotSchema.parse(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};

const resetSchema = z.object({
  token: z.string(),
  request: z.string(),
  newPassword: z.string()
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
  confirmPassword: z.string()
    .min(10, 'password.invalid'),
  reCaptcha: z.string()
})
.strict()
.refine(data => data.newPassword == data.confirmPassword, {
  message: "password.match",
  path: ['confirmPassword'] 
});

export const reset = (req:Request, res: Response, next: NextFunction) => {
  try {
    resetSchema.parse(req.body);
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
  currentPassword: z.string().min(10, 'password.invalid'),
  newPassword: z.string()
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
}).strict();

export const update = (req:Request, res: Response, next: NextFunction) => {
  try {
    updateSchema.parse(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};