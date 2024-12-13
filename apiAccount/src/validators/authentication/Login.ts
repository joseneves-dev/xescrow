import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';

const loginSchema = z.object({
  email: z.string().email('emailAddress.required'),
  password: z.string().min(10, 'password.min'),
  reCaptcha: z.string()
}).strict();

export const login = (req:Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};