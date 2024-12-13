import { Request, Response, NextFunction } from "express";

import { AppError } from '../errors/ErrorHandling';

export async function errorCustomization(err: AppError, req: Request, res: Response, next: NextFunction) {

    if (err) {
        const statusCode = err.statusCode || 500;

        const message = err.message || undefined;
    
        // Initialize an object to hold the error response
        const errorResponse: Record<string, any> = { message };

        // Include dynamic properties if they exist
        for (const key in err) {
           if (err.hasOwnProperty(key) && key !== 'message' && key !== 'statusCode' && key !== 'stack' && key !== 'name') {
               errorResponse[key] = err[key];
           }
        }

        // Send the error response
        res.status(statusCode).send({
            ...errorResponse
        });
    }

    next();
}