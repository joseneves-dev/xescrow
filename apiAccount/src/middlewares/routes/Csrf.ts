import { Request, Response, NextFunction } from "express";

import { doubleCsrf } from "csrf-csrf";
import { AppError } from '../../errors/ErrorHandling';

export const { invalidCsrfTokenError, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.COOKIE_CSRF,
    cookieName: "x-csrf-token",
    cookieOptions: { 
        sameSite: "strict", 
        path: "/",
        secure: true, 
        signed: true
    },
});

export const csrfErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error === invalidCsrfTokenError) {
        throw new AppError({message:'server.csrf.invalid', statusCode:  403});
    } else {
        next();
    }
};