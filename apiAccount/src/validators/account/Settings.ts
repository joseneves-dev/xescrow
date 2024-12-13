import { Request, Response, NextFunction } from 'express';

import { z, ZodError } from 'zod';

const updateSchema = z.object({
  colorSchema: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional()
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