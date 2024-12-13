import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';

const verificationSchema = z.object({
  token: z.string().min(6, 'token.min'),
  trust_device: z.boolean().optional()
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