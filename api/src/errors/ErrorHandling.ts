import { NextFunction } from 'express';

interface AppErrorInterface {
  message?: string;
  statusCode?: number;
  [key: string]: any;
}

export class AppError extends Error {
  statusCode?: number;
  [key: string]: any; 

  constructor({message = 'server.error.unknown', statusCode = 400, ...data}: AppErrorInterface = {}) {
    super(message);
    this.statusCode = statusCode;
    
    Object.assign(this, data);

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    // Capture the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (error: any, next: NextFunction) => {
  if (error instanceof AppError) {
      next(error);
  } else {
      next(new AppError({message:'server.error.unknown', statusCode:500}));
  }
};
