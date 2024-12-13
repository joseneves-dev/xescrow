import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';

const updateAccountSchema = z.object({
    property: z.enum(['verifications', 'login', 'updates']),
}).strict();

export const updateAccount = async (req:Request, res: Response, next: NextFunction) => {
  try {
    await updateAccountSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError){
      res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
    }else{
      res.status(500).json({ message: 'server.error.unknown' });
    }
  }
};

const updateMarketingSchema = z.object({
    property: z.enum(['email', 'phone', 'app', 'partners']),
}).strict();
    
export const updateMarketing = async (req:Request, res: Response, next: NextFunction) => {
    try {
        await updateMarketingSchema.parseAsync(req.body);
        next();
    } catch (error) {
      if(error instanceof ZodError){
        res.status(422).json({fieldErrors: error.formErrors.fieldErrors,  formErrors: error.formErrors.formErrors.length !== 0 ? true : undefined });
      }else{
        res.status(500).json({ message: 'server.error.unknown' });
      }
    }
};
    
